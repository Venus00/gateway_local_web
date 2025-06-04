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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const nestjs_drizzle_pg_1 = require("@knaadh/nestjs-drizzle-pg");
const schema = __importStar(require("../db/schema"));
const socket_module_1 = require("./socket/socket.module");
const workflow_module_1 = require("./workflow/workflow.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', '..', 'flows/components'),
                serveRoot: '/components',
            }, {
                rootPath: (0, path_1.join)(__dirname, '..', '..', 'front'),
                exclude: ['/components*'],
            }),
            nestjs_drizzle_pg_1.DrizzlePGModule.register({
                tag: "DB_DEV",
                pg: {
                    connection: 'pool',
                    config: {
                        connectionString: process.env.DATABASE_URL
                    }
                },
                config: {
                    schema: { ...schema }
                }
            }),
            event_emitter_1.EventEmitterModule.forRoot(),
            config_1.ConfigModule.forRoot(),
            socket_module_1.SocketModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            workflow_module_1.WorkflowModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
;
//# sourceMappingURL=app.module.js.map