import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { ConfigModule } from '@nestjs/config';
import config from '../config/configuration';
import { validationSchema } from '../config/validationSchema';
import { TokenInfoModule } from './token-info.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema,
    }),
    DatabaseModule,
    TokenInfoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}