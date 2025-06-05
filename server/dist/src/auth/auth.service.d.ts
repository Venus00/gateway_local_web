import { LoginUserRequestDto, RegisterUserRequestDto } from "./auth.dto";
import { UsersService } from "src/users/users.service";
import { TenantService } from "src/users/tenant.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "./jwt-payload";
export declare class AuthService {
    private readonly userService;
    private readonly tenantService;
    private readonly jwtService;
    private readonly configService;
    private logger;
    constructor(userService: UsersService, tenantService: TenantService, jwtService: JwtService, configService: ConfigService);
    getLoggedInUser(userId: number): Promise<{
        [x: string]: any;
    } | undefined>;
    loginUser(data: LoginUserRequestDto): Promise<{
        accessToken: string;
        refreshToken: string;
        password: string | undefined;
        active: any;
        created_at: any;
        updated_at: any;
        deleted_at: any;
    }>;
    verifyEmail(token: string): Promise<string>;
    verifyEmailByGAdmin(id: number): Promise<boolean>;
    forgetPassword(data: any): Promise<void>;
    generatePasswordResetToken(userId: number): Promise<string>;
    generatePassword(password: string): Promise<string>;
    registerUser(data: RegisterUserRequestDto): Promise<any>;
    resetPassword(data: any): Promise<boolean>;
    isTokenExpired(expiresAt: Date | string | null): boolean;
    logoutUser(userId: number): Promise<import("pg").QueryResult<never>>;
    refreshTokens(userId: number, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getTokens(payload: JwtPayload): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshToken(userId: number, refreshToken: string): Promise<void>;
    updateTenantToken(token: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
