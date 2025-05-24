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
exports.AccessKey = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let AccessKey = class AccessKey {
};
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', description: 'Unique identifier for the access key' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AccessKey.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user-123', description: 'The ID of the user associated with this key' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], AccessKey.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sk_live_abcdef1234567890', description: 'The unique API key string' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", String)
], AccessKey.prototype, "apiKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'The rate limit per minute for this key' }),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AccessKey.prototype, "rateLimitPerMinute", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-31T23:59:59.000Z', description: 'The expiration date of the key' }),
    (0, typeorm_1.Column)({ type: 'timestamp with time zone' }),
    __metadata("design:type", Date)
], AccessKey.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether the key is active or not', default: true }),
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], AccessKey.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp of when the key was created' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AccessKey.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp of when the key was last updated' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AccessKey.prototype, "updatedAt", void 0);
AccessKey = __decorate([
    (0, typeorm_1.Entity)('access_keys')
], AccessKey);
exports.AccessKey = AccessKey;
//# sourceMappingURL=access-key.entity.js.map