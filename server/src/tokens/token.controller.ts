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
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/auth.guards';
import { Permission, Role } from 'src/common/guards/role.enum';
import { PermissionsGuard,Permissions } from 'src/common/guards/licencePermission.guard';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { CreateTokenDto, EditTokenDto } from './token.dto';
import { TokenService } from './token.service';

@Controller('tokens')
@UseGuards(AccessTokenGuard,RolesGuard,PermissionsGuard)
export class TokenController {
  constructor(private token: TokenService) {}


  @Post('')
  @Roles(Role.Admin)
  async createDevice(@Body() data: CreateTokenDto) {
    console.log('create token : ', JSON.stringify(data));
    return await this.token.insertToken(data);
  }

  @Get('')
  async find(@Query() query) {
    const tokens = await this.token.findTokens(query.tenantId);
    return tokens;
  }
  

  @Get('/:tokenId')
  async findTokenById(@Param('tokenId') tokenId:number)
  {
    try {
      const token = await this.token.findTokenById(Number(tokenId));
      return token;
    } catch (error) {
      console.log(error)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
   
  }

  @Put('')
    async update(@Body() data: EditTokenDto) {
      return await this.token.updateToken(data);
    }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.token.deleteToken(id);
  }
  
  
 
}
