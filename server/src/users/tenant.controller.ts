/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
  Param,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/auth.guards';
import { plainToInstance } from 'class-transformer';
import { TenantService } from './tenant.service';
import { CreateTenantDto, EditTenantDto, TenantReponseDto } from './tenant.dto';
import { Role } from 'src/common/guards/role.enum';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { UserResponseDto } from './users.dto';

@Controller('tenant')
@UseGuards(AccessTokenGuard, RolesGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) { }

  @Get()
  @Roles(Role.GAdmin)
  async handleGetAllTenant() {
    const tenants = await this.tenantService.getTenants();
    return plainToInstance(TenantReponseDto, tenants);
  }

  @Get('dashboard')
  async handleGetLayout(@Query() query: { tenantId: number }) {
    console.log("tenantId", query.tenantId);

    const result = await this.tenantService.getTenantById(query.tenantId);
    return result;
  }
  @Delete('dashboard/:id')
  async deleteDashboard(@Param('id') id: number) {
    return await this.tenantService.deleteGlobalDashboard(id);
  }



  @Put('dashboard')
  async handleSetLayout(
    @Body() data: { tenantId: number; widget: string; layout: string },
  ) {
    const { widget, layout, tenantId } = data;
    return await this.tenantService.setLayoutWidget(tenantId, {
      widget,
      layout,
    });
  }
  @Roles(Role.GAdmin)
  @Post()
  async handleCreateTenant(@Body() data: CreateTenantDto, @Res() req) {
    const tenantSlug = req['tenantSlug'];

    return await this.tenantService.createTenant(data, tenantSlug);
  }

  @Put()
  async handleUpdateTenant(@Body() data: EditTenantDto) {
    return await this.tenantService.updateTenant(data);
  }
  @Delete(':id')
  async handleDeleteUser(@Param('id', ParseIntPipe) id: number) {

    const exists = await this.tenantService.getTenantById(id);
    if (!exists) throw new BadRequestException('Tenant does not exist');

    const user = await this.tenantService.deleteTenant(id);
    return plainToInstance(UserResponseDto, user);
  }

}

