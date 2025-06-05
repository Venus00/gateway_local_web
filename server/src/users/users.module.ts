import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [UsersService, TenantService, ConfigService],
  controllers: [UserController, TenantController],
  exports: [UsersService, TenantService]
})
export class UsersModule { }
