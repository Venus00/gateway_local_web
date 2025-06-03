/* eslint-disable prettier/prettier */
import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { tenant, users,subscriptionPlan,licence  } from '../../db/schema';
import { CreateTenantDto, EditTenantDto } from './tenant.dto';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { TenancyService } from 'src/tenancy/tenancy.service';
import { BrokerService } from 'src/broker/broker.service';
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function withTenantDb<T>(
  tenantSchema: string,
  callback: (db: ReturnType<typeof drizzle>) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    // Sanitize the schema name to prevent SQL injection
    await client.query(`SET search_path TO "${tenantSchema}", public`);
    const db = drizzle(client);
    
    return await callback(db);
  } finally {
    client.release();
  }
}

@Injectable()
export class TenantService {
  private logger = new Logger(TenantService.name);

  constructor(
    private brokerService:BrokerService,
    private tenancy:TenancyService,
    @Inject('DB_DEV') private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getTenants() {
    return this.db.query.tenant.findMany({
      with: {
        users: true,
        licence: {
          include: {
            subscriptionPlan: true,
          }
        }
      }
    });
  }
   async deleteGlobalDashboard(id: number) {
      try {
        await this.db.update(tenant).set({
          layout: "",
          widget: "",
        }).where(eq(tenant.id, id)).execute();
        return 'Success';
      } catch (error) {
        return 'Error';
      }
    }
  async getSubcsriptionPlans() {
    return this.db.query.subscriptionPlan.findMany();
  }

  async getSubcsriptionPlansByID(id:number) {
    return this.db.query.subscriptionPlan.findFirst({
      where:eq(subscriptionPlan.id,id)
    });
  }

  
  async createTenant(data: CreateTenantDto,tenantSlug) {

    const freePlan = await this.db.query.subscriptionPlan.findFirst({
      where:eq(subscriptionPlan.name,"FREE"),
    })
    if(freePlan){
      const licenceItem = await this.db.insert(licence).values({
        name:freePlan?.name,
        subscriptionPlanId:freePlan.id,
        sessionId:''
      }).returning()
      .then((res) => res[0] ?? null);
      const tenantRes = await this.db
        .insert(tenant)
        .values({
          ...data,
          licenceId:licenceItem.id,
          adminId: data.adminId ? +data.adminId : undefined,
        })
        .returning()
        .then((res) => res[0] ?? null);

      await this.brokerService.addBroker({
          tenantId: +tenant?.id,
          clientId: `local_broker_${tenant?.id}`,
          topic: 'nxt/devices/+/data',
          ip: process.env.BROKER_URL || '154.144.229.22',
          port: 1883,
          name: `local_broker_${tenant?.id}`,
          host: process.env.BROKER_URL || '154.144.229.22',
          username: process.env.MQTT_WORKER_USERNAME || 'digisense_worker',
          password: process.env.MQTT_WORKER_PASSWORD || 'digisense_worker',
          hide: true,
        }, tenantSlug)
        // const schema = `tenant_${data.name.replace(/[^a-z0-9_]/gi, '_')}`
          // const client = await pool.connect();
        // try {
        //   await client.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
        //   const tablesResult = await this.db.execute(
        //     sql.raw(`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`)
        //   );
        //   const tableNames = tablesResult.rows.map(row => row.tablename);
        //   for (const table of tableNames) {
        //     const query = ` 
        //       CREATE TABLE IF NOT EXISTS "${schema}"."${table}"
        //       (LIKE public."${table}" INCLUDING ALL)
        //     `;
        //     await this.db.execute(sql.raw(query));
        //   }
        // } finally {
        //   client.release();
        // }
      //   const user = await this.db.query.users.findFirst({
      //     where:eq(users.id,data.adminId),
      //   })
      //   if(user)
      //   {
      //     console.log(user);
          
      //     await withTenantDb(schema, async (tenantDb) => {
      //     const res = await tenantDb.insert(users).values({email:user.email,password:user.password});
      //     console.log(res);
      //   });
      // }
       
        return tenantRes
    } else {
      console.log("error plan is not loaded")
    }
   
  }
  async createUserTenant(data: { name: string }) {
    const freePlan = await this.db.query.subscriptionPlan.findFirst({
      where:eq(subscriptionPlan.name,"FREE"),
    })
    if(freePlan)
    {
      const licenceItem = await this.db.insert(licence).values({
        name:freePlan?.name,
        subscriptionPlanId:freePlan.id,
        sessionId:''
      }).returning()
      .then((res) => res[0] ?? null);
      return await this.db
        .insert(tenant)
        .values({
          ...data,
          licenceId:licenceItem.id,
        })
        .returning()
        .then((res) => res[0] ?? null);
    }
    else {
      console.log("error plan is not loaded")
    }
   
  }

  async updateTenant({ id, ...data }: Partial<EditTenantDto>) {
    return this.db
      .update(tenant)
      .set({
        ...data,
        adminId:data.adminId ?+data.adminId :0
      })
      .where(eq(tenant.id, id || 0));
  }

  async setLayoutWidget(
    tenantId: number,
    data: { widget: string; layout: string },
  ) {
    return await this.db
      .update(tenant)
      .set({
        ...data,
      })
      .where(eq(tenant.id, tenantId));
  }

  async getTenantByName(name: string) {
    return this.db.query.tenant.findFirst({
      where: (tenant, { eq }) => eq(tenant.name, name),
    });
  }

  async getTenantById(id: number) {
    try {
      return this.db.query.tenant.findFirst({
        where: (tenant, { eq }) => eq(tenant.id, id),
        with: {  
          users: true,
          licence: {
          subscriptionPlan:true
        },
        brokers: true,
        admin:true },
      });
    } catch (error) {
      throw new ForbiddenException('Access denied: No permissions found');

    }
  }
  async getDbConnection(slug:string){ 
    return await this.tenancy.getTenantConnection(slug);
  }
  async deleteTenant(id: number,tenantSlug:string) {
      const dbConnection = await this.getDbConnection(tenantSlug)
      
      return dbConnection.delete(tenant).where(eq(tenant.id,id));
    }
}
