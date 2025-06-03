import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
@Injectable()
export class TenancyService {
    getDbConnection(tenantSlug: string) {
      throw new Error('Method not implemented.');
    }
    private tenantConnections: Map<string, NodePgDatabase<typeof schema>> = new Map();

    constructor(@Inject('DB_DEV') private db: NodePgDatabase<typeof schema>,) { }
    private createTenantConnection(tenantSlug: string): any {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            user: 'nextronic',
            password: 'nextronic',
            port: 5432,
        });
        const client = pool.connect();
        client.then((connection) => {
            connection.query(`SET search_path TO ${tenantSlug}`);
        });
        return drizzle(pool);
    }
    getDefaultConnection(): any {
        if (!this.tenantConnections.has('localhost')) {
            const connection = this.db
            this.tenantConnections.set('localhost', connection);
        }
        return this.tenantConnections.get('localhost');
    }

    getTenantConnection(tenantSlug: string): any {
        if (!this.tenantConnections.has('cloud')) {
            const connection = this.db
            this.tenantConnections.set('cloud', connection);
        }
        if (!this.tenantConnections.has(tenantSlug)) {
            const connection = this.createTenantConnection(tenantSlug);
            this.tenantConnections.set(tenantSlug, connection);
        }
        return this.tenantConnections.get(tenantSlug);
    }
 
}
