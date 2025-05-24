import { OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';
import { AccessKeyEventType } from '../../../shared/access-key-event';
export declare class AccessKeyPublisherService implements OnApplicationShutdown {
    private readonly redisClient;
    private readonly logger;
    private readonly eventChannel;
    constructor(redisClient: Redis);
    publishEvent(eventType: AccessKeyEventType, payload: any): Promise<void>;
    onApplicationShutdown(signal?: string): Promise<void>;
}
