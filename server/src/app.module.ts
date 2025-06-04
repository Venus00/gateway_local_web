/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import * as schema from '../db/schema'
import { SocketModule } from './socket/socket.module';
import { WorkflowModule } from './workflow/workflow.module';
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
    AuthModule,
    UsersModule,
    WorkflowModule,
  ],
  controllers: [],
  providers: [],
});
