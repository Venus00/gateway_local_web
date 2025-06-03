/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export interface CreateWorkflowDto {
  tenantId: number;
  data: {
    name: string;
    url: string;
    icon: string;
    group?: string;
    reference?: string;
    version?: string;
    color?: string;
    author?: string;
    readme?: string;
  }

}

export interface EditWorkflowDto {
  id: number;
  name: string;
  url: string;
  icon: string;
  group?: string;
  reference?: string;
  version?: string;
  color?: string;
  author?: string;
  readme?: string;

}

export class WorkflowReponseDto {
  @IsString()
  name: string | undefined;

  // @IsString()
  // description: string | undefined;
}
