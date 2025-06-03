import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService implements OnModuleInit {
  constructor() {}
  private io: Server | undefined;
  private logger = new Logger(SocketService.name);

  onModuleInit() {
    this.io = new Server({
      cors: {
        origin: '*',
      },
    });
    this.io.listen(5000, {
      cors: { origin: '*' },
    });
    this.io.on('connection', this.onConnect.bind(this));
  }

  onConnect(socket: any) {
    console.log('[d] new Socket Client Connected!', socket.id);
    socket.on('disconnect', () =>
      console.log('client disconnected', socket.id),
    );
    socket.on('discovery', this.onDiscovery.bind(this, socket.id));
  }

  async onDiscovery(data: any) {
    console.log('data', data);
  }

  send(topic: string, data: any) {
    if (this.io) {
      this.io.emit(topic, data);
    } else {
      this.logger.error('Socket server is not initialized.');
    }
  }
}
