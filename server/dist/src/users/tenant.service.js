"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TenantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
const pg_1 = require("pg");
const node_postgres_2 = require("drizzle-orm/node-postgres");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
async function withTenantDb(tenantSchema, callback) {
    const client = await pool.connect();
    try {
        await client.query(`SET search_path TO "${tenantSchema}", public`);
        const db = (0, node_postgres_2.drizzle)(client);
        return await callback(db);
    }
    finally {
        client.release();
    }
}
let TenantService = TenantService_1 = class TenantService {
    constructor(db) {
        this.db = db;
        this.logger = new common_1.Logger(TenantService_1.name);
    }
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
    async deleteGlobalDashboard(id) {
        try {
            await this.db.update(schema_1.tenant).set({
                layout: "",
                widget: "",
            }).where((0, drizzle_orm_1.eq)(schema_1.tenant.id, id)).execute();
            return 'Success';
        }
        catch (error) {
            return 'Error';
        }
    }
    async createTenant(data, tenantSlug) {
        const tenantRes = await this.db
            .insert(schema_1.tenant)
            .values({
            ...data,
            adminId: data.adminId ? +data.adminId : undefined,
        })
            .returning()
            .then((res) => res[0] ?? null);
        return tenantRes;
    }
    async updateTenant({ id, ...data }) {
        return this.db
            .update(schema_1.tenant)
            .set({
            ...data,
            adminId: data.adminId ? +data.adminId : 0
        })
            .where((0, drizzle_orm_1.eq)(schema_1.tenant.id, id || 0));
    }
    async setLayoutWidget(tenantId, data) {
        return await this.db
            .update(schema_1.tenant)
            .set({
            ...data,
        })
            .where((0, drizzle_orm_1.eq)(schema_1.tenant.id, tenantId));
    }
    async getTenantByName(name) {
        return this.db.query.tenant.findFirst({
            where: (tenant, { eq }) => eq(tenant.name, name),
        });
    }
    async getTenantById(id) {
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
        }
        catch (error) {
            throw new common_1.ForbiddenException('Access denied: No permissions found');
        }
    }
    async deleteTenant(id, tenantSlug) {
        return this.db.delete(schema_1.tenant).where((0, drizzle_orm_1.eq)(schema_1.tenant.id, id));
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = TenantService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DB_DEV')),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase])
], TenantService);
//# sourceMappingURL=tenant.service.js.map