import { Module } from '@nestjs/common';
import { GwService } from './gw.service';
import { GwController } from './gw.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'Device_Service',
        transport: Transport.NATS,
        options: {
          servers: [`${process.env.NATS_URL}`],
        }
      },
    ]), SocketModule,
  ],
  providers: [GwService],
  controllers: [GwController],
  exports: [GwService]
})
export class GwModule { }
