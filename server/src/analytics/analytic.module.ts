/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common'
import { GwModule } from 'src/gw/gw.module'
import { AnalyticController } from './analytic.controller'
import { AnalyticService } from './analytic.service'
import { SocketModule } from 'src/socket/socket.module'

@Module({
  imports: [GwModule,SocketModule],
  providers: [AnalyticService],
  controllers: [
    AnalyticController
  ],
})
export class AnalyticModule {}
