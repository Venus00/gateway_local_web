import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { validationEmail } from "src/common/template-mail/validationEmail";
import { hashCompare, hashGenerate } from "src/common/utils/hash";
import { GetLoggedInUserResponseDto, LoginUserRequestDto, RegisterUserRequestDto } from "./auth.dto";
import { plainToClass } from "class-transformer";
import { UsersService } from "src/users/users.service";
import { TenantService } from "src/users/tenant.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { MailService } from "./email.service";
import { JwtPayload } from "./jwt-payload";
import { v4 as uuidv4 } from 'uuid';
import { forgetPasswordEmail } from "src/common/template-mail/forgotPasswordEmail";
import { PasswordUpdatedEmail } from "src/common/template-mail/PasswordUpdatedEmail";
import { AccountVerified } from "src/common/template-mail/AccountVerified";
import { BrokerService } from "src/broker/broker.service";

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly brokerService: BrokerService,
    private readonly userService: UsersService,
    private readonly tenantService: TenantService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) { }

  // Fetch logged in user for a specific tenant
  async getLoggedInUser(userId: number, tenantSlug: string) {
    return this.userService.getUserById(userId, tenantSlug);
  }

  async loginUser(data: LoginUserRequestDto, tenantSlug: string) {
    if (!data.email || !data.password)
      throw new BadRequestException('Email or password not provided');
    const user = await this.userService.getUserByEmail(data.email, tenantSlug);
    if (!user) throw new UnauthorizedException('Invalid Credentials');
    if (!user.password || !user.email)
      throw new UnauthorizedException('Invalid Credentials');
    const validPassword = await hashCompare(
      data.password,
      user.password,
      this.configService.get<string>('APP_SECRET') || '',
    );

    if (!validPassword) throw new UnauthorizedException('Invalid Credentials');
    if (user?.isVerified) {
      const tokens = await this.getTokens({
        sub: user.id,
        email: user.email,
        tenantId: user.tenantId,
        role: user.role,
        permissions: [],
      });

      await this.updateRefreshToken(user.id, tokens.refreshToken, tenantSlug);

      return {
        ...plainToClass(GetLoggedInUserResponseDto, user),
        ...tokens,
      };
    }
    throw new UnauthorizedException('Account Still Not Verified');

  }

  // Email verification logic for a specific tenant
  async verifyEmail(token: string, tenantSlug: string) {
    const user = await this.userService.findByToken(token, tenantSlug);
    if (!user?.userId) throw new Error('Invalid token');

    const userRow = await this.userService.findUserById(user.userId, tenantSlug);
    if (!userRow) throw new Error('Invalid User');
    if (userRow.isVerified) {
      throw new Error('Already Verified');
    } else {
      await this.userService.markAsVerified(userRow.id, tenantSlug);
      return 'Email verified successfully';
    }
  }
  async verifyEmailByGAdmin(id: number, tenantSlug: string) {
    const userRow = await this.userService.findUserById(id, tenantSlug);
    if (!userRow) throw new Error('Invalid User');
    if (userRow.isVerified) {
      throw new Error('Already Verified');
    } else {
      const verifiedUser = await this.userService.markAsVerified(userRow.id, tenantSlug);
      if (verifiedUser) {
        console.log(verifiedUser, 'verifiedUser');

        const oauth = await this.mailService.authorize();
        const html = AccountVerified.replaceAll(
          '[User name]',
          `${userRow.name}`,
        )
          .replaceAll(
            '[App Link]',
            `${process.env.FORGOT_PASSWORD_URL}`,
          )
        this.mailService.sendEmail(oauth, userRow?.email, 'Account Verified', html);
      }
      return true;
    }
  }
  async forgetPassword(data: any, tenantSlug: string) {
    const userRow = await this.userService.getUserByEmail(data.email, tenantSlug);
    if (!userRow) throw new Error('Invalid User');
    const resetToken = await this.generatePasswordResetToken(userRow.id);

    const oauth = await this.mailService.authorize();
    const html = forgetPasswordEmail.replaceAll(
      '[Reset Password Link]',
      `${process.env.FORGOT_PASSWORD_URL}/forgot-password?token=${resetToken}`,
    );
    this.mailService.sendEmail(oauth, data.email, 'forgetPasswordEmail', html);

  }
  async generatePasswordResetToken(userId: number): Promise<string> {
    const token = uuidv4() // Cryptographically secure
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Store the token in DB (invalidate old tokens for this user)
    await this.userService.storeResetToken(userId, token, expiresAt);
    return token;
  }
  async generatePassword(password: string) {
    return await hashGenerate(
      password,
      this.configService.get<string>('APP_SECRET') || '',
    );
  }

  async registerUser(data: RegisterUserRequestDto, tenantSlug: string) {
    if (!data.email || !data.password || !data.tenantName)
      throw new BadRequestException('Email, password or workspace name not provided');

    const userExists = await this.userService.getUserByEmail(data.email, tenantSlug);
    if (userExists) throw new BadRequestException('Email already exists');
    const tenantexists = await this.tenantService.getTenantByName(data.tenantName);
    if (tenantexists) throw new BadRequestException('Workspace name already in use');
    if (data.email === '') throw new BadRequestException('Invalid email format');

    const hashedPassword = await hashGenerate(
      data.password,
      this.configService.get<string>('APP_SECRET') || '',
    );

    let newUser;
    if (!data.tenantId) {
      const tenant = await this.tenantService.createUserTenant({
        name: data.tenantName,
      });
      if (tenant) {
        const broker = await this.brokerService.addBroker({
          tenantId: +tenant?.id,
          clientId: `local_broker_${tenant?.id}`,
          topic: 'nxt/devices/+/data',
          ip: process.env.BROKER_URL || '154.144.229.22',
          port: 1883,
          name: `local_broker_${tenant?.id}`,
          host: process.env.BROKER_URL || '154.144.229.22',
          username: process.env.MQTT_WORKER_USERNAME || 'digisense_worker',
          password: process.env.MQTT_WORKER_PASSWORD || 'digisense_worker',
          hide: true,
        }, tenantSlug)
        newUser = await this.userService.createUser({
          ...data,
          password: hashedPassword,
          tenantId: tenant.id,
          role: 'admin',
        });
        // Set tenant Admin
        await this.tenantService.updateTenant({
          id: tenant.id,
          adminId: newUser.id,
        });
      }
    } else {
      newUser = await this.userService.createUser({
        ...data,
        password: hashedPassword,
        tenantId: data.tenantId,
        role: 'user',
      });
      const token = uuidv4();
      const userVerification = await this.userService.createUserVerification(
        token,
        newUser.id,
      );

      const oauth = await this.mailService.authorize();
      const html = validationEmail.replaceAll(
        '[Activation Link]',
        `${process.env.SERVER_PRIMARY_DNS}/api/v1/auth/verify?token=${token}`,
      );

      this.mailService.sendEmail(oauth, data.email, 'ValidationEmail', html);
    }

    // const token = uuidv4();
    // const userVerification = await this.userService.createUserVerification(
    //   token,
    //   newUser.id,
    // );

    // const oauth = await this.mailService.authorize();
    // const html = validationEmail.replaceAll(
    //   '[Activation Link]',
    //   `${process.env.SERVER_PRIMARY_DNS}/api/v1/auth/verify?token=${token}`,
    // );

    // this.mailService.sendEmail( data.email, 'ValidationEmail', html);
    return newUser;
  }
  async resetPassword(data: any, tenantSlug: string) {
    if (!data.password || !data.token)
      throw new BadRequestException('password or token not provided');
    const token = await this.userService.findResetToken(data.token, tenantSlug);
    if (token.used) { throw new BadRequestException('token already used'); }
    if (this.isTokenExpired(token.expiresAt)) {
      throw new BadRequestException('Token has expired');
    }
    const userToken = await this.userService.findByResetToken(data.token, tenantSlug);
    if (!userToken?.userId) throw new Error('Invalid token');
    const user = await this.userService.getUserById(userToken?.userId, tenantSlug);
    const hashedPassword = await hashGenerate(
      data.password,
      this.configService.get<string>('APP_SECRET') || '',
    );

    const updatedUser = await this.userService.updatePassword(user?.email, hashedPassword, tenantSlug);

    if (updatedUser) {
      await this.userService.updatePasswordToken(data.token, tenantSlug);
      const oauth = await this.mailService.authorize();
      const html = PasswordUpdatedEmail
      this.mailService.sendEmail(oauth, user?.email, 'Password Updated', html);
      return true
    }
    return false
  }

  isTokenExpired(expiresAt: Date | string | null): boolean {
    if (!expiresAt) return true; // Treat missing expiry as expired
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    return now > expiryDate;
  }

  async logoutUser(userId: number, tenantSlug) {
    return this.userService.updateUser(userId, { refreshToken: undefined }, tenantSlug);
  }

  async refreshTokens(userId: number, refreshToken: string, tenantSlug: string) {
    const user = await this.userService.getUserById(userId, tenantSlug);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await hashCompare(
      user.refreshToken,
      refreshToken,
      this.configService.get<string>('APP_SECRET') || '',
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    if (!user.email) throw new BadRequestException('User not found');

    const tokens = await this.getTokens({
      tenantId: user.tenantId,
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: [],
    });
    await this.updateRefreshToken(user.id, tokens.refreshToken, tenantSlug);
    return tokens;
  }

  async getTokens(payload: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '7d',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string, tenantSlug: string) {
    const hashedRefreshToken = await hashGenerate(
      refreshToken,
      this.configService.get<string>('APP_SECRET') || '',
    );
    await this.userService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    }, tenantSlug
    );
  }
  async updateTenantToken(token: any) {
    return await this.getTokens(token);
  }
}
