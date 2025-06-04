import { Inject, Injectable } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { AccountInfoResponseUnion } from '../models/accountInfo';
import { UserProfileArgs } from './../auth/dto/userProfileArgs';

@Injectable()
export class TenantService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService,
    private readonly logger: StimulusLogger
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
    this.logger.context = TenantService.name;
  }

  async getUserTenants(user: UserProfileArgs): Promise<Record<string, any>> {
    const result = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getUserTenants,
      user
    );

    return result.tenants || [];
  }

  createTenant(externalAuthSystemId: string, companyTenantArgs: any, userAccountArgs: any) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createTenant, {
      user: { externalAuthSystemId },
      company: companyTenantArgs,
      account: userAccountArgs,
    });
  }

  accountInfo(): Promise<typeof AccountInfoResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getAccountInfo, {});
  }
}
