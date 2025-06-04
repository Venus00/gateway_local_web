export declare class CreateUserDto {
    tenantId: undefined | number;
    name: string | undefined;
    tenantName: string | undefined;
    email: string;
    password: string | undefined;
    refreshToken?: string;
    role?: string;
}
export declare class UserResponseDto {
    password: string | undefined;
    refreshToken: any;
    deleted_at: any;
}
export interface CreateNewUserDto {
    tenantId: number;
    tenantName?: string;
    image?: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    password: string;
    isVerified: boolean;
}
export interface UpdateUserDto {
    id: number;
    tenantId: number;
    tenantName?: string;
    image?: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    password?: string;
    isVerified: boolean;
}
