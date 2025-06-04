import { InternalEventService } from './../event/internal-event.service';
import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TenantCompanyRelationshipService } from './tenant-company-relationship.service';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import {
  SupplierStatusMapping,
  SupplierTypeMapping,
  TenantCompanyRelationship,
} from './tenant-company-relationship.entity';
import { EventCode } from 'src/event/event-code.enum';

@Controller('tenant-company-relationship')
@UseFilters(GrpcExceptionFilter)
export class TenantCompanyRelationshipController {
  constructor(
    private readonly tenantCompanyRelationshipService: TenantCompanyRelationshipService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private eventService: InternalEventService
  ) {}

  @GrpcMethod('DataService', 'SetCompanyStatus')
  async setCompanyStatus(data: any): Promise<any> {
    const { company, status } = data;
    const tenantId = this.reqContextResolutionService.getTenantId();
    const success = await this.tenantCompanyRelationshipService.setCompanyStatus(
      tenantId,
      company,
      SupplierStatusMapping[status]
    );
    if (success) {
      await this.eventService.dispatchInternalEvent({
        code: EventCode.UPDATE_COMPANY_STATUS,
        data: { company, status: SupplierStatusMapping[status] },
      });
    }
    return { success };
  }

  @GrpcMethod('DataService', 'SetCompanyType')
  async setCompanyType(data: any): Promise<any> {
    const { company, type } = data;
    const tenantId = this.reqContextResolutionService.getTenantId();
    const response = await this.tenantCompanyRelationshipService.setCompanyType(
      tenantId,
      [company.id],
      SupplierTypeMapping[type]
    );
    await this.eventService.dispatchInternalEvent({
      code: EventCode.UPDATE_COMPANY_TYPE,
      data: { company, type: SupplierTypeMapping[type] },
    });

    return response;
  }

  @GrpcMethod('DataService', 'BulkSetCompanyType')
  async bulkSetCompanyType(data: any): Promise<any> {
    const { companyIds, type } = data;

    const tenantId = this.reqContextResolutionService.getTenantId();
    const response = await this.tenantCompanyRelationshipService.setCompanyType(
      tenantId,
      companyIds,
      SupplierTypeMapping[type]
    );

    await this.eventService.dispatchInternalEvents(
      companyIds.map((id: string) => ({
        code: EventCode.UPDATE_COMPANY_TYPE,
        data: {
          company: { id },
          type: SupplierTypeMapping[type],
        },
      }))
    );

    return { results: response };
  }

  @GrpcMethod('DataService', 'SearchTenantCompanyRelation')
  async searchTenantCompanyRelation(data: any): Promise<any> {
    const tenantId = this.reqContextResolutionService.getTenantId();
    data.tenantCompanyRelation.tenant = { id: tenantId };
    const results = await this.tenantCompanyRelationshipService.getTenantCompanyRelation(data.tenantCompanyRelation);
    return { results };
  }

  @GrpcMethod('DataService', 'GetCompanyProjectOverview')
  async getCompanyProjectOverview(data: any): Promise<any> {
    return this.tenantCompanyRelationshipService.getOverviewProjects(data);
  }

  @GrpcMethod('DataService', 'CreateTenantCompanyRelation')
  async createTenantCompanyRelation(data: any): Promise<TenantCompanyRelationship> {
    return this.tenantCompanyRelationshipService.createTenantCompanyRelation(data.tenantCompanyRelation);
  }

  @GrpcMethod('DataService', 'UpdateTenantCompanyRelation')
  async updateTenantCompanyRelation(data: any): Promise<TenantCompanyRelationship> {
    const { id, ...rest } = data.tenantCompanyRelation;
    return this.tenantCompanyRelationshipService.updateTenantCompanyRelation(id, rest);
  }

  @GrpcMethod('DataService', 'BulkUpdateTenantCompanyRelations')
  async bulkUpdateTenantCompanyRelations(data: any): Promise<{ results: TenantCompanyRelationship[] }> {
    return { results: await this.tenantCompanyRelationshipService.bulkUpdateTenantCompanyRelations(data) };
  }

  @GrpcMethod('DataService', 'DeleteTenantCompanyRelation')
  async deleteTenantCompanyRelation(data: any): Promise<any> {
    const res = await this.tenantCompanyRelationshipService.deleteTenantCompanyRelation(data.id);

    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'TriggerRelationUpdate')
  async triggerRelationUpdate(_data: any): Promise<any> {
    return this.tenantCompanyRelationshipService.updateRelationStats();
  }
}
