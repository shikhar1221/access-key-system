import { Redis } from 'ioredis';
export declare class RateLimitingService {
    private readonly redisClient;
    private readonly WINDOW_SIZE_IN_SECONDS;
    constructor(redisClient: Redis);
    checkRateLimit(apiKey: string, rateLimitPerMinute: number): Promise<void>;
}
