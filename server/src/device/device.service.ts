/* eslint-disable */
import { ForbiddenException, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  DeviceInsertDto,
  DeviceTypeInsertDto,
  DeviceTypeUpdateDto,
} from './device.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { connectionInputs, device, device_input, device_output, event } from '../../db/schema';
import { and, or, eq, gt, gte, lt, SQL, SQLWrapper, desc, asc } from 'drizzle-orm';
import moment from 'moment';
import { TenancyService } from 'src/tenancy/tenancy.service';
import { BrokerService } from 'src/broker/broker.service';
@Injectable()
export class DeviceService implements OnModuleInit {
  private logger = new Logger(DeviceService.name);
  constructor(
    private tenant: TenancyService,
    @Inject('DB_DEV') private readonly db: NodePgDatabase<typeof schema>,
    private broker: BrokerService,
  ) { }
  async onModuleInit() {
    this.checkDeviceStatus();
  }

  async findDeviceBy(username: string) {
    return await this.db.query.device.findFirst({
      where: (device, { eq }) => eq(device.serial, username),
      with: {
        broker: true,
        deviceInput: true,
        deviceOutput: true,
        type: true,
      },
    })
  }
  async findDeviceById(id: number, tenantSlug: string) {
    return await this.db.query.device.findFirst({
      where: eq(device.id, id), with: {
        broker: true,
        deviceInput: true,
        deviceOutput: true,
        type: true,
      },
    });

  }
  async checkDeviceStatus() {
    setInterval(async () => {
      await this.broker.getConnectedDevices().then(async (data) => {
        const devices = await this.findDevices();
        devices.map(async (device: { serial: string | SQLWrapper; }) => {
          const index = data.findIndex((obj: { username: any; }) => obj.username === device.serial);
          if (index !== -1) {
            await this.db.update(schema.device).set({
              status: 1,
            }).where(eq(schema.device.serial, device.serial));
          } else {
            await this.db.update(schema.device).set({
              status: 0,
            }).where(eq(schema.device.serial, device.serial));
          }
        });
      });
    }, 2 * 5000);
  }
  async deleteDeviceType(name: string, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

    try {
      await tenantDb.delete(schema.device_type).where(eq(schema.device_type.name, name));
      return 'Success';
    } catch (error) {
      return 'Error';
    }
  }
  async deleteDevice(serial: string, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

    try {
      await tenantDb.delete(device).where(eq(device.serial, serial));
      return 'Success';
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async updateDeviceType(data: DeviceTypeUpdateDto, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);
    try {
      if (data.name) {
        await tenantDb.update(schema.device_type).set(data).where(eq(schema.device_type.id, data.id));
      } else {
        throw new Error('Device type name is required');
      }
      return 'Success';
    } catch (error) {
      throw error;
    }
  }
  async createDeviceType(data: DeviceTypeInsertDto, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

    try {
      return await tenantDb.insert(schema.device_type).values(data).execute();
    } catch (error) {
      throw error;
    }
  }
  async getDeviceType(tenantId: number, tenantSlug: string) {
    try {
      const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

      return await tenantDb.query.device_type.findMany({
        where: eq(schema.device_type.tenantId, tenantId)
      });
    } catch (error) {
      throw new ForbiddenException('Access denied: No permissions found');

    }

  }
  async insertDevice(data: DeviceInsertDto, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

    try {
      console.log(data)
      const [selected_device] = await tenantDb.insert(device).values({
        tenantId: data.tenantId,
        name: data.name,
        brokerId: data.brokerId,
        typeId: data.typeId,
        serial: data.serial,
        config: data.config
      }).returning({ id: device.id });

      if (data.attribute) {
        await tenantDb.insert(device_input).values(
          data.attribute.input.map((input, key) => ({
            deviceId: selected_device.id,
            name: input,
            label: data.attribute!.newInput[key],
          }))
        );
        if (data.attribute.output.length !== 0)
          await tenantDb.insert(device_output).values(
            data.attribute.output.map((output, key) => ({
              deviceId: selected_device.id,
              name: output,
              label: data.attribute!.newOutput[key],

            }))
          );
      }
      //await this.setupDeviceConfiguration(data);
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  async updateDevice(data: Partial<DeviceInsertDto>, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);
    try {
      if (data.id && data.serial) {
        const [selected_device] = await tenantDb.update(device).set({
          typeId: data.typeId,
          brokerId: data.brokerId,
          name: data.name,
          config: data.config
        }).where(eq(device.serial, data.serial)).returning({ id: device.id });
        const previousDevice = await tenantDb.query.device.findFirst({
          where: eq(device.id, data.id),
          with: {
            deviceInput: true,
            deviceOutput: true,
          },
        });
        const conInputs = previousDevice?.deviceInput.map((item) => item.name) || [];
        const dataInputs = data.attribute?.input?.map((item) => item) || [];
        const inputsToDelete = conInputs?.filter((item) => !dataInputs.includes(item)) || [];
        const inputsToAdd = dataInputs?.filter((item) => !conInputs.includes(item)) || [];
        
        for (let key = 0; key < inputsToDelete.length; key++) {
          
          await tenantDb.delete(device_input).where(
            and(
              eq(device_input.deviceId, data.id),
              eq(device_input.name, inputsToDelete[key])
            )
            )
        }
        if( inputsToAdd.length !== 0) {
          await tenantDb.insert(device_input).values(
            inputsToAdd.map((input, key) => ({
              deviceId: selected_device.id,
              name: input,
              label: data.attribute!.newInput[key],
            }))
          );
        }

        for (let key = 0; key < data.attribute!.input.length; key++) {
          await tenantDb
            .update(device_input)
            .set({
              label: data.attribute!.newInput[key],
            })
            .where(
              and(
                eq(device_input.deviceId, data.id),
                eq(device_input.name, data.attribute!.input[key])
              )
            );
        }
        
        const conOutputs = previousDevice?.deviceOutput.map((item) => item.name) || [];
        const dataOutputs = data.attribute?.output?.map((item) => item) || [];
        const outputsToDelete = conOutputs?.filter((item) => !dataOutputs.includes(item)) || [];
        const outputsToAdd = dataOutputs?.filter((item) => !conOutputs.includes(item)) || [];
        for (let key = 0; key < outputsToDelete.length; key++) {
          await tenantDb.delete(device_output).where(
            and(
              eq(device_output.deviceId, data.id),
              eq(device_output.name, outputsToDelete[key])
            )
          )
        }
        if (outputsToAdd.length !== 0) {
          await tenantDb.insert(device_output).values(
            outputsToAdd.map((output, key) => ({
              deviceId: selected_device.id,
              name: output,
              label: data.attribute!.newOutput[key],
            }))
          );
        }
        for (let key = 0; key < data.attribute!.output.length; key++) {
          await tenantDb
            .update(device_output)
            .set({
              label: data.attribute!.newOutput[key],
            })
            .where(
              and(
                eq(device_output.deviceId, data.id),
                eq(device_output.name, data.attribute!.output[key])
              )
            );
        }
        
      }
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  async findEventsWithTenant(tenantId: number, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

    try {
      const eventList: any[] = [];
      const devices = await tenantDb.query.device.findMany({
        where: eq(device.tenantId, tenantId),
      });
      for (let i = 0; i < devices.length; i++) {
        const deviceEvent = await tenantDb.query.event.findMany({
          where: eq(device.id, devices[i].id),
          limit: 10
        });
        if (deviceEvent) eventList.push(...deviceEvent);
      }
      return eventList
    } catch (error: any) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  }
  async findDevicesWithTenant(tenantId: number, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

    try {
      return await tenantDb.query.device.findMany({
        with: {
          broker: true,
          deviceInput: true,
          deviceOutput: true,
          type: true,
        },
        where: eq(device.tenantId, tenantId)
      });
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  }
  async findDevices() {
    try {
      return await this.db.query.device.findMany({
        with: {
          broker: true,
          deviceInput: true,
          deviceOutput: true,
          type: true,
        },
      });
    } catch (error) {
      console.error('Error fetching devices:', error);
      throw error;
    }
  }

  async setupDeviceConfiguration(data: { serial: any }) {
    await this.broker.createDevice({
      password: data.serial,
      username: data.serial,
    });
  }
  async getHistoricalDashboardData(data) {
    try {
      console.log(data)
      const { from, to, tenantId } = data
      let dataResult: any[] = [];
      const eventList: any[] = [];
      const devices = await this.db.query.device.findMany({
        where: eq(device.tenantId, tenantId),
      });
      for (let i = 0; i < devices.length; i++) {
        const deviceEvent = await this.db.query.event.findMany({
          where: and(
            eq(event.deviceId, devices[i].id),
            lt(event.created_at, new Date(to)),
            gt(event.created_at, new Date(from))
          )

        });
        if (deviceEvent) eventList.push(...deviceEvent);
      }

      const result: {
        x: Date;
        y: number;
      }[] = [];
      eventList.sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));

      eventList.forEach((item) => {
        const last = result[result.length - 1];
        const date: Date = new Date(item.created_at);
        date.setMinutes(0, 0, 0);
        if (!last || new Date(last.x).getTime() !== date.getTime()) {
          result.push({
            x: moment(date).toDate(),
            y: 1,
          });
        }
        if (last && new Date(last.x).getTime() === date.getTime()) {
          last.y += 1;
        }
      })
      dataResult.push({
        telemetrieName: 'totalEvents',
        chartData: result
      })
      return dataResult;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
  async getLastData(data: { telemetrie: any; machineId: any }, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

    try {
      const { telemetrie, machineId } = data
      const connectionInput = await tenantDb.select().from(connectionInputs)
        .where(eq(connectionInputs.machineId, +machineId))
      for (let j = 0; j < connectionInput.length; j++) {
        const [deviceItem] = await tenantDb.select().from(device_input)
          .where(and(
            eq(device_input.label, telemetrie),
            eq(device_input.id, connectionInput[j].inputId)
          ))
        if (deviceItem) {
          const [events] = await tenantDb.query.event.findMany(
            {
              where: eq(event.deviceId, deviceItem.deviceId),
              limit: 1,
              orderBy: [desc(event.id)]
            });
          console.log(events)
          return events.data?.[deviceItem.name]
        }
      }
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
  async getDeviceMessages(id: number, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

    try {
      return await tenantDb.query.event.findMany({
        where: eq(event.deviceId, id),
        limit: 20,
        orderBy: [desc(event.id)]
      })
    } catch (error) {
      throw error;
    }
  }
  async getHistoricalData(data, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);
    try {
      const { telemetries, machineId, from, to, page, perPage, order } = data
      let result: any[] = [];
      for (let i = 0; i < telemetries.length; i++) {
        const connectionInput = await tenantDb.select().from(connectionInputs)
          .where(eq(connectionInputs.machineId, machineId))
        for (let j = 0; j < connectionInput.length; j++) {
          const [deviceItem] = await tenantDb.select().from(device_input)
            .where(and(
              eq(device_input.label, telemetries[i].name),
              eq(device_input.id, connectionInput[j].inputId)
            ))
          console.log(deviceItem)
          if (deviceItem) {
            const events = await tenantDb.query.event.findMany(
              {
                where: and(
                  eq(event.deviceId, deviceItem.deviceId),
                  lt(event.created_at, new Date(to)),
                  gt(event.created_at, new Date(from))

                ),
                // orderBy: [asc(event.created_at)]
                // Typically order by date for pagination
              });


            let chartData: any[] = events.map((event) => {
              if (event.data && event.data[deviceItem.name] && event.data[deviceItem.name] !== -9999) {
                console.log("finded", event.data[deviceItem.name])
                if (event.data['dt']) {
                  const dt = new Date(event.data['dt']).getFullYear()
                  if (dt > 2000)
                    return {
                      x: moment(new Date(event.data['dt'])).format('YYYY-MM-DD hh:mm:ss a'),
                      y: event.data[deviceItem.name]
                    }
                  else {
                    return {
                      x: event.created_at,
                      y: event.data[deviceItem.name]
                    }
                  }
                }
                else {
                  return {
                    x: event.created_at,
                    y: event.data[deviceItem.name]
                  }
                }
              }

            })
            chartData.sort((a, b) => order === "asc" ? +new Date(a.x) - +new Date(b.x) : +new Date(b.x) - +new Date(a.x));
            const paginatedChartData = chartData.slice(
              (page - 1) * perPage,
              page * perPage
            );
            result.push({
              telemetrieName: telemetries[i].name,
              chartData: page && perPage ? paginatedChartData : chartData,
              total: chartData.length,
            });
            break;
          }
        }
      }
      return result;
    } catch (error) {
      console.log(error)
      return [];
      throw error;
    }
  }
  async getMapHistoricalData(data, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);
    try {
      const { telemetries, machineId, from, to, page, perPage, order } = data
      let result: any[] = [];
      for (let i = 0; i < telemetries.length; i++) {
        const connectionInput = await tenantDb.select().from(connectionInputs)
          .where(eq(connectionInputs.machineId, machineId))
        const lastPosition: any = {
          label: telemetries[i].label,
          longitude: 0,
          latitude: 0
        };
        for (let j = 0; j < connectionInput.length; j++) {
          console.log("connectionInput", connectionInput[j].inputId);

          const [deviceItem] = await tenantDb.select().from(device_input)
            .where(and(
              or(eq(device_input.label, telemetries[i].longitude), eq(device_input.label, telemetries[i].latitude)),
              // eq(device_input.label, telemetries[i].latitude || telemetries[i].longitude),
              eq(device_input.id, connectionInput[j].inputId)
            ))
          console.log("deviceItem", deviceItem)
          if (deviceItem) {
            const [events] = await tenantDb.query.event.findMany(
              {
                where: eq(event.deviceId, deviceItem.deviceId),
                limit: 1,
                orderBy: [desc(event.id)]
              });
            console.log(events)
            if (events.data && events.data[deviceItem.name] && events.data[deviceItem.name] !== -9999) {
              if (deviceItem.label === telemetries[i].longitude) {
                lastPosition.longitude = events.data[deviceItem.name];
              } else if (deviceItem.label === telemetries[i].latitude) {
                lastPosition.latitude = events.data[deviceItem.name];
              }
            }
            continue
          }
          // result.push({
          //   label: telemetries[i].label,
          //   [deviceItem.name] : events.data?.[deviceItem.name] || 0,
          //   // longitude:events.data?.[deviceItem.name] || 0,
          // });
          console.log("lastPosition", lastPosition);

        }
        result.push(lastPosition);
      }
      console.log("result", result);

      return result;
    } catch (error) {
      console.log(error)
      return [];
      throw error;
    }
  }
}
