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
exports.AccessKeysService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const access_key_repository_1 = require("../repositories/access-key.repository");
const access_key_publisher_service_1 = require("./access-key-publisher.service");
const uuid_1 = require("uuid");
const access_key_event_1 = require("../../../shared/access-key-event");
let AccessKeysService = class AccessKeysService {
    constructor(accessKeyRepository, accessKeyPublisherService, logger) {
        this.accessKeyRepository = accessKeyRepository;
        this.accessKeyPublisherService = accessKeyPublisherService;
        this.logger = logger;
    }
    async createKey(createAccessKeyDto) {
        this.logger.log('Creating new access key.');
        const apiKey = (0, uuid_1.v4)();
        this.logger.log(`Generated API Key: ${apiKey}`);
        const newKeyData = {
            ...createAccessKeyDto,
            apiKey,
            expiresAt: new Date(createAccessKeyDto.expiresAt),
        };
        this.logger.log(`New access key data prepared: ${JSON.stringify(newKeyData)}`);
        const savedKey = await this.accessKeyRepository.createAccessKeyEntry(newKeyData);
        this.logger.log(`Access key created successfully with API Key: ${savedKey.apiKey}`);
        await this.accessKeyPublisherService.publishEvent(access_key_event_1.AccessKeyEventType.CREATED, savedKey);
        return savedKey;
    }
    async listKeys() {
        this.logger.log('Listing all access keys.');
        return this.accessKeyRepository.find();
    }
    async findOneByApiKey(apiKey) {
        this.logger.log(`Finding access key with API Key: ${apiKey}`);
        const key = await this.accessKeyRepository.findOne({ where: { apiKey } });
        if (!key) {
            this.logger.warn(`Access key with API Key "${apiKey}" not found.`);
            throw new common_1.NotFoundException(`Access key with API Key "${apiKey}" not found`);
        }
        this.logger.log(`Access key found with API Key: ${apiKey}`);
        return key;
    }
    async updateKey(apiKey, updateAccessKeyDto) {
        this.logger.log(`Updating access key with API Key: ${apiKey}`);
        const key = await this.findOneByApiKey(apiKey);
        if (updateAccessKeyDto.expiresAt) {
            key.expiresAt = new Date(updateAccessKeyDto.expiresAt);
            const { expiresAt, ...restOfDto } = updateAccessKeyDto;
            Object.assign(key, restOfDto);
        }
        else {
            Object.assign(key, updateAccessKeyDto);
        }
        const updatedKey = await this.accessKeyRepository.save(key);
        this.logger.log(`Access key updated successfully with API Key: ${updatedKey.apiKey}`);
        await this.accessKeyPublisherService.publishEvent(access_key_event_1.AccessKeyEventType.UPDATED, updatedKey);
        return updatedKey;
    }
    async deleteKey(apiKey) {
        this.logger.log(`Deleting access key with API Key: ${apiKey}`);
        const key = await this.findOneByApiKey(apiKey);
        await this.accessKeyRepository.remove(key);
        this.logger.log(`Access key deleted successfully with API Key: ${apiKey}`);
        await this.accessKeyPublisherService.publishEvent(access_key_event_1.AccessKeyEventType.DELETED, { apiKey: key.apiKey, id: key.id });
    }
    async disableKey(apiKey) {
        this.logger.log(`Disabling access key with API Key: ${apiKey}`);
        const key = await this.findOneByApiKey(apiKey);
        key.isActive = false;
        const disabledKey = await this.accessKeyRepository.save(key);
        this.logger.log(`Access key disabled successfully with API Key: ${disabledKey.apiKey}`);
        await this.accessKeyPublisherService.publishEvent(access_key_event_1.AccessKeyEventType.DISABLED, disabledKey);
        return disabledKey;
    }
    async enableKey(apiKey) {
        this.logger.log(`Enabling access key with API Key: ${apiKey}`);
        const key = await this.findOneByApiKey(apiKey);
        key.isActive = true;
        const enabledKey = await this.accessKeyRepository.save(key);
        this.logger.log(`Access key enabled successfully with API Key: ${enabledKey.apiKey}`);
        await this.accessKeyPublisherService.publishEvent(access_key_event_1.AccessKeyEventType.ENABLED, enabledKey);
        return enabledKey;
    }
    async getUserPlan(apiKey) {
        this.logger.log(`Getting user plan for API Key: ${apiKey}`);
        const key = await this.findOneByApiKey(apiKey);
        if (!key.isActive) {
            this.logger.warn(`Access key with API Key "${apiKey}" is inactive.`);
            throw new common_1.NotFoundException(`Access key with API Key "${apiKey}" is inactive.`);
        }
        this.logger.log(`User plan retrieved successfully for API Key: ${apiKey}`);
        return key;
    }
};
AccessKeysService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(access_key_repository_1.AccessKeyRepository)),
    __metadata("design:paramtypes", [access_key_repository_1.AccessKeyRepository,
        access_key_publisher_service_1.AccessKeyPublisherService,
        common_1.Logger])
], AccessKeysService);
exports.AccessKeysService = AccessKeysService;
//# sourceMappingURL=access-keys.service.js.map