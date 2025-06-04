/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common'

import { SocketModule } from 'src/socket/socket.module'
import { WorkflowService } from './workflow.service'
import { WorkflowController } from './workflow.controller'

@Module({
  imports: [],
  providers: [WorkflowService],
  controllers: [
    WorkflowController
  ],
})
export class WorkflowModule { }
