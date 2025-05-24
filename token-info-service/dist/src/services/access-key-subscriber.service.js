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
var AccessKeySubscriberService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessKeySubscriberService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("@nestjs-modules/ioredis");
const ioredis_2 = require("ioredis");
const duplicated_keys_service_1 = require("./duplicated-keys.service");
const KEY_MANAGEMENT_CHANNEL = 'access_key_events';
let AccessKeySubscriberService = AccessKeySubscriberService_1 = class AccessKeySubscriberService {
    constructor(redisClient, duplicatedKeysService) {
        this.redisClient = redisClient;
        this.duplicatedKeysService = duplicatedKeysService;
        this.logger = new common_1.Logger(AccessKeySubscriberService_1.name);
    }
    onModuleInit() {
        this.subscribeToKeyEvents();
    }
    subscribeToKeyEvents() {
        const subscriber = this.redisClient.duplicate();
        subscriber.subscribe(KEY_MANAGEMENT_CHANNEL, (err, count) => {
            if (err) {
                this.logger.error(`Failed to subscribe to ${KEY_MANAGEMENT_CHANNEL}: ${err.message}`);
                return;
            }
            this.logger.log(`Subscribed to ${KEY_MANAGEMENT_CHANNEL}. Listening for messages... (${count} channels)`);
        });
        subscriber.on('message', (channel, message) => {
            if (channel === KEY_MANAGEMENT_CHANNEL) {
                this.logger.log(`Received message from ${channel}: ${message}`);
                try {
                    const event = JSON.parse(message);
                    if (!event || !event.eventType) {
                        this.logger.error(`Received invalid message format from ${channel}: Missing event or event type`, message);
                        return;
                    }
                    this.handleKeyEvent(event);
                }
                catch (error) {
                    this.logger.error(`Error processing message from ${channel}: ${error.message}`, message);
                }
            }
        });
    }
    async handleKeyEvent(event) {
        this.logger.log(`Received key event: ${JSON.stringify(event)}`);
        const type = event.eventType;
        const payload = event.payload;
        this.logger.log(`Handling event type: ${type} with payload: ${JSON.stringify(payload)}`);
        try {
            switch (type) {
                case 'CREATED':
                case 'UPDATED':
                    const upsertDto = {
                        apiKey: payload.apiKey,
                        rateLimitPerMinute: payload.rateLimitPerMinute,
                        expiresAt: payload.expiresAt,
                        isActive: payload.isActive !== undefined ? payload.isActive : true,
                    };
                    this.logger.log(`Upserted key: ${payload.apiKey}`);
                    await this.duplicatedKeysService.upsertDuplicatedKey(upsertDto);
                    break;
                case 'DELETED':
                    if (!payload.apiKey) {
                        this.logger.error('apiKey missing in key_deleted event payload');
                        return;
                    }
                    await this.duplicatedKeysService.deleteDuplicatedKey(payload.apiKey);
                    this.logger.log(`Deleted key: ${payload.apiKey}`);
                    break;
                case 'DISABLED':
                    if (!payload.apiKey) {
                        this.logger.error('apiKey missing in key_disabled event payload');
                        return;
                    }
                    await this.duplicatedKeysService.setKeyActiveStatus(payload.apiKey, false);
                    this.logger.log(`Disabled key: ${payload.apiKey}`);
                    break;
                case 'ENABLED':
                    if (!payload.apiKey) {
                        this.logger.error('apiKey missing in key_enabled event payload');
                        return;
                    }
                    await this.duplicatedKeysService.setKeyActiveStatus(payload.apiKey, true);
                    this.logger.log(`Enabled key: ${payload.apiKey}`);
                    break;
                default:
                    this.logger.warn(`Received unhandled event type: ${type}`);
            }
        }
        catch (error) {
            this.logger.error(`Error handling key event type ${type} for key ${payload?.apiKey}: ${error.message}`, error.stack);
        }
    }
};
AccessKeySubscriberService = AccessKeySubscriberService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, ioredis_1.InjectRedis)()),
    __metadata("design:paramtypes", [ioredis_2.Redis,
        duplicated_keys_service_1.DuplicatedKeysService])
], AccessKeySubscriberService);
exports.AccessKeySubscriberService = AccessKeySubscriberService;
