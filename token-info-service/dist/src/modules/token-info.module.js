"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInfoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const token_info_controller_1 = require("../controllers/token-info.controller");
const token_info_service_1 = require("../services/token-info.service");
const duplicated_keys_service_1 = require("../services/duplicated-keys.service");
const request_logs_service_1 = require("../services/request-logs.service");
const mock_tokens_service_1 = require("../services/mock-tokens.service");
const rate_limiting_service_1 = require("../services/rate-limiting.service");
const access_key_subscriber_service_1 = require("../services/access-key-subscriber.service");
const duplicated_access_key_entity_1 = require("../entities/duplicated-access-key.entity");
const request_log_entity_1 = require("../entities/request-log.entity");
const mock_token_entity_1 = require("../entities/mock-token.entity");
const redis_module_1 = require("./redis.module");
const duplicated_access_key_repository_1 = require("../shared/repositories/duplicated-access-key.repository");
let TokenInfoModule = class TokenInfoModule {
};
TokenInfoModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                duplicated_access_key_entity_1.DuplicatedAccessKey,
                request_log_entity_1.RequestLog,
                mock_token_entity_1.MockToken,
            ]),
            redis_module_1.RedisModule,
        ],
        controllers: [token_info_controller_1.TokenInfoController],
        providers: [
            token_info_service_1.TokenInfoService,
            duplicated_keys_service_1.DuplicatedKeysService,
            request_logs_service_1.RequestLogsService,
            mock_tokens_service_1.MockTokensService,
            rate_limiting_service_1.RateLimitingService,
            access_key_subscriber_service_1.AccessKeySubscriberService,
            duplicated_access_key_repository_1.DuplicatedAccessKeyRepository,
        ],
        exports: [
            token_info_service_1.TokenInfoService,
            duplicated_keys_service_1.DuplicatedKeysService,
            request_logs_service_1.RequestLogsService,
            mock_tokens_service_1.MockTokensService,
            rate_limiting_service_1.RateLimitingService,
            access_key_subscriber_service_1.AccessKeySubscriberService,
        ],
    })
], TokenInfoModule);
exports.TokenInfoModule = TokenInfoModule;
