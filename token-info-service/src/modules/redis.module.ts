import { Module, Global } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis'; // Updated import path

@Global()
@Module({
  imports: [
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  // No custom RedisService needed, export the client directly
  exports: [NestRedisModule],
})
export class RedisModule {}