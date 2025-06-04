import { Scope } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ControllerGrpcClientService } from './controller-client-grpc.service';
import { CONTROLLER_PROTO, CONTROLLER_PROTO_PACKAGE_NAME, ProtoServices, ServicesMapping } from './proto.constants';
import { ContextProviderService } from './context-provider.service';
import { RequestIdService } from './request-id.service';

export const controllerClientGrpcProviders = [
  {
    provide: ServicesMapping[ProtoServices.DISCOVERY],
    scope: Scope.REQUEST,
    useFactory: (
      contextProviderService: ContextProviderService,
      requestIdService: RequestIdService,
      clientGrpc: ClientGrpc,
      controllerProtoConfig
    ) => {
      const { serviceName, serviceMethods } = controllerProtoConfig.services.discovery;
      return new ControllerGrpcClientService(
        contextProviderService,
        requestIdService,
        clientGrpc,
        serviceName,
        serviceMethods
      );
    },
    inject: [ContextProviderService, RequestIdService, CONTROLLER_PROTO_PACKAGE_NAME, CONTROLLER_PROTO],
  },
  {
    provide: ServicesMapping[ProtoServices.DATA],
    scope: Scope.REQUEST,
    useFactory: (
      contextProviderService: ContextProviderService,
      requestIdService: RequestIdService,
      clientGrpc: ClientGrpc,
      controllerProtoConfig
    ) => {
      const { serviceName, serviceMethods } = controllerProtoConfig.services.data;
      return new ControllerGrpcClientService(
        contextProviderService,
        requestIdService,
        clientGrpc,
        serviceName,
        serviceMethods
      );
    },
    inject: [ContextProviderService, RequestIdService, CONTROLLER_PROTO_PACKAGE_NAME, CONTROLLER_PROTO],
  },
];
