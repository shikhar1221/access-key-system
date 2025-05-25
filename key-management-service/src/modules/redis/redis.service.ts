import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  async ping(): Promise<string> {
    return this.redisClient.ping();
  }
}