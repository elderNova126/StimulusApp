import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { TenantScopeGuard } from 'src/auth/tenant-scope.guard';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { DeleteArgs } from '../dto/deleteArgs';
import { TenantCompanyArgs } from '../dto/tenantCompanyRelationshipArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { BaseResponse } from '../models/baseResponse';
import { TenantCompanyRelation, TenantCompanyRelationUnion } from '../models/tenantCompanyRelation';
import { BulkCompanyArgs } from './../dto/tenantCompanyRelationshipArgs';
import { TenantCompanyRelationResponse, TenantCompanyRelationResponseUnion } from './../models/tenantCompanyRelation';
import { TenantCompanyRelationshipService } from './tenant-company-relationship.service';

@Resolver('TenantCompanyRelation')
@UseInterceptors(GqlLoggingInterceptor)
export class TenantCompanyRelationshipResolver {
  constructor(private tenantCompanyRelationshipService: TenantCompanyRelationshipService) {}

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async setCompanyActive(@Args() tenantCompanyStatusArgs: TenantCompanyArgs) {
    const { companyId } = tenantCompanyStatusArgs;
    const company = { id: companyId };
    const res = await this.tenantCompanyRelationshipService.setCompanyStatus(company, controller.SupplierStatus.ACTIVE);
    return res && res.success;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async setCompanyInactive(@Args() tenantCompanyStatusArgs: TenantCompanyArgs) {
    const { companyId } = tenantCompanyStatusArgs;
    const company = { id: companyId };
    const res = await this.tenantCompanyRelationshipService.setCompanyStatus(
      company,
      controller.SupplierStatus.INACTIVE
    );
    return res && res.success;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async setCompanyArchived(@Args() tenantCompanyStatusArgs: TenantCompanyArgs) {
    const { companyId } = tenantCompanyStatusArgs;
    const company = { id: companyId };
    const res = await this.tenantCompanyRelationshipService.setCompanyStatus(
      company,
      controller.SupplierStatus.ARCHIVED
    );
    return res && res.success;
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async setCompanyTypeToInternal(@Args() tenantCompanyTypeArgs: TenantCompanyArgs) {
    const { companyId } = tenantCompanyTypeArgs;
    const company = { id: companyId };
    const response = await this.tenantCompanyRelationshipService.setCompanyTypeToInternal(company);

    return response.error ? false : true;
  }

  @Mutation(() => TenantCompanyRelationResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async bulkSetCompanyTypeToInternal(@Args() tenantCompanyTypeArgs: BulkCompanyArgs) {
    return this.tenantCompanyRelationshipService.bulkSetCompanyTypeToInternal(tenantCompanyTypeArgs);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  async setCompanyTypeToExternal(@Args() tenantCompanyTypeArgs: TenantCompanyArgs) {
    const { companyId } = tenantCompanyTypeArgs;
    const company = { id: companyId };
    const res = await this.tenantCompanyRelationshipService.setCompanyTypeToExternal(company);

    return res && res.success;
  }

  @Query(() => [TenantCompanyRelation])
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  tenantCompanyRelation(@Args() tenantCompanyRelationArgs: TenantCompanyArgs): Promise<TenantCompanyRelation[]> {
    return this.tenantCompanyRelationshipService.searchTenantCompanyRelation(tenantCompanyRelationArgs);
  }

  @Mutation(() => TenantCompanyRelation)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  createTenantCompanyRelation(@Args() tenantCompanyRelationArgs: TenantCompanyArgs): Promise<TenantCompanyRelation> {
    return this.tenantCompanyRelationshipService.createTenantCompanyRelation(tenantCompanyRelationArgs);
  }

  @Mutation(() => BaseResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  deleteTenantCompanyRelation(@Args() deleteArgs: DeleteArgs) {
    return this.tenantCompanyRelationshipService.deleteTenantCompanyRelation(deleteArgs);
  }

  @Mutation(() => TenantCompanyRelationUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  updateTenantCompanyRelation(
    @Args() tenantCompanyRelationArgs: TenantCompanyArgs
  ): Promise<typeof TenantCompanyRelationUnion> {
    return this.tenantCompanyRelationshipService.updateTenantCompanyRelation(tenantCompanyRelationArgs);
  }

  @Mutation(() => TenantCompanyRelationResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  bulkUpdateTenantCompanyRelations(
    @Args() bulkArgs: BulkCompanyArgs
  ): Promise<typeof TenantCompanyRelationResponseUnion> {
    return this.tenantCompanyRelationshipService.bulkUpdateTenantCompanyRelations(bulkArgs);
  }
}
