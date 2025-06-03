import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGatway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    
    @WebSocketServer()
    server: Server;
    
    afterInit(server: Server) {
        console.log('Socket server initialized');
    }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    emitToAll(event: string, data: any) {
        this.server.emit(event, JSON.stringify(data));
      }

    @SubscribeMessage('message')
    handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        console.log('Message received:', data);
        client.broadcast.emit('message', data);
    }
}
