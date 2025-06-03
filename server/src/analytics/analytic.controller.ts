/* eslint-disable prettier/prettier */
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
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/auth.guards';
import { Permission, Role } from 'src/common/guards/role.enum';
import { PermissionsGuard, Permissions } from 'src/common/guards/licencePermission.guard';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { AnalyticService } from './analytic.service';
import { AnalyticEventDto, AnalyticLayoutDto, AnalyticOutputDto, CreateAnalyticDto } from './analytic.dto';
import { SocketGatway } from 'src/socket/socket.gatway';

@Controller('')
@UseGuards(AccessTokenGuard, RolesGuard, PermissionsGuard)
export class AnalyticController {
  
  constructor(
    private analytic: AnalyticService) { }


  @Post('analytic')
  @Roles(Role.Admin)
  @Permissions(Permission.entity)
  async createDevice(@Body() data,@Req() req) {
    console.log('create analytic : ', JSON.stringify(data));
    const tenantId = req.user.tenantId;
    return await this.analytic.insertAnalytic({
      ...data,
      tenantId:tenantId
    });
  }

  @Get('analytic')
  async find(@Query() query) {
    const analytics = await this.analytic.findAnalytic(query.tenantId);
    return analytics;
  }
  @Get('analytic/:serial')
  async findAnalytic(@Param('serial') analytic_serial: string) {
    const analytic = await this.analytic.findAnalyticBySerial(analytic_serial);
    return analytic;
  }

  @Get('analyticById/:analytic_id')
  async findAnalyticId(@Param('analytic_id') analytic_id: number) {
    try {
      const analytic = await this.analytic.findAnalyticById(Number(analytic_id));
      return analytic;
    } catch (error) {
      console.log(error)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

  }

  @Get('analytic_events/:analytic_id')
  async findAnalyticEvent(@Param('analytic_id') analytic_id: number) {
    const analytic = await this.analytic.findAnalyticEvent(analytic_id);
    return analytic;
  }

  @Delete('analytic/:id')
  async delete(@Param('id') id: string) {
    return await this.analytic.deleteAnalytic(id);
  }
  @Delete('analytic/dashboard/:id')
  async deleteDashboard(@Param('id') id: number) {
    return await this.analytic.deleteAnalyticDashboard(id);
  }

  @Get('analyticOutput')
  async findOutput(@Query() query) {
    const analytics = await this.analytic.findOutput(query.analyticId, query.telemetrieName);
    return analytics;
  }

  @Get('analyticTelemetrie')
  async findTelemetrie(@Query() query) {
    const analytics = await this.analytic.findTelemetrie(query.analyticId, query.telemetrieName);
    return analytics;
  }

  @Post('analytic/layout/:analytic_id')
  async createLayout(
    @Param('analytic_id') analytic_id: number,
    @Body() data: AnalyticLayoutDto,
  ) {
    console.log("create layout:ssss ", JSON.stringify(data))
    return await this.analytic.insertLayout(Number(analytic_id), data);
  }
  @Get('analyticHistorical')
  async getHistoricalData(
    @Query() data,
  ) {
    try {
      return await this.analytic.getHistoricalData(data);
    } catch (error) {
      console.log(error)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('analytic/telemetrie')
  async createAnalyticEvent(
    @Body() data: AnalyticEventDto,@Req() req
  ) {
    const tenantId = req.user.tenantId;
    console.log("create event: ", JSON.stringify(data))
    return await this.analytic.createAnalyticEvent({
      ...data,
      tenantId:tenantId
    });
  }

  @Post('analytic/output')
  async createAnalyticOutput(
    @Body() data: AnalyticOutputDto,@Req() req
  ) {
    console.log(data)
    const tenantId = req.user.tenantId;
    console.log("create output: ", JSON.stringify(data))
    return await this.analytic.createAnalyticOutput({
      ...data,
      tenantId:tenantId
    });
  }

  @Post('analytic/output/event')
  async createAnalyticOutputEvent(
    @Body() data: AnalyticOutputDto,
  ) {
    console.log("create output: event", JSON.stringify(data))
    return await this.analytic.createAnalyticOutputEvent(data);
  }
}
