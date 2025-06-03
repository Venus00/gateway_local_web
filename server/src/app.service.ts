import { HttpException, HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { GwService } from 'src/gw/gw.service';
import { eq } from 'drizzle-orm';
import { TenancyService } from 'src/tenancy/tenancy.service';
import { apiClient } from 'src/device/api.client';
import { DeviceCreateDto } from 'src/device/device.dto';
import * as schema from '../db/schema'
import { broker, device } from '../db/schema';
import { relativeTimeRounding } from 'moment';
import { HttpStatusCode } from 'axios';

export interface DeviceConfiguration {
    clientId: string;
    username: string;
    password: string;
    subTopic: string;
    pubTopic: string;
    connectionType: string;
}
@Injectable()
export class AppService implements OnModuleInit {
    private logger = new Logger(AppService.name);

    constructor(
        @Inject('DB_DEV') private readonly db: NodePgDatabase<typeof schema>,
    ) { }

    async onModuleInit() {
    }


    async checkUserAccess(payload) {
        try {
            const { username, password, clientId } = payload;
            if (username === process.env.MQTT_WORKER_USERNAME && password === process.env.MQTT_WORKER_PASSWORD) {
                if (clientId.includes('local_broker_')) {
                    const brokerItem = await this.db.query.broker.findFirst({
                        where: eq(broker.clientId, clientId),
                        with: {
                            tenant: true
                        }
                    }) as any;
                    return {
                        result: 'allow',
                        acl:
                            [
                                {
                                    permission: "allow",
                                    action: "all",
                                    topic: `${brokerItem?.tenant?.name}/#`,
                                },
                                {
                                    permission: "deny",
                                    action: "all",
                                    topic: "#",
                                },

                            ]
                    }
                }
                return {
                    is_superuser: true,
                    result: 'allow',
                    acl:
                        [
                            {
                                permission: "allow",
                                action: "all",
                                topic: "#",
                            },

                        ]
                }
            }
            else {
                const deviceItem = await this.db.query.device.findFirst({
                    where: eq(device.serial, clientId)
                })
                if (deviceItem && deviceItem.config) {
                    const config: DeviceConfiguration = JSON.parse(deviceItem.config)
                    if (config.connectionType === "MQTT") {
                        if (config.username === username && config.password === password) {
                            return {
                                result: 'allow',
                                acl:
                                    [
                                        {
                                            permission: "allow",
                                            action: "publish",
                                            topic: config.pubTopic,
                                        },
                                        {
                                            permission: "allow",
                                            action: "subscribe",
                                            topic: config.subTopic,
                                        },
                                        {
                                            permission: "deny",
                                            action: "all",
                                            topic: "#",
                                        },

                                    ]
                            }
                        }

                    }
                    else throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
                }
                throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
            }

        } catch (error) {
            throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
        }

    }


}
