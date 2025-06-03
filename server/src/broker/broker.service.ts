import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import FormData from 'form-data';

import { BrokerDto, EditBrokerDto } from './broker.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { broker } from '../../db/schema';
import { GwService } from 'src/gw/gw.service';
import { eq } from 'drizzle-orm';
import { TenancyService } from 'src/tenancy/tenancy.service';
import { apiClient } from 'src/device/api.client';
import { DeviceCreateDto } from 'src/device/device.dto';

@Injectable()
export class BrokerService implements OnModuleInit {
  private logger = new Logger(BrokerService.name);

  constructor(
    @Inject('DB_DEV') private readonly db: NodePgDatabase<typeof schema>,
    private gw: GwService,
    private tenantService: TenancyService,
  ) { }

  async onModuleInit() {
    await this.bootstrap();
  }

  async bootstrap() {
    this.logger.log('set device auto subscribe topics');
    try {
      // await this.createDefaultMqttUser();
      // await this.autoSubscribe();
    } catch (error) {
      console.log(error);
    }
  }

  async getDevices() {
    return await new Promise((resolve, reject) => {
      apiClient
        .get(`authentication/password_based%3Abuilt_in_database/users`)
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', error.response.data);
            console.error('Error Headers:', error.response.headers);
          } else if (error.request) {
            console.error('Error Request:', error.request);
          } else {
            console.error('Error Message:', error.message);
          }
          reject(error);
        });
    });
  }

  async getConnectedDevices() {
    return await new Promise<any>(async (resolve, reject) => {
      try {
        const response = await apiClient.get(`clients`);
        resolve(response.data.data);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async createDevice(data: DeviceCreateDto) {

    this.logger.log(`create new Device : `, data);
    const new_client = [
      {
        user_id: data.username,
        password_hash: data.password,
        is_superuser: false,
      },
    ];
    const form = new FormData();
    form.append('filename', JSON.stringify(new_client), {
      filename: 'users.json',
      contentType: 'application/json',
    });
    return await new Promise((resolve, reject) => {
      apiClient
        .post(
          `authentication/password_based%3Abuilt_in_database/import_users`,
          form,
          {
            headers: {
              'content-type': 'multipart/form-data',
            },
          },
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', error.response.data);
            console.error('Error Headers:', error.response.headers);
          } else if (error.request) {
            console.error('Error Request:', error.request);
          } else {
            console.error('Error Message:', error.message);
          }
          reject(error);
        });
    });
  }

  async addBroker(data: BrokerDto, tenantSlug: string) {
    if (data.ip !== process.env.BROKER_URL && data.ip !== process.env.BROKER_URL2 && data.ip !== process.env.BROKER_URL3 )
    {
      const tenantDb = await this.tenantService.getTenantConnection(tenantSlug);
      const brokerItem = await tenantDb.insert(broker).values({ ...data, tenantSlug }).returning()
        .then((res) => res[0] ?? null);;
      return await this.gw.createBroker(JSON.stringify(brokerItem));
    }
    else {
      throw "local mqtt connection already created"
    }

  }



  async getDefaultBroker() {
    try {
      return await this.db.query.broker.findMany({
        where: eq(broker.name, 'digiSenseBroker'),
      });
    } catch (error) {
      console.error('Error fetching brokers:', error);
      throw error;
    }
  }

  async getBrokersWithTenant(tenantId: number, tenantSlug: string) {
    try {
      const tenantDb = await this.tenantService.getTenantConnection(tenantSlug);
      const result = await tenantDb.query.broker.findMany({
        where: eq(broker.tenantId, tenantId),
      });
      const data = result.map((item) => {
        if (item.hide) return {
          ...item,
          host: "******",
          ip: "******",
          clientId: "******",
          port: "******",
          username: "******",
          password: "******",

        }
        else return item
      })
      return data
    } catch (error) {
      console.error('Error fetching brokers:', error);
      throw error;
    }
  }

  async getBrokerSpec(name: string, tenantSlug: string) {
    try {
      const tenantDb = await this.tenantService.getTenantConnection(tenantSlug);
      const result = await tenantDb.query.broker.findFirst({
        where: eq(broker.name, name),
        with: {
          device: true,
        },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getBrokerMessages(name: string, tenantSlug: string) {
    try {
      let brokerMessages: any[] = [];
      const tenantDb = await this.tenantService.getTenantConnection(tenantSlug);
      const result = await tenantDb.query.broker.findFirst({
        where: eq(broker.name, name),
        with: {
          device: {
            with: {
              event: {
                limit: 2,
              },
            },
          },
        },
      });
      if (result) {
        for (let i = 0; i < result.device?.length; i++) {
          const tempList = result.device[i].event.map((item, index) => {
            return {
              name: result.device[i].name,
              message: JSON.stringify(item.data),
              topic: result.topic.split("+")[0] + result.device[i].serial + result.topic.split("+")[1],
              created_at: item.created_at,
            };
          });
          brokerMessages.push(...tempList);
        }
      }
      return brokerMessages;
    } catch (error) {
      throw error;
    }
  }

  async getBrokers() {
    try {
      return this.db.query.broker.findMany();
    } catch (error) {
      throw error;
    }
  }
  async updateBroker(data: EditBrokerDto, tenantSlug: string) {
    try {
      const dataToUpdate = data.hide ? { topic: data.topic } : data
      const tenantDb = await this.tenantService.getTenantConnection(tenantSlug);
      const brokerItem = await tenantDb.update(schema.broker)
        .set(dataToUpdate)
        .where(eq(schema.broker.id, data.id)).returning()
        .then((res) => res[0] ?? null);;
      this.gw.editBroker(JSON.stringify(brokerItem));
      return "Sucess"
    } catch (error) {
      return 'Error';
    }
  }
  async deleteBroker(id: number, tenantSlug: string) {
    try {
      const tenantDb = await this.tenantService.getTenantConnection(tenantSlug);
      await tenantDb.delete(schema.broker).where(eq(schema.broker.id, id));
    } catch (error) {
      return 'Error';
    }
  }

  async deleteDevice(user_id: string) {
    this.logger.log(`delete Device : `, user_id);
    return await new Promise((resolve, reject) => {
      apiClient
        .delete(`authentication/password_based%3Abuilt_in_database/users/${user_id}`)
        .then((response) => {
          this.logger.log('response : ', response.data);
          resolve(response.data);
        })
        .catch((error) => {
          if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', error.response.data);
            console.error('Error Headers:', error.response.headers);
          } else if (error.request) {
            console.error('Error Request:', error.request);
          } else {
            console.error('Error Message:', error.message);
          }
          reject(error);
        });
    });
  }

  async autoSubscribe() {
    return await new Promise((resolve, reject) => {
      apiClient
        .put(`mqtt/auto_subscribe`, this.generateSubscribeTopics('${clientid}'), {})
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async subscribeDevice(user_id: string) {
    this.logger.log(`subscribe new Device : `, user_id);
    return await new Promise((resolve, reject) => {
      apiClient
        .post(`clients/${user_id}/subscribe/bulk`, this.generateSubscribeTopics(user_id), {})
        .then((response) => {
          this.logger.log('response : ', response.data);
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  generateSubscribeTopics(user_id: string) {
    const status_topic = (process.env.MQTT_TOPIC_STATUS || '').replace('$', user_id);
    const event_topic = (process.env.MQTT_TOPIC_EVENT || '').replace('$', user_id);
    const rpc_topic = (process.env.MQTT_TOPIC_CONF || '').replace('$', user_id);
    this.logger.log(status_topic, event_topic, rpc_topic);
    return [
      {
        topic: event_topic,
        qos: 0,
        nl: 0,
        rap: 0,
        rh: 0,
      },
      {
        topic: status_topic,
        qos: 0,
        nl: 0,
        rap: 0,
        rh: 0,
      },
      {
        topic: rpc_topic,
        qos: 0,
        nl: 0,
        rap: 0,
        rh: 0,
      },
    ];
  }

  async createDefaultMqttUser() {
    await this.createDevice({
      password: 'nextronic',
      username: 'nextronic',
    });
  }
}
