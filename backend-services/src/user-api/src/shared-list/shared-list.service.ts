import { Inject, Injectable } from '@nestjs/common';
import { ControllerGrpcClientService } from 'src/core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from 'src/core/proto.constants';
import { SharedListArgs } from 'src/dto/sharedListArgs';
import { CollaboratorsResult } from '../../src/auth/models/user-profile-result';
import { SharedListResponseUnion, SharedListUnion } from 'src/models/SharedLists';

@Injectable()
export class SharedListService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  async GetSharedList(): Promise<typeof SharedListResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getSharedList, {});
  }

  getCollaboratorsList(args: SharedListArgs): Promise<typeof CollaboratorsResult> {
    const tenant = args.tenantId ? { tenant: { id: args.tenantId } } : null;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getCollaboratorsList, {
      listId: args.listId,
      ...tenant,
    });
  }

  createSharedList(sharedListArgs: SharedListArgs): Promise<typeof SharedListUnion> {
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.createdSharedList,
      sharedListArgs
    );
  }

  changeSharedList(sharedListArgs: SharedListArgs): Promise<typeof SharedListUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.changeStatus, sharedListArgs);
  }
}
