import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateNewUserDto, CreateUserDto, UpdateUserDto } from './users.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema'
import { eq, SQL } from 'drizzle-orm';
import { tenant, users, userVerification, resetPasswordToken } from '../../db/schema';
import { v4 as uuidv4 } from 'uuid';
import { validationEmail } from 'src/common/template-mail/validationEmail';
import { hashGenerate } from 'src/common/utils/hash';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject('DB_DEV') private readonly db: NodePgDatabase<typeof schema>) { }

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

    const html = validationEmail.replaceAll(
      '[Activation Link]',
      `${process.env.SERVER_PRIMARY_DNS}/api/v1/auth/verify?token=${token}`,
    );

  }

  async updatePassword(email: string, password: string) {
    return await this.db.update(users).set({
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

  async findUserById(userId: number) {


    return await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    })
  }
  async markAsVerified(userId: number) {

    return await this.db.update(users).set({
      isVerified: true,
    }).where(eq(users.id, userId))
  }

  async findByToken(token: string) {

    return await this.db.query.userVerification.findFirst({
      where: eq(userVerification.token, token),
    })
  }
  async findByResetToken(token: string) {

    return await this.db.query.resetPasswordToken.findFirst({
      where: eq(resetPasswordToken.token, token), with: {
        users: true
      }
    })
  }
  async findResetToken(token: string) {

    return await this.db.query.resetPasswordToken.findFirst({
      where: eq(resetPasswordToken.token, token),
    })
  }
  async updatePasswordToken(token: string) {

    return await this.db.update(resetPasswordToken).set({
      used: true
    }).where(eq(resetPasswordToken.token, token))
  }
  async IsVerified(userId: number) {
    return await this.db.query.userVerification.findFirst({
      where: eq(userVerification.userId, userId),
    })
  }
  async updateUser(id: number, data: Partial<CreateUserDto>) {

    return this.db.update(users).set({
      ...data
    }).where(eq(users.id, id));
  }
  async updateUserInfo(data: UpdateUserDto) {

    return this.db.update(users).set({
      ...data
    }).where(eq(users.id, data.id));
  }
  async getUserByEmail(email: string) {

    const result = this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
      with: {
        tenant: true
      }
    });
    return result;
  }

  async getUserById(id: number) {

    return this.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
  }

  async getUsers(tenantId: number) {
    return this.db.query.users.findMany({
      where: eq(users.tenantId, tenantId)
    });
  }

  async deleteUser(id: number) {

    return this.db.delete(users).where(eq(users.id, id));
  }
}
