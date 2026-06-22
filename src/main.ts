// main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activamos la validación automática global para todos los endpoints
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();