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
  Put,
} from '@nestjs/common';
import { MachineService } from './machine.service';
import { MachineCreateDto, MachineLayoutDto, MachineTypeInsertDto, MachineTypeUpdateDto, MachineUpdateDto } from './machine.dto';
import { AccessTokenGuard } from 'src/common/guards/auth.guards';
import { Permission, Role } from 'src/common/guards/role.enum';
import { PermissionsGuard, Permissions } from 'src/common/guards/licencePermission.guard';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';

@Controller('')
@UseGuards(AccessTokenGuard, RolesGuard, PermissionsGuard)
export class MachineController {
  constructor(private machine: MachineService) {}


  @Post('machine')
  @Roles(Role.Admin,Role.GAdmin)
  @Permissions(Permission.entity)
  async createEntity(@Request() req, @Body() data: MachineCreateDto) {
    const tenantSlug = req['tenantSlug'];  
    console.log('tenantSlug:', tenantSlug);
    console.log('create machine:', JSON.stringify(data));
    return await this.machine.insertMachine(data, tenantSlug);
  }

  @Get('machine/:machine_serial')
  @Permissions(Permission.readEntity)
  async findMachine(
    @Request() req,
    @Param('machine_serial') machine_serial: string,
  ) {
    const tenantSlug = req['tenantSlug'];  
    console.log('tenantSlug:', tenantSlug);
    const machines = await this.machine.findMachineBySerial(machine_serial, tenantSlug);
    return machines;
  }

  @Get('machineById')
  @Permissions(Permission.readEntity)
  async findMachineId(
    @Request() req:Request,
    @Query() query) {
      const tenantSlug = req['tenantSlug'];  
      console.log('tenantSlug:', tenantSlug);
      console.log(query)

      const machine = await this.machine.findMachineById(+query.machineId,+query.tenantId, tenantSlug);
      return machine;

  }

  @Get('machineByType')
  @Permissions(Permission.readEntityType)
  async findMachineByType(@Request() req, @Query() query) {
    const tenantSlug = req['tenantSlug'];  
    console.log('tenantSlug:', tenantSlug);
    const machines = await this.machine.findMachineByType(query.tenantId, query.machineTypeId, tenantSlug);
    return machines;
  }

  @Get('machine')
  @Permissions(Permission.readEntity)
  async find(@Request() req, @Query() query) {
    const tenantSlug = req['tenantSlug'];  
    const machines = await this.machine.findMachine(query.tenantId, tenantSlug);
    return machines;
  }

 @Put('machine')
  async updateMachine(@Body() data: MachineUpdateDto, @Request() req) {
    const tenantSlug = req['tenantSlug'];  
    try {
      return await this.machine.updateMachine(data, tenantSlug); 
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
@Put('machinetype')
  async updateMachineType(@Body() data: MachineTypeUpdateDto, @Request() req) {
    const tenantSlug = req['tenantSlug'];  

    try {
      return await this.machine.updateMachineType(data, tenantSlug); 
    } catch (error) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }
  @Delete('machine/:id')
  async delete(@Request() req, @Param('id') id: number) {
    
    const tenantSlug = req['tenantSlug'];  
    return await this.machine.deleteMachine(+id, tenantSlug);
  }

  @Post('machinetype')
  @Roles(Role.Admin)
  @Permissions(Permission.entityType)
  async createType(@Request() req, @Body() data: MachineTypeInsertDto) {
    const tenantSlug = req['tenantSlug'];  
    return await this.machine.insertMachineType(data, tenantSlug);
  }

  @Get('machinetype')
  @Permissions(Permission.readEntityType)
  async findType(@Request() req, @Query() query) {
    const tenantSlug = req['tenantSlug'];  
    return await this.machine.findMachineType(query.tenantId, tenantSlug);
  }

  @Delete('machinetype/:name')
  async deleteType(@Request() req, @Param('name') name: string) {
    const tenantSlug = req['tenantSlug'];  
    return await this.machine.deleteMachineType(name, tenantSlug);
  }
  

  // @Get('machineData/:machine_id')
  // async findMachineData(@Request() req, @Param('machine_id') machine_id: number) {
  //   const tenantSlug = req['tenantSlug'];  
  //   return await this.machine.findMachineData(machine_id, tenantSlug);
  // }
  @Delete('machine/dashboard/:id')
  async deleteDashboard(@Param('id') id: number) {
    return await this.machine.deleteMachineDashboard(id);
  }
  @Post('machine/layout/:machine_id')
  async createLayout(
    @Request() req,
    @Param('machine_id') machine_id: number,
    @Query() query,
    @Body() data: MachineLayoutDto,
  ) {
    const tenantSlug = req['tenantSlug'];  
    
    console.log("MACHINE§§§");
    
    return await this.machine.insertLayout(machine_id, data, query.type, tenantSlug);
  }
}
