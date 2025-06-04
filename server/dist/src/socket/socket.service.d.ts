import { OnModuleInit } from '@nestjs/common';
export declare class SocketService implements OnModuleInit {
    constructor();
    private io;
    private logger;
    onModuleInit(): void;
    onConnect(socket: any): void;
    onDiscovery(data: any): Promise<void>;
    send(topic: string, data: any): void;
}
