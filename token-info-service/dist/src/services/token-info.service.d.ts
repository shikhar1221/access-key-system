import { DuplicatedKeysService } from './duplicated-keys.service';
import { RequestLogsService } from './request-logs.service';
import { MockTokensService } from './mock-tokens.service';
import { RateLimitingService } from './rate-limiting.service';
import { MockToken } from '../entities/mock-token.entity';
export declare class TokenInfoService {
    private readonly duplicatedKeysService;
    private readonly requestLogsService;
    private readonly mockTokensService;
    private readonly rateLimitingService;
    private readonly logger;
    constructor(duplicatedKeysService: DuplicatedKeysService, requestLogsService: RequestLogsService, mockTokensService: MockTokensService, rateLimitingService: RateLimitingService);
    getTokenInfo(apiKey: string, symbol: string, requestPath: string): Promise<MockToken>;
}
