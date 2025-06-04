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
var ShellService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShellService = void 0;
const common_1 = require("@nestjs/common");
const api_client_1 = require("./api.client");
let ShellService = ShellService_1 = class ShellService {
    constructor() {
        this.logger = new common_1.Logger(ShellService_1.name);
    }
    async execute(order) {
        this.logger.log(order);
        const data = {
            command: order.command,
        };
        this.logger.log(`http://${order.host}:3002/api/v1/shell`);
        try {
            return (await api_client_1.apiClient.post(`http://${order.host}:3002/api/v1/shell`, data)).data;
        }
        catch (error) {
            this.logger.error(error);
        }
    }
};
exports.ShellService = ShellService;
exports.ShellService = ShellService = ShellService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ShellService);
//# sourceMappingURL=shell.service.js.map