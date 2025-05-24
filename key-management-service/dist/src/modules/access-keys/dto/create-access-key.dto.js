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
exports.CreateAccessKeyDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateAccessKeyDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-123', description: 'The ID of the user associated with this key' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAccessKeyDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'The rate limit per minute for this key', minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateAccessKeyDto.prototype, "rateLimitPerMinute", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-31T23:59:59.000Z', description: 'The expiration date of the key in ISO 8601 format' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAccessKeyDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the key is active or not', required: false, default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateAccessKeyDto.prototype, "isActive", void 0);
exports.CreateAccessKeyDto = CreateAccessKeyDto;
//# sourceMappingURL=create-access-key.dto.js.map