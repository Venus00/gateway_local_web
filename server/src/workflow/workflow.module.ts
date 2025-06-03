/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common'
import { GwModule } from 'src/gw/gw.module'

import { SocketModule } from 'src/socket/socket.module'
import { WorkflowService } from './workflow.service'
import { WorkflowController } from './workflow.controller'
import { TenancyModule } from 'src/tenancy/tenancy.module'

@Module({
  imports: [GwModule,TenancyModule],
  providers: [WorkflowService],
  controllers: [
    WorkflowController
  ],
})
export class WorkflowModule {}
