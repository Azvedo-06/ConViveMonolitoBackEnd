import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão definidas no DTO
      forbidNonWhitelisted: true, // Lança um erro se houver propriedades não definidas no DTO
      transform: true, // Transforma os tipos de dados automaticamente com base nas definições do DTO
    }),
  );

  await app.listen(configService.get('PORT') || 3000); // Usa a variável de ambiente PORT ou 3000 como padrão
}
bootstrap();
