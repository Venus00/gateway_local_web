"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const exception_filter_1 = require("./auth/filters/exception.filter");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
    });
    const microservice = app.connectMicroservice({
        transport: microservices_1.Transport.NATS,
        options: {
            servers: [`${process.env.NATS_URL}`],
        }
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('IOT Platform')
        .setDescription('API description')
        .setVersion('1.0')
        .addTag('IOT')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, documentFactory);
    app.useGlobalFilters(new exception_filter_1.TokenExpiredFilter());
    app.setGlobalPrefix('api/v1');
    app.enableCors();
    await app.startAllMicroservices();
    await app.listen(`${process.env.APP_PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map