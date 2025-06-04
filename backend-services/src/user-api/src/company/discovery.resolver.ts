import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { CompanyDiscoveryArgs, CountCompaniesByListArgs } from '../dto/companyArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import {
  CompaniesResponseUnion,
  Company,
  CompanyProjectsOverview,
  CountCompaniesResponseUnion,
} from '../models/company';
import { COMPANY_DISCOVERY_MAP_VIEW, COMPANY_DISVOERY_LIST_VIEW } from './company-discovery.constants';
import { CompanyDiscoveryService } from './company-discovery.service';
import { companyTypeMiddleware } from './company.middleware';
import { CompanyService } from './company.service';

@Resolver(() => Company)
@UseInterceptors(GqlLoggingInterceptor)
export class CompanyDiscoveryResolver {
  constructor(
    private readonly companyDiscoveryService: CompanyDiscoveryService,
    private readonly companyService: CompanyService
  ) {}

  @Query(() => CompaniesResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async discoverCompanies(@Args() companyDiscoveryArgs: CompanyDiscoveryArgs): Promise<typeof CompaniesResponseUnion> {
    return this.companyDiscoveryService.discoverCompanies(companyDiscoveryArgs, COMPANY_DISVOERY_LIST_VIEW);
  }

  @Query(() => CompaniesResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async discoverCompaniesMap(
    @Args() companyDiscoveryArgs: CompanyDiscoveryArgs
  ): Promise<typeof CompaniesResponseUnion> {
    const res = await this.companyDiscoveryService.discoverCompanies(companyDiscoveryArgs, COMPANY_DISCOVERY_MAP_VIEW);
    return res;
  }

  @Query(() => CountCompaniesResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async countCompaniesByList(
    @Args() companyByListArgs: CountCompaniesByListArgs
  ): Promise<typeof CountCompaniesResponseUnion> {
    return this.companyDiscoveryService.countCompaniesByList(companyByListArgs);
  }

  @ResolveField(() => CompanyProjectsOverview, { middleware: [companyTypeMiddleware] })
  projectsOverview(@Parent() company) {
    return this.companyService.getProjectsOverview(company.id);
  }
}
