import { Inject, Injectable } from '@nestjs/common';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { DeleteArgs } from '../dto/deleteArgs';
import { TenantCompanyArgs } from '../dto/tenantCompanyRelationshipArgs';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { BaseResponse } from '../models/baseResponse';
import {
  TenantCompanyRelation,
  TenantCompanyRelationResponseUnion,
  TenantCompanyRelationUnion,
} from '../models/tenantCompanyRelation';
import { BulkCompanyArgs } from './../dto/tenantCompanyRelationshipArgs';

@Injectable()
export class TenantCompanyRelationshipService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService,
    private readonly logger: StimulusLogger
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
    this.logger.context = TenantCompanyRelationshipService.name;
  }

  setCompanyStatus(company: any, status: any) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.setCompanyStatus, {
      company,
      status,
    });
  }

  setCompanyTypeToInternal(company: any) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.setCompanyType, {
      company,
      type: controller.SupplierType.INTERNAL,
    });
  }

  bulkSetCompanyTypeToInternal(args: BulkCompanyArgs) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.bulkSetCompanyType, {
      ...args,
      type: controller.SupplierType.INTERNAL,
    });
  }

  setCompanyTypeToExternal(company: any) {
    const response = this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.setCompanyType, {
      company,
      type: controller.SupplierType.EXTERNAL,
    });
    this.setCompanyStatus(company, controller.SupplierStatus.INACTIVE);
    return response;
  }

  async searchTenantCompanyRelation(tenantCompanyRelationArgs: TenantCompanyArgs): Promise<TenantCompanyRelation[]> {
    const { companyId, ...tenantCompanyRelation } = tenantCompanyRelationArgs;

    const tenantCompanyRelationGrpcArgs: any = {
      tenantCompanyRelation,
    };

    if (typeof companyId !== 'undefined') {
      tenantCompanyRelationGrpcArgs.tenantCompanyRelation.company = { id: companyId };
    }

    const { results } = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchTenantCompanyRelation,
      tenantCompanyRelationGrpcArgs
    );

    return results || [];
  }

  createTenantCompanyRelation(tenantCompanyRelationArgs: TenantCompanyArgs): Promise<TenantCompanyRelation> {
    const { companyId, ...tenantCompanyRelationData } = tenantCompanyRelationArgs;
    const createTenantCompanyRelationArgs = companyId
      ? { ...tenantCompanyRelationData, company: { id: companyId } }
      : tenantCompanyRelationData;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createTenantCompanyRelation, {
      tenantCompanyRelation: createTenantCompanyRelationArgs,
    });
  }

  deleteTenantCompanyRelation(tenantCompanyRelationArgs: DeleteArgs): Promise<BaseResponse> {
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.deleteTenantCompanyRelation,
      tenantCompanyRelationArgs
    );
  }

  async updateTenantCompanyRelation(
    tenantCompanyRelationArgs: TenantCompanyArgs
  ): Promise<typeof TenantCompanyRelationUnion> {
    const { companyId, ...tenantCompanyRelationData } = tenantCompanyRelationArgs;
    const updateTenantCompanyRelationArgs = companyId
      ? { ...tenantCompanyRelationData, company: { id: companyId } }
      : tenantCompanyRelationData;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateTenantCompanyRelation, {
      tenantCompanyRelation: updateTenantCompanyRelationArgs,
    });
  }

  async bulkUpdateTenantCompanyRelations(args: BulkCompanyArgs): Promise<typeof TenantCompanyRelationResponseUnion> {
    const { isFavorite, companyIds } = args;
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.bulkUpdateTenantCompanyRelations,
      { companyIds, tenantCompanyRelation: { isFavorite } }
    );
  }
}
