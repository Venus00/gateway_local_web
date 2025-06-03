/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export interface CreateTokenDto {
  name: string;
  description?: string;
  expiryDate: string;
  tenantId: number;
  user:{
    id:number;email:string
  }
}

export interface EditTokenDto {
  id: number;
  name: string;
  description?: string;

}

export class TokenReponseDto {
  @IsString()
  name: string | undefined;

  // @IsString()
  // description: string | undefined;
}
