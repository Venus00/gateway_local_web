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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLoggedInUserResponseDto = exports.RegisterUserResponseDto = exports.LoginUserResponseDto = exports.RegisterUserRequestDto = exports.LoginUserRequestDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const ismatch_validation_1 = require("../common/utils/ismatch.validation");
class LoginUserRequestDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String, format: "email" }, password: { required: true, type: () => String, minLength: 4, maxLength: 24 } };
    }
}
exports.LoginUserRequestDto = LoginUserRequestDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", Object)
], LoginUserRequestDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(24),
    __metadata("design:type", Object)
], LoginUserRequestDto.prototype, "password", void 0);
class RegisterUserRequestDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { tenantId: { required: true, type: () => Number }, name: { required: true, type: () => String }, tenantName: { required: true, type: () => String }, email: { required: true, type: () => String, format: "email" }, password: { required: true, type: () => String }, confirmPassword: { required: true, type: () => String } };
    }
}
exports.RegisterUserRequestDto = RegisterUserRequestDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], RegisterUserRequestDto.prototype, "tenantId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], RegisterUserRequestDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], RegisterUserRequestDto.prototype, "tenantName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterUserRequestDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], RegisterUserRequestDto.prototype, "password", void 0);
__decorate([
    (0, ismatch_validation_1.IsMatch)('password', { message: 'password confirmation does not match.' }),
    __metadata("design:type", Object)
], RegisterUserRequestDto.prototype, "confirmPassword", void 0);
class LoginUserResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.LoginUserResponseDto = LoginUserResponseDto;
class RegisterUserResponseDto extends LoginUserResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.RegisterUserResponseDto = RegisterUserResponseDto;
class GetLoggedInUserResponseDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { password: { required: true, type: () => String }, active: { required: true, type: () => Object }, refreshToken: { required: true, type: () => Object }, created_at: { required: true, type: () => Object }, updated_at: { required: true, type: () => Object }, deleted_at: { required: true, type: () => Object } };
    }
}
exports.GetLoggedInUserResponseDto = GetLoggedInUserResponseDto;
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], GetLoggedInUserResponseDto.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], GetLoggedInUserResponseDto.prototype, "active", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], GetLoggedInUserResponseDto.prototype, "refreshToken", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], GetLoggedInUserResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], GetLoggedInUserResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", Object)
], GetLoggedInUserResponseDto.prototype, "deleted_at", void 0);
//# sourceMappingURL=auth.dto.js.map