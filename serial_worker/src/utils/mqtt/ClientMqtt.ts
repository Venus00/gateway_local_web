import * as mqtt from 'mqtt';
import { EventEmitter } from "stream";
import { BrokerDto } from '../Broker.dto';

export class ClientMqtt extends EventEmitter {

    private client: BrokerDto | undefined;
    private mqttClient: mqtt.MqttClient | undefined;
    private subj: string | undefined

    constructor(client: BrokerDto) {
        super();
        console.log(`[d] mqtt client ${client.ip} inited succefully`);
        this.subj = `mqtt.publish.${client.name}`
        this.initClient(client);
    }
    initClient(client: BrokerDto) {
        this.client = client;
        console.log(this.client)
        this.mqttClient = mqtt.connect(`mqtt://${this.client.ip}:${this.client.port}`, {
            username: this.client.username,
            password: this.client.password,
            clientId: this.client.clientId
        });
        this.mqttClient.on('message', this.onMessage.bind(this));
        this.mqttClient.on('connect', this.onConnect.bind(this));
        this.mqttClient.on('disconnect', this.onDisconnect.bind(this));
    };


    edit(broker: BrokerDto) {
        console.log("edit connection now")
        if (this.mqttClient) {
            this.client = broker;
            this.mqttClient.end(true);
            this.mqttClient.removeAllListeners();
            this.mqttClient = undefined;

            this.mqttClient = mqtt.connect(`mqtt://${broker.ip}:${broker.port}`, {
                username: broker.username,
                password: broker.password,
                clientId: broker.clientId
            });
            this.mqttClient.on('message', this.onMessage.bind(this));
            this.mqttClient.on('connect', this.onConnect.bind(this));
            this.mqttClient.on('disconnect', this.onDisconnect.bind(this));
        }
    }
    async onMessage(topic: string, message: Buffer) {
        try {
            console.log(`message has been arrived from ${topic} message ${message}`);
            //this.nc?.publish('mqtt',message)
            if (this.subj) {
                console.log("publish message now")
                const ack = await this.js?.publish(`mqtt.${this.client?.name}`, JSON.stringify({
                    broker: this.client?.name,
                    dt: new Date(),
                    payload: JSON.parse(message.toString()),
                    topic,
                }));
                console.log(ack)
            }
        } catch (error) {
        }

        //this.emit('message',this.client?.name,topic,message)
    }
    onDisconnect() {
        this.emit('disconnect', this.client?.name);

    }
    onConnect() {
        //this.mqttClient.subscribe('nxt/devices/+/event');
        console.log(this.client?.topic)
        this.mqttClient?.subscribe(this.client?.topic || '');
        this.emit('connect', this.client?.name);
    }

}