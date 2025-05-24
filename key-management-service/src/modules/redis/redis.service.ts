import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis'; // Changed import
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis, // Changed injection decorator
  ) {}

  async ping(): Promise<string> {
    return this.redisClient.ping();
  }
}