// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades del body que no estén en el DTO
    forbidNonWhitelisted: true, // Tira error si mandan propiedades no permitidas
  }));

  app.enableCors({
    // Reemplazá este string por la URL real que te dio Vercel para tu frontend
    origin: [
      'http://localhost:4200',
      'https://progra-iv-tp-2-ramiro-bianucci-fron.vercel.app' 
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Permitir envío de cookies/headers de autenticación si hiciera falta
  });

  await app.listen(3000);
}
bootstrap();