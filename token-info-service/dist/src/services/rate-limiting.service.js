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
exports.RateLimitingService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("@nestjs-modules/ioredis");
const ioredis_2 = require("ioredis");
const rate_limit_exceeded_exception_1 = require("../shared/exceptions/rate-limit-exceeded.exception");
let RateLimitingService = class RateLimitingService {
    constructor(redisClient) {
        this.redisClient = redisClient;
        this.WINDOW_SIZE_IN_SECONDS = 60;
    }
    async checkRateLimit(apiKey, rateLimitPerMinute) {
        const key = `rate_limit:${apiKey}`;
        const now = Date.now();
        const multi = this.redisClient.multi();
        multi.zremrangebyscore(key, 0, now - this.WINDOW_SIZE_IN_SECONDS * 1000);
        multi.zadd(key, now, now.toString());
        multi.zcard(key);
        multi.expire(key, this.WINDOW_SIZE_IN_SECONDS + 60);
        const results = await multi.exec();
        const currentRequestCount = results[2][1];
        if (currentRequestCount > rateLimitPerMinute) {
            throw new rate_limit_exceeded_exception_1.RateLimitExceededException(`API key ${apiKey} has exceeded the rate limit of ${rateLimitPerMinute} requests per ${this.WINDOW_SIZE_IN_SECONDS} seconds.`);
        }
    }
};
RateLimitingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, ioredis_1.InjectRedis)()),
    __metadata("design:paramtypes", [ioredis_2.Redis])
], RateLimitingService);
exports.RateLimitingService = RateLimitingService;
