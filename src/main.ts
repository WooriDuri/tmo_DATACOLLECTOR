import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';

const fs = require('fs');
async function bootstrap() {
  const options = {};
  // const app = await NestFactory.create(AppModule);
  if (process.env.LOCAL === 'true') {
    options['httpsOptions'] = {
      key: fs.readFileSync('.cert/key.pem', 'utf-8'),
      cert: fs.readFileSync('.cert/cert.pem', 'utf-8'),
    };
  }
  const app = await NestFactory.create(AppModule, options);
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: ['*'],
    allowedHeaders: ['Content-Type', 'Authorization', 'cookies'],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
