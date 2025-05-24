"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TokenInfoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInfoService = void 0;
const common_1 = require("@nestjs/common");
const duplicated_keys_service_1 = require("./duplicated-keys.service");
const request_logs_service_1 = require("./request-logs.service");
const mock_tokens_service_1 = require("./mock-tokens.service");
const rate_limiting_service_1 = require("./rate-limiting.service");
const invalid_api_key_exception_1 = require("../shared/exceptions/invalid-api-key.exception");
const key_expired_exception_1 = require("../shared/exceptions/key-expired.exception");
const key_inactive_exception_1 = require("../shared/exceptions/key-inactive.exception");
const token_not_found_exception_1 = require("../shared/exceptions/token-not-found.exception");
const rate_limit_exceeded_exception_1 = require("../shared/exceptions/rate-limit-exceeded.exception");
let TokenInfoService = TokenInfoService_1 = class TokenInfoService {
    constructor(duplicatedKeysService, requestLogsService, mockTokensService, rateLimitingService) {
        this.duplicatedKeysService = duplicatedKeysService;
        this.requestLogsService = requestLogsService;
        this.mockTokensService = mockTokensService;
        this.rateLimitingService = rateLimitingService;
        this.logger = new common_1.Logger(TokenInfoService_1.name);
    }
    async getTokenInfo(apiKey, symbol, requestPath) {
        this.logger.log(`[getTokenInfo] Received request for apiKey: ${apiKey}, symbol: ${symbol}, path: ${requestPath}`);
        let isSuccessful = false;
        let isRateLimited = false;
        let errorMessage;
        try {
            const [keyInfo, tokenData] = await Promise.all([
                this.duplicatedKeysService.findOne(apiKey),
                this.mockTokensService.findOne(symbol.toUpperCase()),
            ]);
            this.logger.debug(`[getTokenInfo] Fetched keyInfo: ${JSON.stringify(keyInfo)} and tokenData: ${JSON.stringify(tokenData)}`);
            if (!keyInfo) {
                this.logger.warn(`[getTokenInfo] Invalid API Key: ${apiKey}`);
                throw new invalid_api_key_exception_1.InvalidApiKeyException();
            }
            this.logger.debug(`[getTokenInfo] API Key found: ${apiKey}`);
            if (!keyInfo.isActive) {
                this.logger.warn(`[getTokenInfo] API Key inactive: ${apiKey}`);
                throw new key_inactive_exception_1.KeyInactiveException();
            }
            this.logger.debug(`[getTokenInfo] API Key is active: ${apiKey}`);
            if (new Date(keyInfo.expiresAt) < new Date()) {
                this.logger.warn(`[getTokenInfo] API Key expired: ${apiKey}`);
                throw new key_expired_exception_1.KeyExpiredException();
            }
            this.logger.debug(`[getTokenInfo] API Key is not expired: ${apiKey}`);
            try {
                this.logger.debug(`[getTokenInfo] Checking rate limit for API Key: ${apiKey} with limit ${keyInfo.rateLimitPerMinute}`);
                await this.rateLimitingService.checkRateLimit(apiKey, keyInfo.rateLimitPerMinute);
                this.logger.debug(`[getTokenInfo] Rate limit check passed for API Key: ${apiKey}`);
            }
            catch (error) {
                if (error instanceof rate_limit_exceeded_exception_1.RateLimitExceededException) {
                    isRateLimited = true;
                    this.logger.warn(`[getTokenInfo] Rate limit exceeded for API Key: ${apiKey}`);
                }
                throw error;
            }
            if (!tokenData) {
                this.logger.warn(`[getTokenInfo] Token data not found for symbol: ${symbol}`);
                throw new token_not_found_exception_1.TokenNotFoundException(symbol);
            }
            this.logger.debug(`[getTokenInfo] Token data found for symbol: ${symbol}`);
            isSuccessful = true;
            this.logger.log(`[getTokenInfo] Successfully retrieved token info for apiKey: ${apiKey}, symbol: ${symbol}`);
            return tokenData;
        }
        catch (error) {
            this.logger.error(`[getTokenInfo] Error in getTokenInfo for apiKey: ${apiKey}, symbol: ${symbol} - ${error.message}`, error.stack);
            errorMessage = error.message;
            throw error;
        }
        finally {
            const logEntry = {
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
            }
            catch (logError) {
                this.logger.error(`[getTokenInfo] Failed to create request log: ${logError.message}`, logError.stack);
            }
        }
    }
};
TokenInfoService = TokenInfoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [duplicated_keys_service_1.DuplicatedKeysService,
        request_logs_service_1.RequestLogsService,
        mock_tokens_service_1.MockTokensService,
        rate_limiting_service_1.RateLimitingService])
], TokenInfoService);
exports.TokenInfoService = TokenInfoService;
