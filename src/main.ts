// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades del body que no estén en el DTO
    forbidNonWhitelisted: false, // Tira error si mandan propiedades no permitidas
  }));

  app.enableCors({
    origin: [
      'http://localhost:4200',
      'https://progra-iv-tp-2-ramiro-bianucci-fron.vercel.app' 
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Permitir envío de cookies/headers
  });

  await app.listen(3000);
}
bootstrap();