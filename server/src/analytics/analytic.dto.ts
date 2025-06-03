/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export interface CreateAnalyticDto {
  name: string;
  serial: string;
  layout?: string;
  widget?: string;
  tenantId: number;
}

export interface EditAnalyticDto {
  id: number;
  name: string;
  serial?: string;
  layout?: string;
  widget?: string;
  tenantId: number;

}

export class AnalyticReponseDto {
  @IsString()
  name: string | undefined;

  // @IsString()
  // description: string | undefined;
}
export interface AnalyticLayoutDto {
  layout: string;
  widget: string;
}

export interface AnalyticEventDto {
  tenantId: number;
  serial: string;
  name: string;
  value: string;
  createdAt: Date;
}

export interface AnalyticOutputDto {
  id: number;
  name: string;
}