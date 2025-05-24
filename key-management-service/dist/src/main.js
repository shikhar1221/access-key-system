"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const all_exceptions_filter_1 = require("./shared/filters/all-exceptions.filter");
const app_module_1 = require("./modules/app/app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Key Management Service API')
        .setDescription('API documentation for the Key Management Service')
        .setVersion('1.0')
        .addTag('access-keys', 'Operations related to access keys')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.enableShutdownHooks();
    await app.listen(process.env.PORT || 5000);
}
bootstrap();
//# sourceMappingURL=main.js.map