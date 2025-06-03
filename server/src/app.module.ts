/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ShellModule } from './shell/shell.module';
import { DeviceModule } from './device/device.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import * as schema from '../db/schema'
import { GwModule } from './gw/gw.module';
import { AiModule } from './ai/ai.module';
import { AnalyticModule } from './analytics/analytic.module';
import { TokenModule } from './tokens/token.module';
import { TenancyModule } from './tenancy/tenancy.module';
import { TenantMiddleware } from './tenancy/tenant.middleware';
import { PaymentModule } from './payment/payment.module';
import { SocketModule } from './socket/socket.module';
import { WorkflowModule } from './workflow/workflow.module';
import { MachineModule } from './machine/machine.module';
import { ConnectionModule } from './connection/machine.module';
import { BrokerModule } from './broker/broker.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    ServeStaticModule.forRoot(

      {
        rootPath: join(__dirname, '..', '..', 'flows/components'),
        serveRoot: '/components',
      },
      {
        rootPath: join(__dirname, '..', '..', 'front'),
        exclude: ['/components*'],
      },
    ),
    DrizzlePGModule.register({
      tag: "DB_DEV",
      pg: {
        connection: 'pool',
        config: {
          connectionString: process.env.DATABASE_URL
        }
      },
      config: {
        schema: { ...schema }
      }
    }),

    EventEmitterModule.forRoot(),
    ConfigModule.forRoot(),
    SocketModule,
    DeviceModule,
    AuthModule,
    UsersModule,
    GwModule,
    AnalyticModule,
    TokenModule,
    TenancyModule,
    PaymentModule,
    WorkflowModule,
    MachineModule,
    ConnectionModule,
    BrokerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
