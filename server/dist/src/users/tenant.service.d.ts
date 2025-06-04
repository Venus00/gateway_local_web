import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { CreateTenantDto, EditTenantDto } from './tenant.dto';
export declare class TenantService {
    private readonly db;
    private logger;
    constructor(db: NodePgDatabase<typeof schema>);
    getTenants(): Promise<{
        [x: string]: any;
    }[]>;
    deleteGlobalDashboard(id: number): Promise<"Success" | "Error">;
    createTenant(data: CreateTenantDto, tenantSlug: any): Promise<any>;
    updateTenant({ id, ...data }: Partial<EditTenantDto>): Promise<import("pg").QueryResult<never>>;
    setLayoutWidget(tenantId: number, data: {
        widget: string;
        layout: string;
    }): Promise<import("pg").QueryResult<never>>;
    getTenantByName(name: string): Promise<{
        [x: string]: any;
    } | undefined>;
    getTenantById(id: number): Promise<{
        [x: string]: any;
    } | undefined>;
    deleteTenant(id: number, tenantSlug: string): Promise<import("pg").QueryResult<never>>;
}
