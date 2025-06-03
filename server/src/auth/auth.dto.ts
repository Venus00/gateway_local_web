import { IsString, IsEmail, MinLength, MaxLength, IsNumber } from 'class-validator';
import { Exclude } from 'class-transformer';
import { IsMatch } from 'src/common/utils/ismatch.validation';

export class LoginUserRequestDto {
  @IsEmail()
  email: string | undefined;

  @IsString()
  @MinLength(4)
  @MaxLength(24)
  password: string | undefined;
}

export class RegisterUserRequestDto {

  @IsNumber()
  tenantId: number | undefined

  @IsString()
  name:  string|undefined;
  @IsString()
  tenantName:  string|undefined;

  @IsEmail()
  email: string;

  @IsString()
  password: string | undefined;

  @IsMatch('password', { message: 'password confirmation does not match.' })
  confirmPassword: string | undefined;
}

export class LoginUserResponseDto {}

export class RegisterUserResponseDto extends LoginUserResponseDto {}

export class GetLoggedInUserResponseDto {

  @Exclude()
  password: string | undefined;

  @Exclude()
  active;

  @Exclude()
  refreshToken;

  @Exclude()
  created_at;

  @Exclude()
  updated_at;

  @Exclude()
  deleted_at;
}
