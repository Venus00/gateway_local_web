import { Controller, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { ClientNats, ClientProxy, Ctx, EventPattern, MessagePattern, NatsContext, Payload } from '@nestjs/microservices';
import { SocketGatway } from 'src/socket/socket.gatway';

@Controller('gw')
export class GwController implements OnApplicationBootstrap {
    constructor(
        private socket: SocketGatway,
        @Inject('Device_Service') private client: ClientNats
    ) { }

    async onApplicationBootstrap() {
    }


    @MessagePattern('socket.data')
    getNotifications(@Payload() data: { event: string, message: string }, @Ctx() context: NatsContext) {
        console.log(`Subject: ${context.getSubject()}`);
        this.socket.emitToAll(data.event, data.message);
        console.log(data);
    }

}
