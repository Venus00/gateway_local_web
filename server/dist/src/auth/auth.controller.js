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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const decorators_1 = require("../common/decorators");
const auth_dto_1 = require("./auth.dto");
const auth_service_1 = require("./auth.service");
const auth_guards_1 = require("../common/guards/auth.guards");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async handleMeRequest(userId, req) {
        const tenantSlug = req['tenantSlug'];
        const user = await this.authService.getLoggedInUser(userId);
        return (0, class_transformer_1.plainToClass)(auth_dto_1.GetLoggedInUserResponseDto, user);
    }
    async handleLoginRequest(data, req) {
        const tenantSlug = req['tenantSlug'];
        return this.authService.loginUser(data);
    }
    async updateTenantToken(data) {
        return this.authService.updateTenantToken(data);
    }
    async verifyUser(token, req, res) {
        if (!token) {
            throw new common_1.BadRequestException('Token is required');
        }
        console.log("verify");
        const tenantSlug = req['tenantSlug'];
        console.log(tenantSlug);
        const result = await this.authService.verifyEmail(token);
        if (!result) {
            throw new common_1.NotFoundException('Invalid or expired token');
        }
        return res.redirect(process.env.SERVER_PRIMARY_DNS);
    }
    async verifyUserAdmin(id, req, res) {
        console.log("verify");
        const tenantSlug = req['tenantSlug'];
        console.log(tenantSlug);
        const result = await this.authService.verifyEmailByGAdmin(id);
        if (!result) {
            throw new common_1.NotFoundException('Invalid User');
        }
        return true;
    }
    async forgetPassword(data, req, res) {
        console.log("forgetPassword");
        const tenantSlug = req['tenantSlug'];
        return await this.authService.forgetPassword(data);
    }
    async resetPassword(data, req, res) {
        const tenantSlug = req['tenantSlug'];
        const result = await this.authService.resetPassword(data);
        if (!result) {
            return res.redirect(process.env.FORGOT_PASSWORD_URL);
        }
        return res.redirect(process.env.FORGOT_PASSWORD_URL);
    }
    async handleRegisterRequest(data, req) {
        const tenantSlug = req['tenantSlug'];
        return this.authService.registerUser(data);
    }
    async handleLogoutRequest(userId, req) {
        const tenantSlug = req['tenantSlug'];
        await this.authService.logoutUser(userId);
        return true;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(auth_guards_1.AccessTokenGuard),
    __param(0, (0, decorators_1.GetUser)('sub')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleMeRequest", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginUserRequestDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleLoginRequest", null);
__decorate([
    (0, common_1.Post)('updateToken'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateTenantToken", null);
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyUser", null);
__decorate([
    (0, common_1.Post)('verifyUser/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyUserAdmin", null);
__decorate([
    (0, common_1.Post)('forgotPassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgetPassword", null);
__decorate([
    (0, common_1.Post)('resetPassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterUserRequestDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleRegisterRequest", null);
__decorate([
    (0, common_1.UseGuards)(auth_guards_1.AccessTokenGuard),
    (0, common_1.Delete)('logout'),
    __param(0, (0, decorators_1.GetUser)('sub')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handleLogoutRequest", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map