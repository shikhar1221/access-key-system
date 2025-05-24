import { OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { Redis } from 'ioredis';
import { DuplicatedKeysService } from './duplicated-keys.service';
export declare class AccessKeySubscriberService implements OnModuleInit, OnApplicationShutdown {
    private readonly redisClient;
    private readonly duplicatedKeysService;
    private readonly logger;
    private subscriberClient;
    constructor(redisClient: Redis, duplicatedKeysService: DuplicatedKeysService);
    onModuleInit(): void;
    private subscribeToKeyEvents;
    onApplicationShutdown(signal?: string): Promise<void>;
    private handleKeyEvent;
}
