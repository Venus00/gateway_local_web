/* eslint-disable prettier/prettier */
import { IsString, IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';

export interface CreateTenantDto {
  name: string;
  description?: string;
  phone?: string;
  company?: string;
  adminId?: string;
  image?: string;
  subscriptionPlanId: string;
}

export interface EditTenantDto {
  id: number;
  name: string;
  description?: string;
  phone?: string;
  company?: string;
  image?: string;
  adminId?: string;
  subscriptionPlanId: string;
}

export class TenantReponseDto {
  @IsString()
  name: string | undefined;

  // @IsString()
  // description: string | undefined;
}
