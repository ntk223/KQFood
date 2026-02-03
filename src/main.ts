import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);

  const prefix = configService.get('app.prefix');
  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(
  new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  const port = configService.get('app.port');
  const host = configService.get('app.host');
  await app.listen(port);
  console.log(`App is running on: http://${host}:${port}`);
}
bootstrap();
