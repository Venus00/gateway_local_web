import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TokenExpiredFilter } from './auth/filters/exception.filter';
async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalFilters(new TokenExpiredFilter());
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(`${process.env.APP_PORT}`);
}
bootstrap();

