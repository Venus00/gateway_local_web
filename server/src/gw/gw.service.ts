import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Client, ClientProxy, Ctx, EventPattern, MessagePattern, NatsContext, Payload } from '@nestjs/microservices';
import { ClientNats } from '@nestjs/microservices';
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';
@Injectable()
export class GwService implements OnApplicationBootstrap {
    constructor(
        @Inject('Device_Service') private client: ClientNats,
    ) { }

    async onApplicationBootstrap() {
        try {
            await this.client.connect();
            console.log("Connected to NATS server");
        } catch (error) {
            console.error("Failed to connect to NATS:", error);
        }

    }

    async editBroker(data: string) {
        try {

            console.log("[i] editBroker broker ...", data)
            this.client.emit('gw.mqtt.edit', data)
            console.log("finish")
            return 'success'
        }
        catch (e) {
            return e;
        }
    }

    async createBroker(data: string) {
        try {
            console.log("[i] creating broker ...")
            this.client.emit('gw.mqtt.create', data)
            console.log("finish")
            return 'success'
        }
        catch (e) {
            return e;
        }

    }
    async deleteBroker(data: string) {
        this.client.emit('gw.mqtt.delete', data)
    }

}
