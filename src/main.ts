import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    //! Pipe global para validar los datos de entrada, no se aceptan datos que no estén en el DTO
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const PORT = process.env.PORT ?? 3000;
  console.log('App corriendo en puerto:', PORT);
  await app.listen(PORT);
}
bootstrap();
