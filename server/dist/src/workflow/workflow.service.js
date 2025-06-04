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
var WorkflowService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowService = void 0;
const common_1 = require("@nestjs/common");
const drizzle_orm_1 = require("drizzle-orm");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema_1 = require("../../db/schema");
const api_client_1 = require("./api.client");
let WorkflowService = WorkflowService_1 = class WorkflowService {
    constructor(db) {
        this.db = db;
        this.logger = new common_1.Logger(WorkflowService_1.name);
    }
    async onModuleInit() { }
    async deleteWorkflow(workflowId) {
        const existingWorkflow = await this.db
            .select()
            .from(schema_1.workflow)
            .where((0, drizzle_orm_1.eq)(schema_1.workflow.id, workflowId))
            .limit(1);
        if (existingWorkflow.length === 0) {
            throw new common_1.HttpException('Workflow not found', common_1.HttpStatus.NOT_FOUND);
        }
        await this.db
            .delete(schema_1.workflow)
            .where((0, drizzle_orm_1.eq)(schema_1.workflow.id, workflowId));
        return {
            message: 'Workflow deleted successfully',
            id: workflowId
        };
    }
    async pushFlowtoServer(data) {
        try {
            console.log("create", data);
            const result = await api_client_1.apiClient.post('/api', data);
            console.log(result.data);
            return result.data;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async createWorkflow(payload) {
        const { tenantId, data } = payload;
        const [flow] = await this.db.insert(schema_1.workflow).values({
            tenantId,
            ...data
        }).returning({ id: schema_1.workflow.tenantId });
        return await this.pushFlowtoServer({
            ...payload,
            data: {
                ...payload.data,
                url: flow.id
            }
        });
    }
    async updateworkflow(data) {
        try {
            if (data.name) {
                await this.db.update(schema_1.workflow).set(data).where((0, drizzle_orm_1.eq)(schema_1.workflow.id, data.id));
            }
            else {
                throw new Error('Workflow type name is required');
            }
            return 'Success';
        }
        catch (error) {
            throw error;
        }
    }
    async findWorkflowById(id) {
        return await this.db.query.workflow.findFirst({
            where: (workflow, { eq }) => eq(workflow.id, id),
        });
    }
    async getWorkflows(tenantId) {
        try {
            const result = await api_client_1.apiClient.post('/api', {
                schema: "streams"
            });
            console.log(result.data);
            return await result.data.filter(item => item.url === tenantId);
        }
        catch (error) {
            throw error;
        }
    }
    async findWorkflow(tenantId) {
        try {
            return await this.getWorkflows(tenantId);
        }
        catch (error) {
            console.error('Error fetching workflows:', error);
            throw error;
        }
    }
};
exports.WorkflowService = WorkflowService;
exports.WorkflowService = WorkflowService = WorkflowService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DB_DEV')),
    __metadata("design:paramtypes", [node_postgres_1.NodePgDatabase])
], WorkflowService);
//# sourceMappingURL=workflow.service.js.map