import { CreateNewUserDto, CreateUserDto, UpdateUserDto } from './users.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { MailService } from 'src/auth/email.service';
import { ConfigService } from '@nestjs/config';
export declare class UsersService {
    private readonly mailService;
    private readonly configService;
    private readonly db;
    private logger;
    constructor(mailService: MailService, configService: ConfigService, db: NodePgDatabase<typeof schema>);
    createUser(data: CreateUserDto): Promise<any>;
    createNewUser(data: CreateNewUserDto): Promise<void>;
    updatePassword(email: string, password: string): Promise<any[] | import("pg").QueryResult<never>>;
    createUserVerification(token: string, userId: number): Promise<{
        id: number;
        userId: number | null;
        token: string;
        expiresAt: Date | null;
        used: boolean | null;
    }>;
    storeResetToken(userId: number, token: string, expiresAt: Date): Promise<{
        id: number;
        userId: number | null;
        token: string;
        expiresAt: Date | null;
        used: boolean | null;
    }>;
    findUserById(userId: number): Promise<{
        [x: string]: any;
    } | undefined>;
    markAsVerified(userId: number): Promise<import("pg").QueryResult<never>>;
    findByToken(token: string): Promise<{
        id: number;
        userId: number | null;
        token: string;
        expiresAt: Date | null;
        used: boolean | null;
    } | undefined>;
    findByResetToken(token: string): Promise<{
        id: number;
        userId: number | null;
        token: string;
        expiresAt: Date | null;
        used: boolean | null;
        users: {
            [x: string]: any;
        } | {
            [x: string]: any;
        }[] | null;
    } | undefined>;
    findResetToken(token: string): Promise<{
        id: number;
        userId: number | null;
        token: string;
        expiresAt: Date | null;
        used: boolean | null;
    } | undefined>;
    updatePasswordToken(token: string): Promise<import("pg").QueryResult<never>>;
    IsVerified(userId: number): Promise<{
        id: number;
        userId: number | null;
        token: string;
        expiresAt: Date | null;
        used: boolean | null;
    } | undefined>;
    updateUser(id: number, data: Partial<CreateUserDto>): Promise<import("pg").QueryResult<never>>;
    updateUserInfo(data: UpdateUserDto): Promise<import("pg").QueryResult<never>>;
    getUserByEmail(email: string): Promise<{
        [x: string]: any;
    } | undefined>;
    getUserById(id: number): Promise<{
        [x: string]: any;
    } | undefined>;
    getUsers(tenantId: number): Promise<{
        [x: string]: any;
    }[]>;
    deleteUser(id: number): Promise<import("pg").QueryResult<never>>;
}
