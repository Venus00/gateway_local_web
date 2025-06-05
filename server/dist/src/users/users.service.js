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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const schema = __importStar(require("../../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../db/schema");
const uuid_1 = require("uuid");
const validationEmail_1 = require("../common/template-mail/validationEmail");
const hash_1 = require("../common/utils/hash");
const config_1 = require("@nestjs/config");
let UsersService = UsersService_1 = class UsersService {
    constructor(configService, db) {
        this.configService = configService;
        this.db = db;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async createUser(data) {
        return await this.db.insert(schema_1.users).values({
            ...data,
        }).returning()
            .then((res) => res[0] ?? null);
    }
    async createNewUser(data) {
        const hashedPassword = await (0, hash_1.hashGenerate)(data.password, this.configService.get('APP_SECRET') || '');
        const user = await this.db.insert(schema_1.users).values({
            ...data,
            password: hashedPassword,
        })
            .returning()
            .then((res) => res[0] ?? null);
        const token = (0, uuid_1.v4)();
        const userVerification = await this.createUserVerification(token, user.id);
        const html = validationEmail_1.validationEmail.replaceAll('[Activation Link]', `${process.env.SERVER_PRIMARY_DNS}/api/v1/auth/verify?token=${token}`);
    }
    async updatePassword(email, password) {
        return await this.db.update(schema_1.users).set({
            password,
        }).where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
            .returning();
    }
    async createUserVerification(token, userId) {
        return await this.db.insert(schema_1.userVerification).values({
            token,
            userId,
        }).returning()
            .then((res) => res[0] ?? null);
    }
    async storeResetToken(userId, token, expiresAt) {
        return await this.db.insert(schema.resetPasswordToken).values({
            token,
            userId,
            expiresAt,
        }).returning()
            .then((res) => res[0] ?? null);
    }
    async findUserById(userId) {
        return await this.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, userId),
        });
    }
    async markAsVerified(userId) {
        return await this.db.update(schema_1.users).set({
            isVerified: true,
        }).where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
    }
    async findByToken(token) {
        return await this.db.query.userVerification.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.userVerification.token, token),
        });
    }
    async findByResetToken(token) {
        return await this.db.query.resetPasswordToken.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.resetPasswordToken.token, token), with: {
                users: true
            }
        });
    }
    async findResetToken(token) {
        return await this.db.query.resetPasswordToken.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.resetPasswordToken.token, token),
        });
    }
    async updatePasswordToken(token) {
        return await this.db.update(schema_1.resetPasswordToken).set({
            used: true
        }).where((0, drizzle_orm_1.eq)(schema_1.resetPasswordToken.token, token));
    }
    async IsVerified(userId) {
        return await this.db.query.userVerification.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.userVerification.userId, userId),
        });
    }
    async updateUser(id, data) {
        return this.db.update(schema_1.users).set({
            ...data
        }).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
    }
    async updateUserInfo(data) {
        return this.db.update(schema_1.users).set({
            ...data
        }).where((0, drizzle_orm_1.eq)(schema_1.users.id, data.id));
    }
    async getUserByEmail(email) {
        const result = this.db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
            with: {
                tenant: {
                    with: {
                        licence: true
                    }
                }
            }
        });
        return result;
    }
    async getUserById(id) {
        return this.db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, id),
        });
    }
    async getUsers(tenantId) {
        return this.db.query.users.findMany({
            where: (0, drizzle_orm_1.eq)(schema_1.users.tenantId, tenantId)
        });
    }
    async deleteUser(id) {
        return this.db.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('DB_DEV')),
    __metadata("design:paramtypes", [config_1.ConfigService,
        node_postgres_1.NodePgDatabase])
], UsersService);
//# sourceMappingURL=users.service.js.map