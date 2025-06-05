import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { validationEmail } from "src/common/template-mail/validationEmail";
import { hashCompare, hashGenerate } from "src/common/utils/hash";
import { GetLoggedInUserResponseDto, LoginUserRequestDto, RegisterUserRequestDto } from "./auth.dto";
import { plainToClass } from "class-transformer";
import { UsersService } from "src/users/users.service";
import { TenantService } from "src/users/tenant.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "./jwt-payload";
import { v4 as uuidv4 } from 'uuid';
import { forgetPasswordEmail } from "src/common/template-mail/forgotPasswordEmail";
import { PasswordUpdatedEmail } from "src/common/template-mail/PasswordUpdatedEmail";
import { AccountVerified } from "src/common/template-mail/AccountVerified";

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly tenantService: TenantService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  // Fetch logged in user for a specific tenant
  async getLoggedInUser(userId: number) {
    return this.userService.getUserById(userId);
  }

  async loginUser(data: LoginUserRequestDto) {
    if (!data.email || !data.password)
      throw new BadRequestException('Email or password not provided');
    const user = await this.userService.getUserByEmail(data.email);
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

      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        ...plainToClass(GetLoggedInUserResponseDto, user),
        ...tokens,
      };
    }
    throw new UnauthorizedException('Account Still Not Verified');

  }

  // Email verification logic for a specific tenant
  async verifyEmail(token: string) {
    const user = await this.userService.findByToken(token);
    if (!user?.userId) throw new Error('Invalid token');

    const userRow = await this.userService.findUserById(user.userId);
    if (!userRow) throw new Error('Invalid User');
    if (userRow.isVerified) {
      throw new Error('Already Verified');
    } else {
      await this.userService.markAsVerified(userRow.id);
      return 'Email verified successfully';
    }
  }
  async verifyEmailByGAdmin(id: number) {
    const userRow = await this.userService.findUserById(id);
    if (!userRow) throw new Error('Invalid User');
    if (userRow.isVerified) {
      throw new Error('Already Verified');
    } else {
      const verifiedUser = await this.userService.markAsVerified(userRow.id);
      if (verifiedUser) {
        console.log(verifiedUser, 'verifiedUser');


      }
      return true;
    }
  }
  async forgetPassword(data: any) {
    const userRow = await this.userService.getUserByEmail(data.email);
    if (!userRow) throw new Error('Invalid User');
    const resetToken = await this.generatePasswordResetToken(userRow.id);



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

  async registerUser(data: RegisterUserRequestDto) {
    if (!data.email || !data.password || !data.tenantName)
      throw new BadRequestException('Email, password or workspace name not provided');

    const userExists = await this.userService.getUserByEmail(data.email);
    if (userExists) throw new BadRequestException('Email already exists');
    const tenantexists = await this.tenantService.getTenantByName(data.tenantName);
    if (tenantexists) throw new BadRequestException('Workspace name already in use');
    if (data.email === '') throw new BadRequestException('Invalid email format');

    const hashedPassword = await hashGenerate(
      data.password,
      this.configService.get<string>('APP_SECRET') || '',
    );
    let newUser;
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

    const html = validationEmail.replaceAll(
      '[Activation Link]',
      `${process.env.SERVER_PRIMARY_DNS}/api/v1/auth/verify?token=${token}`,
    );

    return newUser;
  }
  async resetPassword(data: any) {
    if (!data.password || !data.token)
      throw new BadRequestException('password or token not provided');
    const token = await this.userService.findResetToken(data.token);
    if (token?.used) { throw new BadRequestException('token already used'); }
    if (this.isTokenExpired(token?.expiresAt || '')) {
      throw new BadRequestException('Token has expired');
    }
    const userToken = await this.userService.findByResetToken(data.token);
    if (!userToken?.userId) throw new Error('Invalid token');
    const user = await this.userService.getUserById(userToken?.userId);
    const hashedPassword = await hashGenerate(
      data.password,
      this.configService.get<string>('APP_SECRET') || '',
    );

    const updatedUser = await this.userService.updatePassword(user?.email, hashedPassword);

    if (updatedUser) {
      await this.userService.updatePasswordToken(data.token);

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

  async logoutUser(userId: number) {
    return this.userService.updateUser(userId, { refreshToken: undefined });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.getUserById(userId);
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
    await this.updateRefreshToken(user.id, tokens.refreshToken);
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

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await hashGenerate(
      refreshToken,
      this.configService.get<string>('APP_SECRET') || '',
    );
    await this.userService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    }
    );
  }
  async updateTenantToken(token: any) {
    return await this.getTokens(token);
  }
}
