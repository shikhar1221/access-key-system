import { NestFactory } from '@nestjs/core';
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
    .addTag('access-keys', 'Operations related to access keys') // Example tag
    // .addBearerAuth() // Uncomment if you have JWT authentication
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI will be available at /api-docs

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT || 3000); // Use environment variable for port
}
bootstrap();