import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis'; // Corrected import path
import Redis from 'ioredis';
import { AccessKeyEvent, AccessKeyEventType } from '../../../shared/access-key-event'; // Adjusted path

@Injectable()
export class AccessKeyPublisherService {
  private readonly logger = new Logger(AccessKeyPublisherService.name);
  private readonly eventChannel = 'access_key_events'; // Define a specific channel name

  constructor(@InjectRedis() private readonly redisClient: Redis) {}
  // Decorators are valid on constructor parameters, the previous error might have been a temporary linter issue or due to the incorrect module import.

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
}