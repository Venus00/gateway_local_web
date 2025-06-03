import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TokenExpiredFilter } from './auth/filters/exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'express';
async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });


  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [`${process.env.NATS_URL}`],
    }
  });
  const config = new DocumentBuilder()
    .setTitle('IOT Platform')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('IOT')
    .build();


  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.useGlobalFilters(new TokenExpiredFilter());
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(`${process.env.APP_PORT}`);
}
bootstrap();

