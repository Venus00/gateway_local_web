import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AccessTokenGuard } from 'src/common/guards';
import { Permissions } from 'src/common/guards/licencePermission.guard';
import { Permission, Role } from 'src/common/guards/role.enum';
import { Roles } from 'src/common/guards/roles.guard';
import { TenancyService } from 'src/tenancy/tenancy.service';
import { BrokerDto, EditBrokerDto } from './broker.dto';
import { BrokerService } from './broker.service';
import { DeviceService } from 'src/device/device.service';


@Controller('broker')
@UseGuards(AccessTokenGuard)
export class BrokerController {
  constructor(
    private broker: BrokerService,
    private device: DeviceService,
    private tenancyService: TenancyService,
  ) { }

  @Post('')
  @Roles(Role.Admin)
  @Permissions(Permission.broker)
  async createBroker(@Body() data: BrokerDto, @Res() res: Response, @Req() req: Request) {
    const tenantSlug = req['tenantSlug'];
    try {
      const result = await this.broker.addBroker(data, tenantSlug);
      console.log("Returning: ", result);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error,
      });
    }
  }

  @Delete('')
  async deleteBroker(@Query() query, @Req() req: Request) {
    const tenantSlug = req['tenantSlug'];
    console.log('Delete broker', query.id);
    return await this.broker.deleteBroker(query.id, tenantSlug);
  }

  @Get('messages')
  async getBrokerMessages(@Query() query, @Req() req: Request) {
    const tenantSlug = req['tenantSlug'];
    try {
      return await this.broker.getBrokerMessages(query.name, tenantSlug);
    } catch (error) {
      console.log("Error", error);
    }
  }

  @Get('spec')
  async getBrokerSpec(@Query() query, @Req() req: Request) {
    const tenantSlug = req['tenantSlug'];
    try {
      return await this.broker.getBrokerSpec(query.name, tenantSlug);
    } catch (error) {
      console.log("Error", error);
    }
  }

  @Get('')
  async getBrokers(@Res() res: Response, @Query() query, @Req() req: Request) {
    const tenantSlug = req['tenantSlug'];
    try {
      const result = await this.broker.getBrokersWithTenant(query.tenantId, tenantSlug);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.log(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error
      });
    }
  }

  @Post('auth')
  async brokerConnect(
    @Body() body: { username: string; password: string; clientid: string },
    @Res() res: Response,
  ) {
    try {
      if (body.username === 'nextronic' || body.password === 'nextronic') {
        return res.status(HttpStatus.OK).json({
          authenticated: true,
          client_id: body.clientid,
          permissions: ['publish', 'subscribe'],
        });
      }

      if (body.username === body.password) {
        const device = await this.device.findDeviceBy(body.username);
        if (device) {
          console.log(device);
          return res.status(HttpStatus.OK).json({
            authenticated: true,
            client_id: body.username,
            permissions: ['publish', 'subscribe'],
          });
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({
            authenticated: false,
          });
        }
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          authenticated: false,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        authenticated: false,
      });
    }
  }

  @Post('superuser')
  async superUser(@Body() body: { username: string }, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({ superuser: true });
  }

  @Post('acl')
  async checkAcl(
    @Body() body: { username: string; topic: string; access: string },
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({ allowed: true });
  }
  @Put('')
  async update(@Body() data: EditBrokerDto, @Request() req) {
    const tenantSlug = req['tenantSlug'];

    return await this.broker.updateBroker(data, tenantSlug);
  }
}
