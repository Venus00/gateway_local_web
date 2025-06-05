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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantController = void 0;
const common_1 = require("@nestjs/common");
const auth_guards_1 = require("../common/guards/auth.guards");
const class_transformer_1 = require("class-transformer");
const tenant_service_1 = require("./tenant.service");
const tenant_dto_1 = require("./tenant.dto");
const role_enum_1 = require("../common/guards/role.enum");
const roles_guard_1 = require("../common/guards/roles.guard");
const users_dto_1 = require("./users.dto");
let TenantController = class TenantController {
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    async handleGetAllTenant() {
        const tenants = await this.tenantService.getTenants();
        return (0, class_transformer_1.plainToInstance)(tenant_dto_1.TenantReponseDto, tenants);
    }
    async handleGetLayout(query) {
        console.log("tenantId", query.tenantId);
        const result = await this.tenantService.getTenantById(query.tenantId);
        return result;
    }
    async deleteDashboard(id) {
        return await this.tenantService.deleteGlobalDashboard(id);
    }
    async handleSetLayout(data) {
        const { widget, layout, tenantId } = data;
        return await this.tenantService.setLayoutWidget(tenantId, {
            widget,
            layout,
        });
    }
    async handleCreateTenant(data, req) {
        const tenantSlug = req['tenantSlug'];
        return await this.tenantService.createTenant(data, tenantSlug);
    }
    async handleUpdateTenant(data) {
        return await this.tenantService.updateTenant(data);
    }
    async handleDeleteUser(req, id) {
        const slug = req['tenantSlug'];
        if (!slug)
            throw new common_1.BadRequestException('Tenant DB connection not found');
        const exists = await this.tenantService.getTenantById(id);
        if (!exists)
            throw new common_1.BadRequestException('Tenant does not exist');
        const user = await this.tenantService.deleteTenant(id, slug);
        return (0, class_transformer_1.plainToInstance)(users_dto_1.UserResponseDto, user);
    }
};
exports.TenantController = TenantController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_guard_1.Roles)(role_enum_1.Role.GAdmin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "handleGetAllTenant", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "handleGetLayout", null);
__decorate([
    (0, common_1.Delete)('dashboard/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "deleteDashboard", null);
__decorate([
    (0, common_1.Put)('dashboard'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "handleSetLayout", null);
__decorate([
    (0, roles_guard_1.Roles)(role_enum_1.Role.GAdmin),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "handleCreateTenant", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "handleUpdateTenant", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Number]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "handleDeleteUser", null);
exports.TenantController = TenantController = __decorate([
    (0, common_1.Controller)('tenant'),
    (0, common_1.UseGuards)(auth_guards_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], TenantController);
//# sourceMappingURL=tenant.controller.js.map