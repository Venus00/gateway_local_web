import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './stragegies';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './email.service';
import { TenancyModule } from 'src/tenancy/tenancy.module';
import { DeviceModule } from 'src/device/device.module';
import { BrokerService } from 'src/broker/broker.service';
import { GwModule } from 'src/gw/gw.module';

@Global()
@Module({
  imports: [ConfigModule.forRoot(), JwtModule.register({}), UsersModule, TenancyModule, DeviceModule,GwModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, MailService,BrokerService],
  exports: [AuthService],
})
export class AuthModule { }

