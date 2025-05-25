import { Injectable, Logger, UnauthorizedException, ForbiddenException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DuplicatedKeysService } from './duplicated-keys.service';
import { RequestLogsService } from './request-logs.service';
import { MockTokensService } from './mock-tokens.service';
import { RateLimitingService } from './rate-limiting.service';
import { InvalidApiKeyException } from '../../../shared/exceptions/invalid-api-key.exception';
import { KeyExpiredException } from '../../../shared/exceptions/key-expired.exception';
import { KeyInactiveException } from '../../../shared/exceptions/key-inactive.exception';
import { TokenNotFoundException } from '../../../shared/exceptions/token-not-found.exception';
import { MockToken } from '../../../entities/mock-token.entity';
import { CreateRequestLogDto } from '../dtos/request-log.dto';
import { RateLimitExceededException } from '../../../shared/exceptions/rate-limit-exceeded.exception';
import { DuplicatedAccessKey } from '../../../entities/duplicated-access-key.entity'; // Import DuplicatedAccessKey

@Injectable()
export class TokenInfoService {
  private readonly logger = new Logger(TokenInfoService.name);

  constructor(
    private readonly duplicatedKeysService: DuplicatedKeysService,
    private readonly requestLogsService: RequestLogsService,
    private readonly mockTokensService: MockTokensService,
    private readonly rateLimitingService: RateLimitingService,
  ) {}

  async getTokenInfo(apiKey: string, symbol: string, requestPath: string): Promise<MockToken> {
    this.logger.log(`[getTokenInfo] Received request for apiKey: ${apiKey}, symbol: ${symbol}, path: ${requestPath}`);
    let isSuccessful = false;
    let isRateLimited = false;
    let errorMessage: string | undefined;

    // Explicitly check for missing API key
    if (!apiKey) {
      this.logger.warn(`[getTokenInfo] API Key is missing`);
      throw new InvalidApiKeyException('API Key is missing');
    }

    try {
      // Fetch key validation and mock token data concurrently
      const [keyInfo, tokenData] = await Promise.all([
        this.duplicatedKeysService.findOne(apiKey),
        this.mockTokensService.findOne(symbol.toUpperCase()),
      ]);

      this.logger.debug(`[getTokenInfo] Fetched keyInfo: ${JSON.stringify(keyInfo)} and tokenData: ${JSON.stringify(tokenData)}`);

      // 1. Key Validation
      await this.validateApiKey(apiKey, keyInfo); // Call the new validation method

      // 2. Rate Limiting
      try {
        this.logger.debug(`[getTokenInfo] Checking rate limit for API Key: ${apiKey} with limit ${keyInfo.rateLimitPerMinute}`);
      await this.rateLimitingService.checkRateLimit(apiKey, keyInfo.rateLimitPerMinute);
        this.logger.debug(`[getTokenInfo] Rate limit check passed for API Key: ${apiKey}`);
      } catch (error) {
        if (error instanceof RateLimitExceededException) {
          isRateLimited = true;
          this.logger.warn(`[getTokenInfo] Rate limit exceeded for API Key: ${apiKey}`);
        }
        throw error; // Re-throw to be caught by the outer try-catch and logged
      }

      // 3. Check Mock Token Data
      if (!tokenData) {
        this.logger.warn(`[getTokenInfo] Token data not found for symbol: ${symbol}`);
        throw new TokenNotFoundException(symbol);
      }
      this.logger.debug(`[getTokenInfo] Token data found for symbol: ${symbol}`);

      isSuccessful = true;
      this.logger.log(`[getTokenInfo] Successfully retrieved token info for apiKey: ${apiKey}, symbol: ${symbol}`);
      return tokenData;

    } catch (error) {
      this.logger.error(
        `[getTokenInfo] Error in getTokenInfo for apiKey: ${apiKey}, symbol: ${symbol} - ${error.message}`,
        error.stack,
      );
      errorMessage = error.message;
      throw error; // Re-throw to be handled by AllExceptionsFilter
    } finally {
      // 4. Log Request
      const logEntry: CreateRequestLogDto = {
        apiKey,
        requestPath,
        isSuccessful,
        isRateLimited,
        errorMessage,
      };
      try {
        this.logger.debug(`[getTokenInfo] Creating request log entry: ${JSON.stringify(logEntry)}`);
        await this.requestLogsService.createLog(logEntry);
        this.logger.debug(`[getTokenInfo] Request log created successfully.`);
      } catch (logError) {
        this.logger.error(`[getTokenInfo] Failed to create request log: ${logError.message}`, logError.stack);
        // For now, we just log it.
      }
    }
  }

  private async validateApiKey(apiKey: string, keyInfo: DuplicatedAccessKey | undefined): Promise<void> {
    this.logger.debug(`[validateApiKey] Validating API Key: ${apiKey}`);

    if (!keyInfo) {
      this.logger.warn(`[validateApiKey] Invalid API Key: ${apiKey}`);
      throw new InvalidApiKeyException();
    }
    this.logger.debug(`[validateApiKey] API Key found: ${apiKey}`);

    if (!keyInfo.isActive) {
      this.logger.warn(`[validateApiKey] API Key inactive: ${apiKey}`);
      throw new KeyInactiveException();
    }
    this.logger.debug(`[validateApiKey] API Key is active: ${apiKey}`);

    if (new Date(keyInfo.expiresAt) < new Date()) {
      this.logger.warn(`[validateApiKey] API Key expired: ${apiKey}`);
      throw new KeyExpiredException();
    }
    this.logger.debug(`[validateApiKey] API Key is not expired: ${apiKey}`);

    this.logger.debug(`[validateApiKey] API Key validation successful for: ${apiKey}`);
  }
}