import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MachineService } from 'src/machine/machine.service';

import { AccessTokenGuard } from 'src/common/guards/auth.guards';
import { Permission, Role } from 'src/common/guards/role.enum';
import { PermissionsGuard, Permissions } from 'src/common/guards/licencePermission.guard';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { DeviceService } from './device.service';
import { BrokerService } from 'src/broker/broker.service';

@Controller('dashboard')
@UseGuards(AccessTokenGuard, RolesGuard, PermissionsGuard)
export class DashboardController {
  constructor(
    private devices: DeviceService,
    private brokers: BrokerService,
    private entitie: MachineService,
  ) {}

  @Get('')
  @Permissions(Permission.readDashboard)
  async findDashboardTelemetiesName(@Param('tenantId') tenantId: number) {
    return ['totalDevice', 'totalMachines', 'totalBrokers', 'totalEvents'];
  }

  @Get('historical')
  async getHistoricalData(@Query() data) {
    try {
      return await this.devices.getHistoricalDashboardData(data);
    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('telemetrie')
  @Permissions(Permission.readDashboard)
  async findDashboardTelemeties(@Query() query,@Request() req) {
    
    const { tenantId } = query; 
    const tenantSlug = req['tenantSlug'];  

    if (!tenantId && !tenantSlug) {
      throw new HttpException('tenantId or tenantSlug must be provided', HttpStatus.BAD_REQUEST);
    }

    switch (query.telemetrieName) {
      case 'totalMachines':
        return (await this.entitie.findMachine(tenantId, tenantSlug)).length;
      case 'totalBrokers':
        return (await this.brokers.getBrokersWithTenant(tenantId, tenantSlug)).length;
      case 'totalDevice':
        return (await this.devices.findDevicesWithTenant(tenantId, tenantSlug)).length;
      case 'totalEvents':
        return (await this.devices.findEventsWithTenant(tenantId, tenantSlug)).length;
      default:
        return {};
    }
  }

}
