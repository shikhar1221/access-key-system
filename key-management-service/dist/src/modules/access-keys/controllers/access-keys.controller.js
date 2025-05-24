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
var AccessKeysController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessKeysController = void 0;
const common_1 = require("@nestjs/common");
const access_keys_service_1 = require("../services/access-keys.service");
const create_access_key_dto_1 = require("../dto/create-access-key.dto");
const update_access_key_dto_1 = require("../dto/update-access-key.dto");
const access_key_entity_1 = require("../entities/access-key.entity");
const swagger_1 = require("@nestjs/swagger");
let AccessKeysController = AccessKeysController_1 = class AccessKeysController {
    constructor(accessKeysService) {
        this.accessKeysService = accessKeysService;
        this.logger = new common_1.Logger(AccessKeysController_1.name);
    }
    async createKey(createAccessKeyDto) {
        this.logger.log(`Received request to create access key: ${JSON.stringify(createAccessKeyDto)}`);
        return this.accessKeysService.createKey(createAccessKeyDto);
    }
    async listKeys() {
        this.logger.log('Received request to list all access keys.');
        return this.accessKeysService.listKeys();
    }
    async updateKey(apiKey, updateAccessKeyDto) {
        this.logger.log(`Received request to update access key with API Key: ${apiKey}, data: ${JSON.stringify(updateAccessKeyDto)}`);
        return this.accessKeysService.updateKey(apiKey, updateAccessKeyDto);
    }
    async deleteKey(apiKey) {
        this.logger.log(`Received request to delete access key with API Key: ${apiKey}`);
        return this.accessKeysService.deleteKey(apiKey);
    }
    async getUserPlan(apiKey) {
        this.logger.log(`Received request for user plan with API Key: ${apiKey}`);
        if (!apiKey) {
            this.logger.warn('X-API-Key header is missing for getUserPlan request.');
            throw new common_1.UnauthorizedException('X-API-Key header is missing');
        }
        return this.accessKeysService.getUserPlan(apiKey);
    }
    async disableKey(apiKey) {
        this.logger.log(`Received request to disable key with API Key: ${apiKey}`);
        if (!apiKey) {
            this.logger.warn('X-API-Key header is missing for disableKey request.');
            throw new common_1.UnauthorizedException('X-API-Key header is missing');
        }
        return this.accessKeysService.disableKey(apiKey);
    }
};
__decorate([
    (0, common_1.Post)('admin/keys'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new access key (Admin)', description: 'Allows an administrator to create a new access key.' }),
    (0, swagger_1.ApiBody)({ type: create_access_key_dto_1.CreateAccessKeyDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'The access key has been successfully created.', type: access_key_entity_1.AccessKey }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input data.' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_access_key_dto_1.CreateAccessKeyDto]),
    __metadata("design:returntype", Promise)
], AccessKeysController.prototype, "createKey", null);
__decorate([
    (0, common_1.Get)('admin/keys'),
    (0, swagger_1.ApiOperation)({ summary: 'List all access keys (Admin)', description: 'Retrieves a list of all access keys. For administrative use.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Successfully retrieved list of access keys.', type: [access_key_entity_1.AccessKey] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccessKeysController.prototype, "listKeys", null);
__decorate([
    (0, common_1.Put)('admin/keys/:apiKey'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an access key (Admin)', description: 'Allows an administrator to update an existing access key by its API key.' }),
    (0, swagger_1.ApiParam)({ name: 'apiKey', description: 'The API key of the access key to update', type: String }),
    (0, swagger_1.ApiBody)({ type: update_access_key_dto_1.UpdateAccessKeyDto }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The access key has been successfully updated.', type: access_key_entity_1.AccessKey }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Access key not found.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Invalid input data.' }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true })),
    __param(0, (0, common_1.Param)('apiKey')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_access_key_dto_1.UpdateAccessKeyDto]),
    __metadata("design:returntype", Promise)
], AccessKeysController.prototype, "updateKey", null);
__decorate([
    (0, common_1.Delete)('admin/keys/:apiKey'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an access key (Admin)', description: 'Allows an administrator to delete an access key by its API key.' }),
    (0, swagger_1.ApiParam)({ name: 'apiKey', description: 'The API key of the access key to delete', type: String }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT, description: 'The access key has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Access key not found.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('apiKey')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccessKeysController.prototype, "deleteKey", null);
__decorate([
    (0, common_1.Get)('keys/my-plan'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user plan details', description: 'Retrieves details of the access key associated with the provided X-API-Key.' }),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', description: 'The API key for authentication.', required: true }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'Successfully retrieved key details.', type: access_key_entity_1.AccessKey }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: 'X-API-Key header is missing or invalid.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Access key not found or inactive.' }),
    __param(0, (0, common_1.Headers)('x-api-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccessKeysController.prototype, "getUserPlan", null);
__decorate([
    (0, common_1.Post)('keys/my-plan/disable'),
    (0, swagger_1.ApiOperation)({ summary: 'Disable current user access key', description: 'Disables the access key associated with the provided X-API-Key.' }),
    (0, swagger_1.ApiHeader)({ name: 'x-api-key', description: 'The API key for authentication.', required: true }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The access key has been successfully disabled.', type: access_key_entity_1.AccessKey }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.UNAUTHORIZED, description: 'X-API-Key header is missing or invalid.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Access key not found.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('x-api-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccessKeysController.prototype, "disableKey", null);
AccessKeysController = AccessKeysController_1 = __decorate([
    (0, swagger_1.ApiTags)('access-keys'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [access_keys_service_1.AccessKeysService])
], AccessKeysController);
exports.AccessKeysController = AccessKeysController;
//# sourceMappingURL=access-keys.controller.js.map