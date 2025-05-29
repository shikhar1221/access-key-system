import { NestFactory } from '@nestjs/core';
import * as crypto from 'crypto';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';
import { AppModule } from './modules/app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Added Swagger imports

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Key Management Service API')
    .setDescription('API documentation for the Key Management Service')
    .setVersion('1.0')
    .addTag('access-keys', 'Operations related to access keys')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableShutdownHooks(); // Enable graceful shutdown
  await app.listen(process.env.PORT || 5000);
}
bootstrap();