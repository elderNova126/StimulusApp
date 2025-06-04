import { NestFactory } from '@nestjs/core';

import './tracing';
import { AppModule } from './app.module';
import { LoggingModule } from './logging/logging.module';
import { AllExceptionsFilter } from './exception-filter/app-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggingModule.createStimulusLogger(),
  });
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();
