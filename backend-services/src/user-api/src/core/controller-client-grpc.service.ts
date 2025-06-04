/* eslint-disable no-underscore-dangle */
import { ClientGrpc } from '@nestjs/microservices';
import { GraphQLError } from 'graphql';
import { Metadata } from '@grpc/grpc-js';
import { promisify } from 'util';
import { ContextProviderService } from './context-provider.service';
import { RequestIdService } from './request-id.service';

abstract class GrpcClientService {
  protected clientService: any;
  protected setClientService(clientGrpc: ClientGrpc, tenantServiceName: string) {
    this.clientService = clientGrpc.getClientByServiceName<any>(tenantServiceName);
  }

  protected _serviceMethods: any;
  get serviceMethods(): any {
    return this._serviceMethods;
  }

  /**
   *
   * @param {string} procedureName Grpc service method name
   * @param {Object} args procedure args
   */
  abstract callProcedure(procedureName: string, args: any): Promise<any>;
}

export enum GrpcStatus {
  OK = 0,
  CANCELLED = 1,
  UNKNOWN = 2,
  INVALID_ARGUMENT = 3,
  DEADLINE_EXCEEDED = 4,
  NOT_FOUND = 5,
  ALREADY_EXISTS = 6,
  PERMISSION_DENIED = 7,
  RESOURCE_EXHAUSTED = 8,
  FAILED_PRECONDITION = 9,
  ABORTED = 10,
  OUT_OF_RANGE = 11,
  UNIMPLEMENTED = 12,
  INTERNAL = 13,
  UNAVAILABLE = 14,
  DATA_LOSS = 15,
  UNAUTHENTICATED = 16,
}

export class ControllerGrpcClientService extends GrpcClientService {
  constructor(
    private contextProviderService: ContextProviderService,
    private requestIdService: RequestIdService,
    clientGrpc: ClientGrpc,
    serviceName: string,
    serviceMethods: any
  ) {
    super();
    this.setClientService(clientGrpc, serviceName);
    // eslint-disable-next-line no-underscore-dangle
    this._serviceMethods = serviceMethods;
  }
  callProcedure(procedureName: string, args: any): Promise<any> {
    const grpcMethod = promisify<any, any>(this.clientService[procedureName]).bind(this.clientService);
    const metadata = new Metadata();
    metadata.set('requestId', this.requestIdService.getRequestId());
    const scopeContext = this.contextProviderService.getScopeContext();
    if (scopeContext && scopeContext.tenantId) {
      metadata.set('tenant', scopeContext.tenantId);
    }
    const userContext = this.contextProviderService.getUserContext();
    if (userContext?.sub) {
      metadata.set('user', userContext.sub);
    }
    return grpcMethod(args, metadata).catch((err) => {
      const { code, details } = err;
      if (code in GrpcStatus) {
        throw new GraphQLError(`${code} : ${details}`, null, null, null, null, null, {
          code: GrpcStatus[code],
          details,
        });
      }
      throw new Error(`${code} : ${details}`);
    });
  }
}
