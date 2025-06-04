"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_guards_1 = require("../common/guards/auth.guards");
const role_enum_1 = require("../common/guards/role.enum");
const roles_guard_1 = require("../common/guards/roles.guard");
const workflow_service_1 = require("./workflow.service");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
let WorkflowController = class WorkflowController {
    constructor(workflow) {
        this.workflow = workflow;
        this.DB_PATH = path_1.default.join(process.cwd(), './flows/db.json');
        this.comonents = [];
        fs.readFile(this.DB_PATH, (err, json) => {
            let obj = JSON.parse(json.toString().replaceAll('server.url', process.env.SERVER_PRIMARY_DNS || ''));
            this.comonents = obj;
        });
    }
    async createWorkflow(data) {
        console.log('create workflow : ', JSON.stringify(data));
        try {
            return await this.workflow.createWorkflow(data);
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException('Bad Request', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    serveflowcomponents() {
        try {
            console.log("yes here");
            return this.comonents;
        }
        catch (error) {
            throw new common_1.HttpException('Bad Request', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async find(query) {
        const workflows = await this.workflow.findWorkflow(query.tenantId);
        return workflows;
    }
    async findWorkflowId(workflow_id) {
        try {
            const workflow = await this.workflow.findWorkflowById(Number(workflow_id));
            return workflow;
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException('Bad Request', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(data) {
        return await this.workflow.updateworkflow(data);
    }
    async deleteWorkflow(id) {
        const workflowId = parseInt(id, 10);
        if (isNaN(workflowId)) {
            throw new common_1.HttpException('Invalid workflow ID', common_1.HttpStatus.BAD_REQUEST);
        }
        console.log('delete workflow id: ', workflowId);
        try {
            return await this.workflow.deleteWorkflow(workflowId);
        }
        catch (error) {
            console.log(error);
            throw new common_1.HttpException('Bad Request', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.WorkflowController = WorkflowController;
__decorate([
    (0, common_1.Post)(''),
    (0, roles_guard_1.Roles)(role_enum_1.Role.Admin),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "createWorkflow", null);
__decorate([
    (0, common_1.Get)('flowscomponents'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WorkflowController.prototype, "serveflowcomponents", null);
__decorate([
    (0, common_1.Get)(''),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "find", null);
__decorate([
    (0, common_1.Get)('workflow/:workflow_id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('workflow_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "findWorkflowId", null);
__decorate([
    (0, common_1.Put)(''),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_guard_1.Roles)(role_enum_1.Role.Admin),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkflowController.prototype, "deleteWorkflow", null);
exports.WorkflowController = WorkflowController = __decorate([
    (0, common_1.Controller)('workflow'),
    (0, common_1.UseGuards)(auth_guards_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [workflow_service_1.WorkflowService])
], WorkflowController);
//# sourceMappingURL=workflow.controller.js.map