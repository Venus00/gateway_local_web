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
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  DeviceCreateDto,
  DeviceInsertDto,
  DeviceTypeInsertDto,
  DeviceTypeUpdateDto,
} from './device.dto';
import { DeviceService } from './device.service';
import { AccessTokenGuard } from 'src/common/guards/auth.guards';
import { Permission, Role } from 'src/common/guards/role.enum';
import { PermissionsGuard, Permissions } from 'src/common/guards/licencePermission.guard';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BrokerService } from 'src/broker/broker.service';

@Controller('')
@ApiTags('')
@UseGuards(AccessTokenGuard, RolesGuard, PermissionsGuard)
export class DeviceController {
  constructor(
    private device: DeviceService,
    private broker: BrokerService,
  ) {}

  @Post('device/create')
  @Roles(Role.Admin)
  @Permissions(Permission.device)
  @ApiOperation({ summary: 'Create Device' })
  async createDevice(@Body() data: DeviceInsertDto, @Request() req) {
    const tenantSlug = req['tenantSlug'];  

    try {
      return await this.device.insertDevice(data, tenantSlug); 
    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('device')
  @Permissions(Permission.readDevice)
  async find(@Request() req, @Query() query) {
    const tenantSlug = req['tenantSlug'];  
    return await this.device.findDevicesWithTenant(query.tenantId, tenantSlug); 
  }
  // @Permissions(Permission.readDevice)
 

  @Put('device')
  async update(@Body() data: Partial<DeviceInsertDto>, @Request() req) {
    const tenantSlug = req['tenantSlug'];  
   
    
    return await this.device.updateDevice(data, tenantSlug); 
  }

  @Post('device')
  async create(@Body() data: DeviceCreateDto, @Request() req) {
    const tenantSlug = req['tenantSlug'];  

    return await this.broker.createDevice(data); 
  }

  @Delete('device/:user_id')
  async delete(@Param('user_id') user_id: string, @Request() req) {
    const tenantSlug = req['tenantSlug'];  

    console.log('delete device');
    console.log(user_id);
    return await this.device.deleteDevice(user_id, tenantSlug); 
  }

  @Post('devicetype')
  @Roles(Role.Admin)
  @Permissions(Permission.deviceType)
  async createType(@Body() data: DeviceTypeInsertDto, @Request() req) {
    const tenantSlug = req['tenantSlug'];  

    try {
      return await this.device.createDeviceType(data, tenantSlug); 
    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('device/messages')
  @Permissions(Permission.readDevice)
  async getDeviceMessages(@Request() req, @Query() query) {
    const tenantSlug = req['tenantSlug'];  

    try {
      const { id } = query;
      return await this.device.getDeviceMessages(id, tenantSlug); 
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
  @Get('device/:id')
  async findById(@Request() req, @Param('id') id:number) {
    const tenantSlug = req['tenantSlug'];  
    return await this.device.findDeviceById(id, tenantSlug); 
  }
  @Get('telemetrie')
  @Permissions(Permission.readDevice)
  async getLastData(@Request() req, @Query() data) {
    const tenantSlug = req['tenantSlug'];  

    try {
      const { machineId, telemetrie } = data;
      console.log('machineId', machineId);
      console.log('telemetries', telemetrie);
      return await this.device.getLastData(data, tenantSlug); 
    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('historical')
  @Permissions(Permission.readDevice)
  async getHistoricalData(@Request() req, @Query() data) {
    const tenantSlug = req['tenantSlug'];  

    try {
      const { machineId, from, to, telemetries } = data;
      return await this.device.getHistoricalData(data, tenantSlug); 
    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
  @Get('mapHistorical')
  @Permissions(Permission.readDevice)
  async getMapHistoricalData(@Request() req, @Query() data) {
    const tenantSlug = req['tenantSlug'];  

    try {
      const { machineId, from, to, telemetries } = data;
      return await this.device.getMapHistoricalData(data, tenantSlug); 
    } catch (error) {
      console.log(error);
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Put('devicetype')
  async updateType(@Body() data: DeviceTypeUpdateDto, @Request() req) {
    const tenantSlug = req['tenantSlug'];  

    try {
      return await this.device.updateDeviceType(data, tenantSlug); 
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('devicetype')
  @Permissions(Permission.readDeviceType)
  async findType(@Request() req, @Query() query) {
    const tenantSlug = req['tenantSlug'];  

    return await this.device.getDeviceType(query.tenantId, tenantSlug); 
  }

  @Delete('devicetype/:type_id')
  async deleteType(@Param('type_id') type_id: string, @Request() req) {
    const tenantSlug = req['tenantSlug'];  

    console.log('delete device type');
    console.log(type_id);
    return await this.device.deleteDeviceType(type_id, tenantSlug); 
  }
}
