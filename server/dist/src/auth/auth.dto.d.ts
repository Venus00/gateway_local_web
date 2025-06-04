export declare class LoginUserRequestDto {
    email: string | undefined;
    password: string | undefined;
}
export declare class RegisterUserRequestDto {
    tenantId: number | undefined;
    name: string | undefined;
    tenantName: string | undefined;
    email: string;
    password: string | undefined;
    confirmPassword: string | undefined;
}
export declare class LoginUserResponseDto {
}
export declare class RegisterUserResponseDto extends LoginUserResponseDto {
}
export declare class GetLoggedInUserResponseDto {
    password: string | undefined;
    active: any;
    refreshToken: any;
    created_at: any;
    updated_at: any;
    deleted_at: any;
}
