import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TenantArgs } from '../auth/dto/tenantArgs';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { TenantScopeGuard } from '../auth/tenant-scope.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { AccountInfoResponseUnion } from '../models/accountInfo';
import { Tenant } from './../models/tenant';
import { TenantService } from './tenant.service';

@Resolver(() => Tenant)
@UseInterceptors(GqlLoggingInterceptor)
export class TenantResolver {
  constructor(private tenantService: TenantService) {}

  @Query(() => [Tenant])
  @UseGuards(GqlAuthGuard)
  userTenants(@GqlUser() user) {
    return this.tenantService.getUserTenants({ externalAuthSystemId: user.sub });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async createTenant(@Args() tenantArgs: TenantArgs, @GqlUser() user) {
    const { name, departmentName, ein, duns, ...account } = tenantArgs;
    const company = { name, departmentName, ein, duns };
    const res = await this.tenantService.createTenant(user.sub, company, account);

    return res && res.created;
  }

  @Query(() => AccountInfoResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async accountInfo(): Promise<typeof AccountInfoResponseUnion> {
    return await this.tenantService.accountInfo();
  }
}
