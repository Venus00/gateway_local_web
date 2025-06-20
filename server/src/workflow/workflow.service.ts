/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { and, desc, eq, gt, lt } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { workflow } from '../../db/schema';
import { CreateWorkflowDto, EditWorkflowDto } from './workflow.dto';
import { apiClient } from './api.client';
@Injectable()
export class WorkflowService implements OnModuleInit {
  private logger = new Logger(WorkflowService.name);
  constructor(
    @Inject('DB_DEV') private readonly db: NodePgDatabase<typeof schema>) { }
  async onModuleInit() { }

  async deleteWorkflow(workflowId: number) {

    const existingWorkflow = await this.db
      .select()
      .from(workflow)
      .where(eq(workflow.id, workflowId))
      .limit(1);

    if (existingWorkflow.length === 0) {
      throw new HttpException('Workflow not found', HttpStatus.NOT_FOUND);
    }

    await this.db
      .delete(workflow)
      .where(eq(workflow.id, workflowId));



    return {
      message: 'Workflow deleted successfully',
      id: workflowId
    };
  }

  async pushFlowtoServer(data) {
    try {
      console.log("create", data)
      const result = await apiClient.post('/api', data);
      console.log(result.data);
      return result.data;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
  async createWorkflow(payload: CreateWorkflowDto) {
    const { tenantId, data } = payload;

    const [flow] = await this.db.insert(workflow).values({
      tenantId,
      ...data
    }).returning({ id: workflow.tenantId });

    return await this.pushFlowtoServer({
      ...payload,
      data: {
        ...payload.data,
        url: flow.id
      }
    })

  }

  async updateworkflow(data: EditWorkflowDto) {
    try {
      if (data.name) {
        await this.db.update(workflow).set(data).where(eq(workflow.id, data.id));
      } else {
        throw new Error('Workflow type name is required');
      }
      return 'Success';
    } catch (error) {
      throw error;
    }
  }

  async findWorkflowById(id: number) {
    return await this.db.query.workflow.findFirst({
      where: (workflow, { eq }) => eq(workflow.id, id),

    })
  }
  // async findWorkflowBySerial(serial: string) {
  //   return await this.db.query.workflow.findFirst({
  //     where: (workflow, { eq }) => eq(workflow.serial, serial),
  //   })
  // }


  async getWorkflows(tenantId) {
    try {
      const result = await apiClient.post('/api', {
        schema: "streams"

      });
      console.log(result.data);
      return await result.data.filter(item => item.url === tenantId)
    } catch (error) {
      throw error;
    }
  }
  async findWorkflow(tenantId: number) {
    try {
      return await this.getWorkflows(tenantId);
      // return await this.db.query.workflow.findMany(
      //   {
      //     where: eq(workflow.tenantId, tenantId)
      //   }
      // );
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw error;
    }
  }


}
