import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common';
import * as dgram from 'dgram';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class DiscoveryService implements OnModuleInit {
  private logger = new Logger('Discover Service');
  private socket: dgram.Socket | undefined;
  private port = process.env.DISCOVERY_PORT;
  private findedDevices: any[] = [];
  constructor(
    @Inject(forwardRef(() => SocketService))
    private socketService: SocketService,
  ) {}
  onModuleInit() {
    this.logger.log('[d] init discover service ....');
    this.bootstrap();
  }

  async bootstrap() {
    this.socket = dgram.createSocket('udp4');
    this.socket.on('error', this.onSocketError.bind(this));
    this.socket.on('message', this.onMessage.bind(this));
    this.socket.on('listening', this.onListening.bind(this));
    if (this.socket && this.port) {
      this.socket.bind(+this.port, '0.0.0.0');
    }
  }

  onSocketError(error) {
    this.logger.error(error);
  }
  onListening() {
    if(this.socket)
    {
      this.socket.setBroadcast(true);
      const socketAddress = this.socket.address();
      console.log(`Listening at ${socketAddress.address}:${socketAddress.port}`);
    }

  }
  onMessage(msg, remoteInfo) {
    try {
      JSON.parse(msg);
      this.logger.log(
        `Message: ${msg} from ${remoteInfo.address}:${remoteInfo.port}`,
      );
      this.findedDevices.push({
        address: remoteInfo.address,
        description: msg.toString(),
      });
    } catch (error) {}
  }
  async getDevices() {
    this.broadcast();
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.findedDevices);
      }, 2 * 1000);
    });
  }
  broadcast() {
    this.findedDevices = [];
    const message = 'test';
    console.log('sending');
    if(this.socket)
    {
      this.socket.send(
        message,
        0,
        message.length,
        5555,
        '255.255.255.255',
        (err) => {
          if (err) {
            console.error('Broadcast error:', err);
            if(this.socket)
            this.socket.close();
          }
        },
      );
    }
    }
   
}
