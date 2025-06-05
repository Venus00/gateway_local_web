/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/auth.guards';
import { Permission, Role } from 'src/common/guards/role.enum';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { SocketGatway } from 'src/socket/socket.gatway';
import { WorkflowService } from './workflow.service';
import { EditWorkflowDto } from './workflow.dto';
import * as fs from 'fs';
import path from 'path';
@Controller('workflow')
@UseGuards(AccessTokenGuard, RolesGuard)
export class WorkflowController {
  private DB_PATH = path.join(process.cwd(), './flows/db.json');
  private comonents: any[] = [];
  constructor(
    private workflow: WorkflowService) {

    fs.readFile(this.DB_PATH, (err, json) => {
      //let obj = JSON.parse(json.toString().replaceAll('server.url', process.env.SERVER_PRIMARY_DNS || ''));
      this.comonents = JSON.parse(json.toString());
    }) as any

  }


  @Post('')
  @Roles(Role.Admin)
  async createWorkflow(@Body() data) {

    console.log('create workflow : ', JSON.stringify(data));
    try {
      return await this.workflow.createWorkflow(data);
    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('flowscomponents')
  serveflowcomponents() {
    try {
      console.log("yes here")
      return this.comonents;
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    }
  }


  @Get('')
  async find(@Query() query) {
    const workflows = await this.workflow.findWorkflow(query.tenantId);
    return workflows;
  }


  @Get('workflow/:workflow_id')
  async findWorkflowId(@Param('workflow_id') workflow_id: number) {
    try {
      const workflow = await this.workflow.findWorkflowById(Number(workflow_id));
      return workflow;
    } catch (error) {
      console.log(error)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

  }

  @Put('')
  async update(@Body() data: EditWorkflowDto) {


    return await this.workflow.updateworkflow(data);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteWorkflow(@Param('id') id: string) {

    const workflowId = parseInt(id, 10);

    if (isNaN(workflowId)) {
      throw new HttpException('Invalid workflow ID', HttpStatus.BAD_REQUEST);
    }

    console.log('delete workflow id: ', workflowId);
    try {
      return await this.workflow.deleteWorkflow(workflowId);
    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }


}