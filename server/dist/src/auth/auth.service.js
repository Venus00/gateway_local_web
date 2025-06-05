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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const validationEmail_1 = require("../common/template-mail/validationEmail");
const hash_1 = require("../common/utils/hash");
const auth_dto_1 = require("./auth.dto");
const class_transformer_1 = require("class-transformer");
const users_service_1 = require("../users/users.service");
const tenant_service_1 = require("../users/tenant.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
let AuthService = AuthService_1 = class AuthService {
    constructor(userService, tenantService, jwtService, configService) {
        this.userService = userService;
        this.tenantService = tenantService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async getLoggedInUser(userId) {
        return this.userService.getUserById(userId);
    }
    async loginUser(data) {
        if (!data.email || !data.password)
            throw new common_1.BadRequestException('Email or password not provided');
        const user = await this.userService.getUserByEmail(data.email);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid Credentials');
        if (!user.password || !user.email)
            throw new common_1.UnauthorizedException('Invalid Credentials');
        const validPassword = await (0, hash_1.hashCompare)(data.password, user.password, this.configService.get('APP_SECRET') || '');
        if (!validPassword)
            throw new common_1.UnauthorizedException('Invalid Credentials');
        if (user?.isVerified) {
            const tokens = await this.getTokens({
                sub: user.id,
                email: user.email,
                tenantId: user.tenantId,
                role: user.role,
                permissions: [],
            });
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            return {
                ...(0, class_transformer_1.plainToClass)(auth_dto_1.GetLoggedInUserResponseDto, user),
                ...tokens,
            };
        }
        throw new common_1.UnauthorizedException('Account Still Not Verified');
    }
    async verifyEmail(token) {
        const user = await this.userService.findByToken(token);
        if (!user?.userId)
            throw new Error('Invalid token');
        const userRow = await this.userService.findUserById(user.userId);
        if (!userRow)
            throw new Error('Invalid User');
        if (userRow.isVerified) {
            throw new Error('Already Verified');
        }
        else {
            await this.userService.markAsVerified(userRow.id);
            return 'Email verified successfully';
        }
    }
    async verifyEmailByGAdmin(id) {
        const userRow = await this.userService.findUserById(id);
        if (!userRow)
            throw new Error('Invalid User');
        if (userRow.isVerified) {
            throw new Error('Already Verified');
        }
        else {
            const verifiedUser = await this.userService.markAsVerified(userRow.id);
            if (verifiedUser) {
                console.log(verifiedUser, 'verifiedUser');
            }
            return true;
        }
    }
    async forgetPassword(data) {
        const userRow = await this.userService.getUserByEmail(data.email);
        if (!userRow)
            throw new Error('Invalid User');
        const resetToken = await this.generatePasswordResetToken(userRow.id);
    }
    async generatePasswordResetToken(userId) {
        const token = (0, uuid_1.v4)();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await this.userService.storeResetToken(userId, token, expiresAt);
        return token;
    }
    async generatePassword(password) {
        return await (0, hash_1.hashGenerate)(password, this.configService.get('APP_SECRET') || '');
    }
    async registerUser(data) {
        if (!data.email || !data.password || !data.tenantName)
            throw new common_1.BadRequestException('Email, password or workspace name not provided');
        const userExists = await this.userService.getUserByEmail(data.email);
        if (userExists)
            throw new common_1.BadRequestException('Email already exists');
        const tenantexists = await this.tenantService.getTenantByName(data.tenantName);
        if (tenantexists)
            throw new common_1.BadRequestException('Workspace name already in use');
        if (data.email === '')
            throw new common_1.BadRequestException('Invalid email format');
        const hashedPassword = await (0, hash_1.hashGenerate)(data.password, this.configService.get('APP_SECRET') || '');
        let newUser;
        newUser = await this.userService.createUser({
            ...data,
            password: hashedPassword,
            tenantId: data.tenantId,
            role: 'user',
        });
        const token = (0, uuid_1.v4)();
        const userVerification = await this.userService.createUserVerification(token, newUser.id);
        const html = validationEmail_1.validationEmail.replaceAll('[Activation Link]', `${process.env.SERVER_PRIMARY_DNS}/api/v1/auth/verify?token=${token}`);
        return newUser;
    }
    async resetPassword(data) {
        if (!data.password || !data.token)
            throw new common_1.BadRequestException('password or token not provided');
        const token = await this.userService.findResetToken(data.token);
        if (token?.used) {
            throw new common_1.BadRequestException('token already used');
        }
        if (this.isTokenExpired(token?.expiresAt || '')) {
            throw new common_1.BadRequestException('Token has expired');
        }
        const userToken = await this.userService.findByResetToken(data.token);
        if (!userToken?.userId)
            throw new Error('Invalid token');
        const user = await this.userService.getUserById(userToken?.userId);
        const hashedPassword = await (0, hash_1.hashGenerate)(data.password, this.configService.get('APP_SECRET') || '');
        const updatedUser = await this.userService.updatePassword(user?.email, hashedPassword);
        if (updatedUser) {
            await this.userService.updatePasswordToken(data.token);
            return true;
        }
        return false;
    }
    isTokenExpired(expiresAt) {
        if (!expiresAt)
            return true;
        const expiryDate = new Date(expiresAt);
        const now = new Date();
        return now > expiryDate;
    }
    async logoutUser(userId) {
        return this.userService.updateUser(userId, { refreshToken: undefined });
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.userService.getUserById(userId);
        if (!user || !user.refreshToken)
            throw new common_1.ForbiddenException('Access Denied');
        const refreshTokenMatches = await (0, hash_1.hashCompare)(user.refreshToken, refreshToken, this.configService.get('APP_SECRET') || '');
        if (!refreshTokenMatches)
            throw new common_1.ForbiddenException('Access Denied');
        if (!user.email)
            throw new common_1.BadRequestException('User not found');
        const tokens = await this.getTokens({
            tenantId: user.tenantId,
            sub: user.id,
            email: user.email,
            role: user.role,
            permissions: [],
        });
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async getTokens(payload) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: '7d',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await (0, hash_1.hashGenerate)(refreshToken, this.configService.get('APP_SECRET') || '');
        await this.userService.updateUser(userId, {
            refreshToken: hashedRefreshToken,
        });
    }
    async updateTenantToken(token) {
        return await this.getTokens(token);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        tenant_service_1.TenantService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map