"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const tenant_service_1 = require("./tenant.service");
const tenant_controller_1 = require("./tenant.controller");
const config_1 = require("@nestjs/config");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        providers: [users_service_1.UsersService, tenant_service_1.TenantService, config_1.ConfigService],
        controllers: [users_controller_1.UserController, tenant_controller_1.TenantController],
        exports: [users_service_1.UsersService, tenant_service_1.TenantService]
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map