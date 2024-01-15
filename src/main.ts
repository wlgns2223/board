import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ServiceExceptionHttpFilter } from './common/filter/serviceExceptionHttpFilter';

export const logger = new Logger('global');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new ServiceExceptionHttpFilter());
  const port = 4000;
  await app.listen(port);
  logger.log(`port: ${port}`);
}
bootstrap();
