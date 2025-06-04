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
exports.UserController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const users_dto_1 = require("./users.dto");
const auth_guards_1 = require("../common/guards/auth.guards");
const class_transformer_1 = require("class-transformer");
const roles_guard_1 = require("../common/guards/roles.guard");
const auth_service_1 = require("../auth/auth.service");
const tenant_service_1 = require("./tenant.service");
const users_service_1 = require("./users.service");
let UserController = class UserController {
    constructor(authService, tenantService, usersService) {
        this.authService = authService;
        this.tenantService = tenantService;
        this.usersService = usersService;
    }
    async handleGetAllUsers(query) {
        const users = await this.usersService.getUsers(query.tenantId);
        return (0, class_transformer_1.plainToInstance)(users_dto_1.UserResponseDto, users);
    }
    async handleUpdateUser(req, data) {
        if (!data.email)
            throw new common_1.BadRequestException('Email is required');
        const exists = await this.usersService.getUserByEmail(data.email);
        if (!exists)
            throw new common_1.BadRequestException('Email is not registered');
        if (!data.password)
            throw new common_1.BadRequestException('Password not set');
        const hashedPassword = await this.authService.generatePassword(data.password);
        if (!hashedPassword)
            throw new common_1.BadRequestException('Problem with credential hashing');
        const user = await this.usersService.updatePassword(data.email, hashedPassword);
        return (0, class_transformer_1.plainToInstance)(users_dto_1.UserResponseDto, user);
    }
    async handleUpdateUserInfo(req, data) {
        if (!data.email)
            throw new common_1.BadRequestException('Email is required');
        const exists = await this.usersService.getUserByEmail(data.email);
        if (!exists)
            throw new common_1.BadRequestException('Email is not registered');
        const userData = await this.usersService.findUserById(data.id);
        if (userData) {
            let pass = userData.password;
            if (data.password) {
                const hashedPassword = await this.authService.generatePassword(data.password);
                if (!hashedPassword)
                    throw new common_1.BadRequestException('Problem with credential hashing');
                pass = hashedPassword;
                const dataUser = { ...data, password: pass };
                const user = await this.usersService.updateUserInfo(dataUser);
                return (0, class_transformer_1.plainToInstance)(users_dto_1.UserResponseDto, user);
            }
        }
    }
    async handleCreateUser(data) {
        if (!data.email)
            throw new common_1.BadRequestException('Email is required');
        if (!data.tenantName)
            throw new common_1.BadRequestException('tenantName is required');
        const tenantExists = await this.tenantService.getTenantByName(data.tenantName);
        if (tenantExists)
            throw new common_1.BadRequestException('Workspace name already in use');
        const user = await this.usersService.createUser(data);
        return (0, class_transformer_1.plainToInstance)(users_dto_1.UserResponseDto, user);
    }
    async handleCreateNewUser(data) {
        if (!data.email)
            throw new common_1.BadRequestException('Email is required');
        if (!data.tenantName)
            throw new common_1.BadRequestException('tenantName is required');
        const tenantExists = await this.tenantService.getTenantByName(data.tenantName);
        if (!tenantExists)
            throw new common_1.BadRequestException('Workspace does not exist');
        return await this.usersService.createNewUser(data);
    }
    async handleDeleteUser(req, id) {
        const exists = await this.usersService.getUserById(id);
        if (!exists)
            throw new common_1.BadRequestException('User does not exist');
        const user = await this.usersService.deleteUser(id);
        return (0, class_transformer_1.plainToInstance)(users_dto_1.UserResponseDto, user);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./users.dto").UserResponseDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "handleGetAllUsers", null);
__decorate([
    (0, common_1.Put)(),
    openapi.ApiResponse({ status: 200, type: require("./users.dto").UserResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, users_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "handleUpdateUser", null);
__decorate([
    (0, common_1.Put)("/update"),
    openapi.ApiResponse({ status: 200, type: require("./users.dto").UserResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "handleUpdateUserInfo", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: require("./users.dto").UserResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "handleCreateUser", null);
__decorate([
    (0, common_1.Post)("/newUser"),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "handleCreateNewUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./users.dto").UserResponseDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "handleDeleteUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(auth_guards_1.AccessTokenGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        tenant_service_1.TenantService,
        users_service_1.UsersService])
], UserController);
//# sourceMappingURL=users.controller.js.map