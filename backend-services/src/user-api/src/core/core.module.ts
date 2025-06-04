import { Module, Global } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import getControllerProtoPackagePath from 'controller-proto';
import { ContextProviderService } from './context-provider.service';
import { CoreService } from './core.service';
import { CoreResolver } from './core.resolver';
import { controllerProto } from './proto.provider';
import { CONTROLLER_PROTO_PACKAGE_NAME, CONTROLLER_PROTO_PACKAGE_PATH } from './proto.constants';
import { controllerClientGrpcProviders } from './controller-client-grpc.providers';
import { OnDemandService } from './on-demand.service';
import { OnDemandResolver } from './on-demand.resolver';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: CONTROLLER_PROTO_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: `${process.env.CONTROLLER_HOST ? process.env.CONTROLLER_HOST : 'localhost'}:4000`,
          package: CONTROLLER_PROTO_PACKAGE_NAME,
          protoPath: getControllerProtoPackagePath(CONTROLLER_PROTO_PACKAGE_PATH),
        },
      },
    ]),
  ],
  providers: [
    ...controllerClientGrpcProviders,
    ContextProviderService,
    CoreService,
    CoreResolver,
    OnDemandService,
    OnDemandResolver,
    controllerProto,
  ],
  exports: [ContextProviderService, controllerProto, ...controllerClientGrpcProviders],
})
export class CoreModule {}
