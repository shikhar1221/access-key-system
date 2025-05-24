import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessKey } from './entities/access-key.entity';
import { AccessKeyRepository } from './repositories/access-key.repository';
import { AccessKeysService } from './services/access-keys.service';
import { AccessKeyPublisherService } from './services/access-key-publisher.service';
import { AccessKeysController } from './controllers/access-keys.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccessKey]), // Add AccessKeyRepository here for TypeORM 0.2.x
  ],
  providers: [
    AccessKeysService, 
    AccessKeyPublisherService, 
    AccessKeyRepository,
    Logger // Add Logger here
    // AccessKeyRepository is now provided by TypeOrmModule
  ],
  controllers: [AccessKeysController],
  exports: [AccessKeysService], // Export if other modules need this service
})
export class AccessKeysModule {}