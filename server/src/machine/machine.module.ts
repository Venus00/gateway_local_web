import { Module } from '@nestjs/common';
import { TenancyModule } from 'src/tenancy/tenancy.module';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';

@Module({
  imports: [TenancyModule],
  providers: [MachineService],
  controllers: [
    MachineController,
  ],
  exports: [
    MachineService,
  ]
})
export class MachineModule { }
