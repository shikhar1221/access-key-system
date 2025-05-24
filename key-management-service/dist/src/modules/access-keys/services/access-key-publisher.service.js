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
var AccessKeyPublisherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessKeyPublisherService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("@nestjs-modules/ioredis");
const ioredis_2 = require("ioredis");
let AccessKeyPublisherService = AccessKeyPublisherService_1 = class AccessKeyPublisherService {
    constructor(redisClient) {
        this.redisClient = redisClient;
        this.logger = new common_1.Logger(AccessKeyPublisherService_1.name);
        this.eventChannel = 'access_key_events';
    }
    async publishEvent(eventType, payload) {
        const event = {
            eventType,
            payload,
            timestamp: new Date(),
        };
        try {
            const message = JSON.stringify(event);
            await this.redisClient.publish(this.eventChannel, message);
            this.logger.log(`Published ${eventType} event to ${this.eventChannel}: ${JSON.stringify(payload)}`);
        }
        catch (error) {
            this.logger.error(`Failed to publish ${eventType} event to ${this.eventChannel}`, error);
        }
    }
    async onApplicationShutdown(signal) {
        this.logger.log(`Handling shutdown signal: ${signal}`);
        if (this.redisClient && this.redisClient.status !== 'end') {
            try {
                await this.redisClient.quit();
                this.logger.log('Redis publisher client connection closed.');
            }
            catch (error) {
                this.logger.error('Error closing Redis publisher client connection:', error);
            }
        }
    }
};
AccessKeyPublisherService = AccessKeyPublisherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, ioredis_1.InjectRedis)()),
    __metadata("design:paramtypes", [ioredis_2.default])
], AccessKeyPublisherService);
exports.AccessKeyPublisherService = AccessKeyPublisherService;
//# sourceMappingURL=access-key-publisher.service.js.map