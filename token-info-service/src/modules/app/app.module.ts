import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from '../../config/configuration';
import { TokenInfoModule } from '../token-info/token-info.module';
import { DatabaseModule } from '../database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    DatabaseModule,
    TokenInfoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}