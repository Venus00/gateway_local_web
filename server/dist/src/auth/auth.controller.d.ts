import { GetLoggedInUserResponseDto, LoginUserRequestDto, RegisterUserRequestDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    handleMeRequest(userId: any, req: Request): Promise<GetLoggedInUserResponseDto>;
    handleLoginRequest(data: LoginUserRequestDto, req: Request): Promise<{
        accessToken: string;
        refreshToken: string;
        password: string | undefined;
        active: any;
        created_at: any;
        updated_at: any;
        deleted_at: any;
    }>;
    updateTenantToken(data: any): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyUser(token: string, req: Request, res: any): Promise<any>;
    verifyUserAdmin(id: number, req: Request, res: any): Promise<boolean>;
    forgetPassword(data: any, req: Request, res: any): Promise<void>;
    resetPassword(data: any, req: Request, res: any): Promise<any>;
    handleRegisterRequest(data: RegisterUserRequestDto, req: Request): Promise<any>;
    handleLogoutRequest(userId: any, req: Request): Promise<boolean>;
}
