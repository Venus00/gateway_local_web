"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const exception_filter_1 = require("./auth/filters/exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
    });
    app.useGlobalFilters(new exception_filter_1.TokenExpiredFilter());
    app.setGlobalPrefix('api/v1');
    app.enableCors();
    await app.startAllMicroservices();
    await app.listen(`${process.env.APP_PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map