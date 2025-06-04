/* eslint-disable prettier/prettier */
import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { tenant } from '../../db/schema';
import { CreateTenantDto, EditTenantDto } from './tenant.dto';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
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
    @Inject('DB_DEV') private readonly db: NodePgDatabase<typeof schema>,
  ) { }

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




  async createTenant(data: CreateTenantDto, tenantSlug) {



    const tenantRes = await this.db
      .insert(tenant)
      .values({
        ...data,
        adminId: data.adminId ? +data.adminId : undefined,
      })
      .returning()
      .then((res) => res[0] ?? null);
    return tenantRes
  }


  async updateTenant({ id, ...data }: Partial<EditTenantDto>) {
    return this.db
      .update(tenant)
      .set({
        ...data,
        adminId: data.adminId ? +data.adminId : 0
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
            subscriptionPlan: true
          },
          brokers: true,
          admin: true
        },
      });
    } catch (error) {
      throw new ForbiddenException('Access denied: No permissions found');

    }
  }
  async deleteTenant(id: number, tenantSlug: string) {

    return this.db.delete(tenant).where(eq(tenant.id, id));
  }
}
