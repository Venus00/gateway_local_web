"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenExpiredFilter = void 0;
const common_1 = require("@nestjs/common");
let TokenExpiredFilter = class TokenExpiredFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse = exception.getResponse();
        if (typeof exceptionResponse === 'object' &&
            exceptionResponse.message === 'Unauthorized') {
            return response.status(common_1.HttpStatus.UNAUTHORIZED).json({
                statusCode: common_1.HttpStatus.UNAUTHORIZED,
                message: 'Token expired',
                path: request.url,
            });
        }
        response.status(status).json({
            statusCode: status,
            message: exceptionResponse.message || 'Unexpected error',
            path: request.url,
        });
    }
};
exports.TokenExpiredFilter = TokenExpiredFilter;
exports.TokenExpiredFilter = TokenExpiredFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], TokenExpiredFilter);
//# sourceMappingURL=exception.filter.js.map