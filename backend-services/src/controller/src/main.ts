import './tracing';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import getControllerProtoPackagePath from 'controller-proto';
import { LoggingModule } from './logging/logging.module';
import 'isomorphic-fetch';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    logger: LoggingModule.createStimulusLogger(),
  });
  app.connectMicroservice(
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:4000',
        package: 'controller',
        protoPath: getControllerProtoPackagePath('main'),
      },
    },
    { inheritAppConfig: true }
  );
  await app.startAllMicroservices();
  await app.init();
  await app.listen(4001);
};
bootstrap();
