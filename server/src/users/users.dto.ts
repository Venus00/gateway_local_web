import { IsString, IsEmail, IsNumber } from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreateUserDto {

  @IsNumber()
  tenantId: undefined  | number;

  @IsString()
  name:  string|undefined;
  
  @IsString()
  tenantName:  string|undefined;

  @IsEmail()
  email: string;

  @IsString()
  password: string | undefined;

  @IsString()
  refreshToken?: string;

  @IsString()
  role?:string
}

export class UserResponseDto {
  @Exclude()
  password: string | undefined;

  @Exclude()
  refreshToken;

  @Exclude()
  deleted_at;
}

export interface CreateNewUserDto {
  tenantId:number
  tenantName?:string
  image?:string
  name: string
  email: string
  role: string
  isActive: boolean
  password:string
  isVerified:boolean
}
export interface UpdateUserDto {
  id:number
  tenantId:number
  tenantName?:string
  image?:string
  name: string
  email: string
  role: string
  isActive: boolean
  password?:string
  isVerified:boolean
}