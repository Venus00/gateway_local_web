import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateNewUserDto, CreateUserDto, UpdateUserDto } from './users.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema'
import { eq, SQL } from 'drizzle-orm';
import { tenant, users, userVerification, licence, resetPasswordToken } from '../../db/schema';
import { TenancyService } from 'src/tenancy/tenancy.service';
import { v4 as uuidv4 } from 'uuid';
import { validationEmail } from 'src/common/template-mail/validationEmail';
import { MailService } from 'src/auth/email.service';
import { hashGenerate } from 'src/common/utils/hash';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    private tenancy: TenancyService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    @Inject('DB_DEV') private readonly db: NodePgDatabase<typeof schema>) { }


  async getDbConnection(slug: string) {
    return await this.tenancy.getTenantConnection(slug);
  }
  async createUser(data: CreateUserDto) {
    //createDefaulttenant
    return await this.db.insert(users).values({
      ...data,

    }).returning()
      .then((res) => res[0] ?? null);
  }
  async createNewUser(data: CreateNewUserDto) {
    const hashedPassword = await hashGenerate(
      data.password,
      this.configService.get<string>('APP_SECRET') || '',
    );
    //createDefaulttenant
    const user = await this.db.insert(users).values({
      ...data,
      password: hashedPassword,
    })
      .returning()
      .then((res) => res[0] ?? null);
    const token = uuidv4();
    const userVerification = await this.createUserVerification(
      token,
      user.id,
    );

    const oauth = await this.mailService.authorize();
    const html = validationEmail.replaceAll(
      '[Activation Link]',
      `${process.env.SERVER_PRIMARY_DNS}/api/v1/auth/verify?token=${token}`,
    );

    this.mailService.sendEmail(oauth, data.email, 'ValidationEmail', html);
  }

  async updatePassword(email: string, password: string, tenantSLug: string) {
    const dbConnection = await this.getDbConnection(tenantSLug)
    return await dbConnection.update(users).set({
      password,
    }).where(eq(users.email, email))
      .returning()
  }
  async createUserVerification(token: string, userId: number) {
    return await this.db.insert(userVerification).values({
      token,
      userId,

    }).returning()
      .then((res) => res[0] ?? null);
  }
  async storeResetToken(userId: number, token: string, expiresAt: Date) {
    return await this.db.insert(schema.resetPasswordToken).values({
      token,
      userId,
      expiresAt,

    }).returning()
      .then((res) => res[0] ?? null);
  }

  async findUserById(userId: number, tenantSlug: string) {
    const dbConnection = await this.getDbConnection(tenantSlug)

    return await dbConnection.query.users.findFirst({
      where: eq(users.id, userId),
    })
  }
  async markAsVerified(userId: number, tenantSlug: string) {
    const dbConnection = await this.getDbConnection(tenantSlug)
    return await dbConnection.update(users).set({
      isVerified: true,
    }).where(eq(users.id, userId))
  }

  async findByToken(token: string, tenantSlug: string) {
    const dbConnection = await this.getDbConnection(tenantSlug)
    return await dbConnection.query.userVerification.findFirst({
      where: eq(userVerification.token, token),
    })
  }
  async findByResetToken(token: string, tenantSlug: string) {
    const dbConnection = await this.getDbConnection(tenantSlug)
    return await dbConnection.query.resetPasswordToken.findFirst({
      where: eq(resetPasswordToken.token, token), whith: {
        users: true
      }
    })
  }
  async findResetToken(token: string, tenantSlug: string) {
    const dbConnection = await this.getDbConnection(tenantSlug)
    return await dbConnection.query.resetPasswordToken.findFirst({
      where: eq(resetPasswordToken.token, token),
    })
  }
  async updatePasswordToken(token: string, tenantSlug: string) {
    const dbConnection = await this.getDbConnection(tenantSlug)
    return await dbConnection.update(resetPasswordToken).set({
      used: true
    }).where(eq(resetPasswordToken.token, token))
  }
  async IsVerified(userId: number) {
    return await this.db.query.userVerification.findFirst({
      where: eq(userVerification.userId, userId),
    })
  }
  async updateUser(id: number, data: Partial<CreateUserDto>, tenantSlug: string) {
    const dbConnection = await this.getDbConnection(tenantSlug)
    return dbConnection.update(users).set({
      ...data
    }).where(eq(users.id, id));
  }
  async updateUserInfo(data: UpdateUserDto, tenantSlug: string) {
    const dbConnection = await this.getDbConnection(tenantSlug)
    return dbConnection.update(users).set({
      ...data
    }).where(eq(users.id, data.id));
  }
  async getUserByEmail(email: string, tenantSlug: string) {
    const dbConnection = await this.getDbConnection(tenantSlug)
    const result = dbConnection.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
      with: {
        tenant: {
          with: {
            licence: true
          }
        }
      }
    });
    return result;
  }

  async getUserById(id: number, tenantSlug: string) {
    const dbConnection = await this.getDbConnection(tenantSlug)
    return dbConnection.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
  }

  async getUsers(tenantId: number) {
    return this.db.query.users.findMany({
      where: eq(users.tenantId, tenantId)
    });
  }

  async deleteUser(id: number, tenantSlug: string) {
    const dbConnection = await this.getDbConnection(tenantSlug)
    return dbConnection.delete(users).where(eq(users.id, id));
  }
}
