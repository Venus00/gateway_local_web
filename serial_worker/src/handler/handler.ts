// Creation Date: 10.10.2020
import { EventEmitter } from 'events';
import {connect, JetStreamClient, JetStreamManager, NatsConnection, StringCodec} from 'nats';
import { BrokerDto } from '../utils/Broker.dto';
import { db } from '../utils/db/db';
import { broker } from '../utils/db/schema';
import { eq } from 'drizzle-orm';
import { NatsClient } from '../utils/nats/ClientNats';
import { ClientMqtt } from '../utils/mqtt/ClientMqtt';
import { createConnection } from 'net';
import { classicNameResolver } from 'typescript';

export class Handler extends EventEmitter {
    private mqttClients:BrokerDto[] = [];
    private connections:any[] = [];
    private db = db;
    private natsClient:NatsClient| undefined;
    private nc:NatsConnection | undefined;
    private js:JetStreamClient | undefined;
    constructor(){
        super();
        this.initialSetup();
    }    

    async initialSetup(){
        this.natsClient = new NatsClient();
        this.nc = await this.natsClient.connect();
        this.natsClient?.subscribe('gw.mqtt.*',this.onConfigMqttConnection.bind(this));

        this.js = this.nc?.jetstream();
        this.loadMqttConnections();
    }
    async loadMqttConnections(){
        console.log("[i] load mqtt connection sotred in db");
        this.mqttClients = await this.db.select().from(broker);
        for(let i=0;i<this.mqttClients.length;i++)
        {
            this.setupMqttClient(this.mqttClients[i]);
        }
    }


    async onConfigMqttConnection(context:string,message:any){
        try {
        const payload = JSON.parse(message).data
        switch (context) {
            case 'gw.mqtt.edit':
                console.log("edit",payload)
                for(let i=0;i<this.connections.length;i++)
                    {
                        console.log(this.connections[i].id)
                        console.log(JSON.parse(payload).id)
                        if(this.connections[i].id === JSON.parse(payload).id)
                        {
                            
                            this.connections[i].connection.edit(JSON.parse(payload));
                        }
                }
                break;
            case 'gw.mqtt.create':
                console.log("create",JSON.parse(payload))
                this.setupMqttClient(JSON.parse(payload));
            default:
                break;
        }
        } catch (error) {
            console.log(error)
        }
        
    }
    async onDisconnect(name:string){
        console.log('[i] mqtt connection disconnected from ',name);
        await this.db.update(broker).set({
            status:0
        }).where(eq(broker.name,name));
    }
    async onConnect(name:string){
        console.log('[i] mqtt conection is connected to ',name);
        await this.db.update(broker).set({
            status:1
        }).where(eq(broker.name,name));
    }

    onData(broker:string,topic:string,message:string){
        console.log('broker : ',broker,'\n   topic : ',topic,'\n payload  : ',message);
        this.emit('message',broker,topic,message);
    }

    
    setupMqttClient(broker:BrokerDto){
        if (this.nc) {
            const connection:ClientMqtt = new ClientMqtt(broker, this.nc);
            connection.on('connect', this.onConnect.bind(this));
            connection.on('disconnect', this.onDisconnect.bind(this));
            this.connections.push({
                id:broker.id,
                connection:connection
            });
        } else {
            console.error('NATS connection is not initialized.');
        }
    }
    
}