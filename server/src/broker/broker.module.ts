import { Module } from '@nestjs/common';
import { TenancyModule } from 'src/tenancy/tenancy.module';
import { BrokerService } from './broker.service';
import { BrokerController } from './broker.controller';
import { DeviceService } from 'src/device/device.service';
import { GwModule } from 'src/gw/gw.module';


@Module({
  imports: [GwModule,TenancyModule],
  providers: [BrokerService,DeviceService],
  controllers: [
    BrokerController,
  ],
  exports: [
    BrokerService,
  ]
})
export class BrokerModule { }
