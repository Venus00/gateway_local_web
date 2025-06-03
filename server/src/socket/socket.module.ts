import { Module } from '@nestjs/common';
import { SocketGatway } from './socket.gatway';

@Module({
  imports: [],
  providers: [SocketGatway],
  exports: [SocketGatway],
})
export class SocketModule { }
