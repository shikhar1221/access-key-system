import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from '../../config/configuration';
import { validationSchema } from '../../config/validationSchema';
import { AccessKeysModule } from '../access-keys/access-keys.module';
import { DatabaseModule } from '../database/database.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema,
    }),
    DatabaseModule, // Add DatabaseModule here
    RedisModule, // Import RedisModule
    AccessKeysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}