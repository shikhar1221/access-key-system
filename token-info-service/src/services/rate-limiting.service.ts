import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis'; // Updated import path and decorator
import { Redis } from 'ioredis'; // Import Redis type from ioredis
import { RateLimitExceededException } from '../shared/exceptions/rate-limit-exceeded.exception';

@Injectable()
export class RateLimitingService {
  private readonly WINDOW_SIZE_IN_SECONDS = 60; // 1 minute window


  constructor(
    @InjectRedis() private readonly redisClient: Redis // Inject Redis client directly
  ) {}

  /**
   * Checks if a request from a given API key is within the allowed rate limit.
   * Uses a sliding window algorithm with Redis.
   * @param apiKey The API key making the request.
   * @param rateLimitPerMinute The maximum number of requests allowed for this key within the window.
   
   */
  async checkRateLimit(apiKey: string, rateLimitPerMinute: number): Promise<void> {
    const key = `rate_limit:${apiKey}`;
    const now = Date.now();

    // Start a Redis transaction
    const multi = this.redisClient.multi();

    // Remove timestamps older than the window size
    multi.zremrangebyscore(key, 0, now - this.WINDOW_SIZE_IN_SECONDS * 1000);
    // Add current request timestamp
    multi.zadd(key, now, now.toString());
    // Get the count of requests in the current window
    multi.zcard(key);
    // Set an expiration for the key to auto-clean if no activity (window size + buffer)
    multi.expire(key, this.WINDOW_SIZE_IN_SECONDS + 60);

    const results = await multi.exec();

    // Results array contains the output of each command in the transaction
    // We are interested in the result of zcard, which is the 3rd command (index 2) and the result is the second element in the tuple
    const currentRequestCount = results[2][1] as number;

    if (currentRequestCount > rateLimitPerMinute) {
      throw new RateLimitExceededException(
        `API key ${apiKey} has exceeded the rate limit of ${rateLimitPerMinute} requests per ${this.WINDOW_SIZE_IN_SECONDS} seconds.`,
      );
    }
  }
}