import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenInfoController } from './token-info.controller';
import { TokenInfoService } from './services/token-info.service';
import { DuplicatedKeysService } from './services/duplicated-keys.service';
import { RequestLogsService } from './services/request-logs.service';
import { MockTokensService } from './services/mock-tokens.service';
import { RateLimitingService } from './services/rate-limiting.service';
import { AccessKeySubscriberService } from './services/access-key-subscriber.service';
import { DuplicatedAccessKey } from '../../entities/duplicated-access-key.entity';
import { RequestLog } from '../../entities/request-log.entity';
import { MockToken } from '../../entities/mock-token.entity';
import { RedisModule } from '../redis.module'; // Assuming a shared RedisModule exists
import { DuplicatedAccessKeyRepository } from '../../shared/repositories/duplicated-access-key.repository'; // Import the custom repository

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      DuplicatedAccessKey, // Entity
      RequestLog,
      MockToken,
    ]),
    RedisModule,
  ],
  controllers: [TokenInfoController],
  providers: [
    TokenInfoService,
    DuplicatedKeysService,
    RequestLogsService,
    MockTokensService,
    RateLimitingService,
    AccessKeySubscriberService,
    DuplicatedAccessKeyRepository,
  ],
  exports: [
    TokenInfoService, // Export services if they need to be used by other modules
    DuplicatedKeysService,
    RequestLogsService,
    MockTokensService,
    RateLimitingService,
    AccessKeySubscriberService,
  ],
})
export class TokenInfoModule {}