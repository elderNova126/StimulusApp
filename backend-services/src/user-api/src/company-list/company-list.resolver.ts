import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GlobalAdminScopeGuard } from 'src/auth/global-admin-scope.guard';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { CompanyListArgs } from '../dto/companyListArgs';
import { DeleteArgs } from '../dto/deleteArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ActionResponseUnion } from '../models/baseResponse';
import { CompanyList, CompanyListResponse, CompanyListUnion } from '../models/company-list';
import { CompanySearchArgs } from './../dto/companyArgs';
import { CompanyListSearchArgs } from './../dto/companyListArgs';
import { CompaniesResponseUnion } from './../models/company';
import { CompanyListService } from './company-list.service';

@Resolver(() => CompanyList)
@UseInterceptors(GqlLoggingInterceptor)
export class CompanyListResolver {
  constructor(private readonly companyListService: CompanyListService) {}

  @Query(() => CompanyListResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  companyLists(
    @Args() companyListSearchArgs: CompanyListSearchArgs,
    @GqlUser() user
  ): Promise<typeof CompanyListResponse> {
    return this.companyListService.searchCompanyLists(companyListSearchArgs, user.sub);
  }

  @ResolveField(() => CompaniesResponseUnion)
  companies(@Args() searchCompaniesArgs: CompanySearchArgs, @Parent() companyList) {
    return companyList.companies?.length > 0
      ? this.companyListService.searchCompanies(searchCompaniesArgs, companyList.companies)
      : { results: [], count: 0 };
  }

  @ResolveField(() => CompaniesResponseUnion)
  companyIds(@Parent() companyList) {
    return companyList.companies;
  }

  @Mutation(() => CompanyListUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  createCompanyList(@Args() companyListArgs: CompanyListArgs, @GqlUser() user): Promise<typeof CompanyListUnion> {
    return this.companyListService.createCompanyList(companyListArgs, user.sub);
  }

  @Mutation(() => CompanyListUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  cloneCompanyList(@Args() companyListArgs: CompanyListArgs, @GqlUser() user): Promise<typeof CompanyListUnion> {
    return this.companyListService.cloneCompanyList(companyListArgs, user.sub);
  }

  @Mutation(() => CompanyListUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  updateCompanyList(@Args() companyListArgs: CompanyListArgs, @GqlUser() user): Promise<typeof CompanyListUnion> {
    return this.companyListService.updateCompanyList(companyListArgs, user.sub);
  }

  @Mutation(() => CompanyListUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  addToCompanyList(@Args() companyListArgs: CompanyListArgs, @GqlUser() user): Promise<typeof CompanyListUnion> {
    return this.companyListService.addToCompanyList(companyListArgs, user.sub);
  }

  @Mutation(() => CompanyListUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  removeFromCompanyList(@Args() companyListArgs: CompanyListArgs, @GqlUser() user): Promise<typeof CompanyListUnion> {
    return this.companyListService.removeFromCompanyList(companyListArgs, user.sub);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteCompanyList(@Args() deleteArgs: DeleteArgs, @GqlUser() user): Promise<typeof ActionResponseUnion> {
    return this.companyListService.deleteCompanyList(deleteArgs, user.sub);
  }
}
