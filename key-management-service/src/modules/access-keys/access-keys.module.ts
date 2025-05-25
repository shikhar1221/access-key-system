import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessKey } from './entities/access-key.entity';
import { AccessKeyRepository } from './repositories/access-key.repository';
import { AccessKeysService } from './services/access-keys.service';
import { AccessKeyPublisherService } from './services/access-key-publisher.service';
import { AccessKeysController } from './controllers/access-keys.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessKey]),
  ],
  providers: [
    AccessKeysService, 
    AccessKeyPublisherService, 
    AccessKeyRepository,
    Logger
  ],
  controllers: [AccessKeysController],
  exports: [AccessKeysService],
})
export class AccessKeysModule {}