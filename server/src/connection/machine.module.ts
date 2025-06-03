import { Module } from '@nestjs/common';
import { TenancyModule } from 'src/tenancy/tenancy.module';
import { ConnectionService } from './connection.service';
import { ConnectionController } from './connection.controller';


@Module({
  imports: [TenancyModule],
  providers: [ConnectionService],
  controllers: [
    ConnectionController,
  ],
  exports: [
    ConnectionService,
  ]
})
export class ConnectionModule { }
