import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy, RefreshTokenStrategy } from './stragegies';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './email.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot(), JwtModule.register({}), UsersModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, MailService],
  exports: [AuthService],
})
export class AuthModule { }

