import { OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { DuplicatedKeysService } from './duplicated-keys.service';
export declare class AccessKeySubscriberService implements OnModuleInit {
    private readonly redisClient;
    private readonly duplicatedKeysService;
    private readonly logger;
    constructor(redisClient: Redis, duplicatedKeysService: DuplicatedKeysService);
    onModuleInit(): void;
    private subscribeToKeyEvents;
    private handleKeyEvent;
}
