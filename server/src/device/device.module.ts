import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';

import { GwModule } from 'src/gw/gw.module';
import { DashboardController } from './dashboard.controller';
import { TenancyModule } from 'src/tenancy/tenancy.module';
import { MachineService } from 'src/machine/machine.service';
import { ConnectionService } from 'src/connection/connection.service';
import { BrokerService } from 'src/broker/broker.service';
import { BrokerController } from 'src/broker/broker.controller';

@Module({
  imports: [GwModule, TenancyModule],
  providers: [DeviceService, BrokerService, ConnectionService,MachineService],
  controllers: [
    DeviceController,
    BrokerController,
    DashboardController
  ],
  exports: [
    BrokerService,
  ]
})
export class DeviceModule { }
