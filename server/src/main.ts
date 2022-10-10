import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { json } from 'body-parser';
import { AppModule } from './app.module';
import { ConstraintExceptionFilter } from './filter/constraint-exception.filter';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { FormDataPipe } from './pipes/form-data.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableShutdownHooks();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ConstraintExceptionFilter());
  app.useGlobalPipes(new FormDataPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.use(json({ limit: '10mb' }));
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
