import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { TenancyModule } from 'src/tenancy/tenancy.module';
import { MailService } from 'src/auth/email.service';
import { ConfigService } from '@nestjs/config';
import { BrokerModule } from 'src/broker/broker.module';

@Module({
  imports: [TenancyModule,BrokerModule],
  providers: [UsersService,TenantService,MailService,ConfigService],
  controllers: [UserController,TenantController],
  exports: [UsersService,TenantService]
})
export class UsersModule {}
