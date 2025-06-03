/* eslint-disable prettier/prettier */
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { and, desc, eq, gt, lt } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { analytics, analytics_events } from '../../db/schema';
import { AnalyticLayoutDto, CreateAnalyticDto } from './analytic.dto';
import moment from 'moment';
import { serial } from 'drizzle-orm/mysql-core';
import { SocketGatway } from 'src/socket/socket.gatway';
@Injectable()
export class AnalyticService implements OnModuleInit {
  private logger = new Logger(AnalyticService.name);
  constructor(
    private readonly socketGatway: SocketGatway,
    @Inject('DB_DEV') private readonly db: NodePgDatabase<typeof schema>) { }
  async onModuleInit() { }

  async deleteAnalytic(serial: string) {
    try {
      await this.db.delete(analytics).where(eq(analytics.serial, serial)).execute();
      // await this.prisma.machine.delete({
      //   where: {
      //     serial,
      //   },
      // });
      return 'Success';
    } catch (error) {
      return 'Error';
    }
  }
  async deleteAnalyticDashboard(id: number) {
    try {
      await this.db.update(analytics).set({
        layout: "",
        widget: "",
      }).where(eq(analytics.id, id)).execute();
      return 'Success';
    } catch (error) {
      return 'Error';
    }
  }


  async insertAnalytic(data: CreateAnalyticDto) {
    try {
      const analyticItem = this.db.select().from(analytics)
        .where(and(eq(analytics.tenantId, data.tenantId), (eq(analytics.serial, data.serial))))
      if (!analyticItem)
        await this.db.insert(analytics).values(data).execute();
      // await this.prisma.machine.create({ data }); 
      return 'success';
    } catch (error) {
      console.log(error);
      return 'Error';
    }
  }

  async insertLayout(id: number, data: AnalyticLayoutDto) {
    try {

      await this.db.update(analytics).set({
        layout: JSON.stringify(data.layout),
        widget: JSON.stringify(data.widget),
      }).where(eq(analytics.id, id)).execute();

      // await this.prisma.machine.update({
      //   where: {
      //     id,
      //   },
      //   data: {
      //     layout: JSON.stringify(data.layout),
      //     widget: JSON.stringify(data.widget),
      //   },
      // });
      return 'Success';
    } catch (error) {
      console.log(error)
      return 'Error';
    }
  }

  async findAnalyticById(id: number) {
    return await this.db.query.analytics.findFirst({
      where: (analytic, { eq }) => eq(analytics.id, id),

    })
  }
  async findAnalyticBySerial(serial: string) {
    return await this.db.query.analytics.findFirst({
      where: (analytic, { eq }) => eq(analytics.serial, serial),
    })
  }
  async findAnalytic(tenantId: number) {
    try {
      return await this.db.query.analytics.findMany(
        {
          where: eq(analytics.tenantId, tenantId)
        }
      );
    } catch (error) {
      console.error('Error fetching machines:', error);
      throw error;
    }
  }
  async findAnalyticEvent(analytic_id: number) {
    try {
      const res = await this.db.selectDistinct({ name: analytics_events.name })
        .from(analytics_events)
        .where(eq(analytics_events.analyticsId, analytic_id))
        .orderBy(analytics_events.name);
      return res.map(obj => obj.name);
    } catch (error) {
      console.error('Error fetching machines:', error);
      throw error;
    }
  }

  async findOutput(analyticId: number, telemetrie: string) {
    try {
      const res = await this.db.query.analytics.findFirst(
        {
          where: and(
            eq(analytics.id, analyticId),
          ),
        }
      );
      return res?.outputs?.split(',')
    } catch (error) {
      console.error('Error fetching machines:', error);
      throw error;
    }
  }

  async findTelemetrie(analyticId: number, telemetrie: string) {
    try {
      const res = await this.db.query.analytics_events.findMany(
        {
          where: and(
            eq(analytics_events.analyticsId, analyticId),
            eq(analytics_events.name, telemetrie)
          ),
          limit: 1,
          orderBy: [desc(analytics_events.id)]

        }
      );

      return res
    } catch (error) {
      console.error('Error fetching machines:', error);
      throw error;
    }
  }
  async getHistoricalData(data) {
    try {
      const { telemetries, machineId, from, to } = data
      const result: any[] = [];

      for (let i = 0; i < telemetries.length; i++) {
        const events = await this.db.query.analytics_events.findMany(
          {
            where: and(
              eq(analytics_events.analyticsId, +machineId),
              eq(analytics_events.name, telemetries[i].name),
              lt(analytics_events.created_at, new Date(to)),
              gt(analytics_events.created_at, new Date(from))
            )
          });


        const chartData: any[] =
          events.map((event) => {
            if (event.value) {
              if (event.created_at) {
                const dt = new Date(event.created_at).getFullYear()
                if (dt > 2000)
                  return {
                    x: moment(new Date(event.created_at)).format('YYYY-MM-DD hh:mm:ss a'),
                    y: event.value
                  }
                else {
                  return {
                    x: event.created_at,
                    y: event.value
                  }
                }
              }
              else {
                return {
                  x: event.created_at,
                  y: event.value
                }
              }
            }

          })
        chartData.sort((a, b) => +new Date(a.x) - +new Date(b.x));

        result.push({
          telemetrieName: telemetries[i].name,
          chartData: chartData
        });


      }
      return result;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
  async createAnalyticOutputEvent(data) {
    try {
      const res = await this.db.query.analytics.findFirst({
        where: (analytic, { eq }) => eq(analytics.id, +data.analyticId),
      })
      if (res) {
        console.log("emit", `analyticData/${res.serial}/${data.name}`)
        this.socketGatway.emitToAll(`analyticData/${res.serial}/${data.name}`, { succes: true })
      }
    } catch (error) {

    }
  }
  async createAnalyticOutput(data) {
    try {
      const res = await this.db.query.analytics.findFirst({
        where: (analytic, { eq }) => eq(analytics.serial, data.serial),
      })
      if (!res) {
        const newAnalyticData = {
          name: data.serial,
          serial: data.serial,
          tenantId: data.tenantId,
          outputs: data.name
        }
        const newAnalytic = await this.db.insert(analytics).values(newAnalyticData).returning();;

        console.log(newAnalytic, "newAnalytic");
        return 'Success';
      }
      if (!res.outputs?.includes(data.name)) {
        const newOutput = res.outputs ? res.outputs + ',' + data.name : data.name;
        await this.db.update(analytics).set({
          outputs: newOutput,
        }).where(eq(analytics.id, res.id)).execute();
        console.log("new output: ", newOutput)
      }
    } catch (error) {
      console.log(error)
      return 'Error';
    }
  }
  async createAnalyticEvent(data) {
    try {
      const res = await this.db.query.analytics.findFirst({
        where: (analytic, { eq }) => eq(analytics.serial, data.serial),
      })


      if (!res) {
        const newAnalyticData = {
          name: data.serial,
          serial: data.serial,
          tenantId: data.tenantId,
          telemetries: data.name
        }
        const newAnalytic = await this.db.insert(analytics).values(newAnalyticData).returning();;

        console.log(newAnalytic, "newAnalytic");

        await this.db.insert(analytics_events).values({
          analyticsId: newAnalytic[0].id,
          name: data.name,
          value: data.value,
          created_at: new Date()
        }).execute();

        this.socketGatway.emitToAll(`analyticData/${newAnalytic[0].id}/${data.name}`, {
          name: data.name,
          value: data.value
        })
        return 'Success';
      }
      if (!res.telemetries?.includes(data.name)) {
        const newTelemetries = res.telemetries ? res.telemetries + ',' + data.name : data.name;
        await this.db.update(analytics).set({
          telemetries: newTelemetries,
        }).where(eq(analytics.id, res.id)).execute();
        console.log("new telemetries: ", newTelemetries)
      }
      await this.db.insert(analytics_events).values({
        analyticsId: res.id,
        name: data.name,
        value: data.value,
        created_at: new Date()
      }).execute();
      this.socketGatway.emitToAll(`analyticData/${res.id}/${data.name}`, {
        name: data.name,
        value: data.value
      })

      return 'Success';
    } catch (error) {
      console.log(error)
      return 'Error';
    }
  }
}
