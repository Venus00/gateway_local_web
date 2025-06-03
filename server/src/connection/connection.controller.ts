import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Action, ConnectionCreateDto } from './connection.dto';
import { ConnectionService } from './connection.service';
import { AccessTokenGuard } from 'src/common/guards';
import { Permission, Role } from 'src/common/guards/role.enum';
import { Permissions, PermissionsGuard } from 'src/common/guards/licencePermission.guard';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';

@Controller('connection')
@UseGuards(AccessTokenGuard, RolesGuard, PermissionsGuard)
export class ConnectionController {
  constructor(private connection: ConnectionService) {}



  @Post('action')
  @Roles(Role.Admin)
  @Permissions(Permission.entityType)
  async action(@Request() req, @Body() data: Action) {
    try {
      const tenantSlug = req['tenantSlug'];
      console.log('tenantSlug:', tenantSlug);
      console.log(data);
      return await this.connection.action(data, tenantSlug);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // @Post('')
  // async createConnection(@Request() req, @Body() data: ConnectionCreateDto) {
    
  //   const tenantSlug = req['tenantSlug'];
  //   return await this.connection.insertConnection(data, tenantSlug);
  // }

  // @Get()
  // @Permissions(Permission.readConnection)
  // async find(@Request() req, @Query() query) {
  //   const tenantSlug = req['tenantSlug'];
  //   const result = await this.connection.findConnection(query.tenantId, tenantSlug);
  //   return result;
  // }

  @Delete('/:id')
  async delete(@Request() req, @Param('id') id: number) {
    const tenantSlug = req['tenantSlug'];
    console.log("id",id);
    
    return await this.connection.deleteConnection(id, tenantSlug);
  }
}
