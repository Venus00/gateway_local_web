import { Request } from 'express';
import { CreateNewUserDto, CreateUserDto, UpdateUserDto, UserResponseDto } from './users.dto';
import { AuthService } from 'src/auth/auth.service';
import { TenantService } from './tenant.service';
import { UsersService } from './users.service';
export declare class UserController {
    private readonly authService;
    private readonly tenantService;
    private readonly usersService;
    constructor(authService: AuthService, tenantService: TenantService, usersService: UsersService);
    handleGetAllUsers(query: any): Promise<UserResponseDto[]>;
    handleUpdateUser(req: Request, data: CreateUserDto): Promise<UserResponseDto>;
    handleUpdateUserInfo(req: Request, data: UpdateUserDto): Promise<UserResponseDto | undefined>;
    handleCreateUser(data: CreateUserDto): Promise<UserResponseDto>;
    handleCreateNewUser(data: CreateNewUserDto): Promise<void>;
    handleDeleteUser(req: Request, id: number): Promise<UserResponseDto>;
}
