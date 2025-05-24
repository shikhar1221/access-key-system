import { Injectable, OnModuleInit, Logger, OnApplicationShutdown } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { DuplicatedKeysService } from './duplicated-keys.service';
import { CreateDuplicatedAccessKeyDto } from '../dtos/duplicated-access-key.dto';
import { KeyManagementEvent, KeyManagementEventPayload } from '../shared/interfaces/key-management-event.interface';

const KEY_MANAGEMENT_CHANNEL = 'access_key_events';

@Injectable()
export class AccessKeySubscriberService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(AccessKeySubscriberService.name);
  private subscriberClient: Redis; // Add property to store subscriber client

  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly duplicatedKeysService: DuplicatedKeysService,
  ) {}

  onModuleInit() {
    this.subscribeToKeyEvents();
  }

  private subscribeToKeyEvents() {
    this.subscriberClient = this.redisClient.duplicate(); // Store the duplicated client

    this.subscriberClient.subscribe(KEY_MANAGEMENT_CHANNEL, (err, count) => {
      if (err) {
        this.logger.error(`Failed to subscribe to ${KEY_MANAGEMENT_CHANNEL}: ${err.message}`);
        return;
      }
      this.logger.log(`Subscribed to ${KEY_MANAGEMENT_CHANNEL}. Listening for messages... (${count} channels)`);
    });

    this.subscriberClient.on('message', (channel, message) => {
      if (channel === KEY_MANAGEMENT_CHANNEL) {
        this.logger.log(`Received message from ${channel}: ${message}`);
        try {
          const event: KeyManagementEvent = JSON.parse(message);
          // Add a check for event and event.type
          if (!event || !event.eventType) {
            this.logger.error(`Received invalid message format from ${channel}: Missing event or event type`, message);
            return;
          }
          this.handleKeyEvent(event);
        } catch (error) {
          this.logger.error(`Error processing message from ${channel}: ${error.message}`, message);
        }
      }
    });
  }

  // Implement onApplicationShutdown hook
  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Handling shutdown signal: ${signal}`);
    if (this.subscriberClient && this.subscriberClient.status !== 'end') {
      await this.subscriberClient.quit(); // Close the subscriber client
      this.logger.log('Redis subscriber client closed.');
    }
  }

  private async handleKeyEvent(event: KeyManagementEvent) {
    this.logger.log(`Received key event: ${JSON.stringify(event)}`);
    const type = event.eventType;
    const payload: KeyManagementEventPayload = event.payload;
    this.logger.log(`Handling event type: ${type} with payload: ${JSON.stringify(payload)}`);

    try {
      switch (type) {
        case 'CREATED':
        case 'UPDATED':
          // Assuming payload for created/updated is compatible with CreateDuplicatedAccessKeyDto
          // or includes all necessary fields (apiKey, rateLimit, expiresAt, isActive)
          const upsertDto: CreateDuplicatedAccessKeyDto = {
            apiKey: payload.apiKey,
            rateLimitPerMinute: payload.rateLimitPerMinute,
            expiresAt: payload.expiresAt, // Ensure this is a valid ISO date string or Date object
            isActive: payload.isActive !== undefined ? payload.isActive : true, // Default to true if not specified
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
        
        case 'ENABLED': // Assuming an explicit 'key_enabled' event might exist
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
    } catch (error) {
      this.logger.error(`Error handling key event type ${type} for key ${payload?.apiKey}: ${error.message}`, error.stack);
    }
  }
}