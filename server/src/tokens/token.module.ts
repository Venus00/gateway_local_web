/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common'
import { GwModule } from 'src/gw/gw.module'
import { TokenService } from './token.service'
import { TokenController } from './token.controller'
import { AccessTokenStrategy, RefreshTokenStrategy } from 'src/auth/stragegies'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule.forRoot(), JwtModule.register({}),GwModule],
  providers: [TokenService,AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [
    TokenController
  ],
})
export class TokenModule {}
