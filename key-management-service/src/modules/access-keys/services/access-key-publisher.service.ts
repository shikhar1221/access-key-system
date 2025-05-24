import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { AccessKeyEvent, AccessKeyEventType } from '../../../shared/access-key-event';

@Injectable()
export class AccessKeyPublisherService implements OnApplicationShutdown {
  private readonly logger = new Logger(AccessKeyPublisherService.name);
  private readonly eventChannel = 'access_key_events';

  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async publishEvent(eventType: AccessKeyEventType, payload: any): Promise<void> {
    const event: AccessKeyEvent = {
      eventType,
      payload,
      timestamp: new Date(),
    };
    try {
      const message = JSON.stringify(event);
      await this.redisClient.publish(this.eventChannel, message);
      this.logger.log(`Published ${eventType} event to ${this.eventChannel}: ${JSON.stringify(payload)}`);
    } catch (error) {
      this.logger.error(`Failed to publish ${eventType} event to ${this.eventChannel}`, error);
    }
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Handling shutdown signal: ${signal}`);
    if (this.redisClient && this.redisClient.status !== 'end') {
      try {
        await this.redisClient.quit();
        this.logger.log('Redis publisher client connection closed.');
      } catch (error) {
        this.logger.error('Error closing Redis publisher client connection:', error);
      }
    }
  }
}