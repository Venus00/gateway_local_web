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
exports.ShellController = void 0;
const common_1 = require("@nestjs/common");
const shell_service_1 = require("./shell.service");
let ShellController = class ShellController {
    constructor(shellService) {
        this.shellService = shellService;
    }
    async execute(shellOrder) {
        return await this.shellService.execute(shellOrder);
    }
};
exports.ShellController = ShellController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShellController.prototype, "execute", null);
exports.ShellController = ShellController = __decorate([
    (0, common_1.Controller)('shell'),
    __metadata("design:paramtypes", [shell_service_1.ShellService])
], ShellController);
//# sourceMappingURL=shell.controller.js.map