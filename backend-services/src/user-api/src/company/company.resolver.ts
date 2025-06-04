import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CompanyNotesResponseUnion } from 'src/models/company-note';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { TenantScopeGuard } from '../auth/tenant-scope.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { CertificationSearchArgs } from '../dto/certificationArgs';
import {
  CompanyActivityLogArgs,
  CompanyArgs,
  CompanyDiscoveryArgs,
  CompanySearchArgs,
  CompanyUpdateArgs,
  InternalCompaniesDashboardArgs,
  UnusedCompanySearchArgs,
} from '../dto/companyArgs';
import { ContactSearchArgs } from '../dto/contactArgs';
import { ContingencySearchArgs } from '../dto/contingencyArgs';
import { DataPointSearchArgs } from '../dto/dataPointArgs';
import { DeleteCompanyArgs } from '../dto/deleteArgs';
import { InsuranceSearchArgs } from '../dto/insuranceArgs';
import { LocationSearchArgs } from '../dto/locationArgs';
import { NoteSearchArgs } from '../dto/noteArgs';
import { ProductSearchArgs } from '../dto/productArgs';
import { ProjectSearchArgs } from '../dto/projectArgs';
import { StimulusScoreSearchArgs } from '../dto/stimulusScoreArgs';
import { TracingArgs } from '../dto/tracingArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { BaseResponse } from '../models/baseResponse';
import { CertificationResultUnion } from '../models/certification';
import {
  CompaniesResponseUnion,
  Company,
  CompanyByTaxIdResponse,
  CompanyProjectsOverview,
  CompanyUnion,
  InternalCompaniesDashboardResponse,
  MinorityOwnership,
} from '../models/company';
import { ContactResponseUnion } from '../models/contact';
import { ContingencyResponseUnion } from '../models/contingency';
import { EventsResponseUnion } from '../models/event';
import { InsuranceResponseUnion } from '../models/insurance';
import { LocationResponseUnion } from '../models/location';
import { ProductResponseUnion } from '../models/product';
import {
  CompanyDiverseOwnership,
  CompanySubsetResponse,
  CompanyTags,
  CompanyMinorityOwnership,
} from './../models/company';
import { CompanyService } from './company.service';

@Resolver(() => Company)
@UseInterceptors(GqlLoggingInterceptor)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Query(() => CompaniesResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  searchCompanies(@Args() companySearchArgs: CompanySearchArgs): Promise<typeof CompaniesResponseUnion> {
    return this.companyService.searchCompanies(companySearchArgs);
  }
  @Query(() => CompaniesResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async searchCompanyById(
    @Args({ name: 'id', type: () => String }) id: string
  ): Promise<typeof CompaniesResponseUnion> {
    const result = await this.companyService.searchCompanyById(id);
    return result;
  }

  @Query(() => CompanySubsetResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  searchCompaniesSubset(@Args({ name: 'query', type: () => String }) query: string): Promise<CompanySubsetResponse> {
    return this.companyService.searchCompaniesSubset(query);
  }

  @Query(() => CompanyByTaxIdResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  searchCompaniesByTaxId(@Args({ name: 'query', type: () => String }) query: string): Promise<CompanyByTaxIdResponse> {
    return this.companyService.searchCompaniesByTaxId(query);
  }

  @Query(() => CompanyTags)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async getCompanyDistinctTags(): Promise<any> {
    const result = await this.companyService.getDistinctTags();
    return result;
  }

  @Query(() => CompanyTags)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async filterCompanyTag(@Args({ name: 'tag', type: () => String }) tag: string): Promise<any> {
    const result = await this.companyService.filterCompanyTag(tag);
    return result;
  }

  @Query(() => CompanyDiverseOwnership)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  getCompanyDistinctDiverseOwnership(): Promise<any> {
    return this.companyService.getDistinctDiverseOwnership();
  }

  @Query(() => CompanyMinorityOwnership)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  getCompanyMinoritiesDiverseOwnership(): Promise<any> {
    return this.companyService.getDistinctMinoritiesOwnership();
  }

  @Query(() => [MinorityOwnership])
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  getMinorityOwnership(): Promise<any> {
    return this.companyService.getMinorityOwnership();
  }

  @Query(() => EventsResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  companyActivityLog(@Args() projectActivityArgs: CompanyActivityLogArgs): Promise<typeof EventsResponseUnion> {
    return this.companyService.getActivityLog(projectActivityArgs);
  }

  @ResolveField()
  async news(@Parent() company) {
    try {
      const companyName = company?.legalBusinessName || company?.doingBusinessAs;
      if (!companyName) {
        throw new Error('Error trying to retrieve news: company does not have a name set');
      }
      const response = await this.companyService.searchNews(companyName);
      return response;
    } catch (error) {
      return [];
    }
  }

  @ResolveField()
  async parentCompany(@Parent() company) {
    if (typeof company.parentCompanyTaxId !== 'undefined') {
      const response = await this.companyService.searchCompanies({
        taxIdNo: company.parentCompanyTaxId,
      } as CompanyArgs);
      return response.count ? response.results[0] : null;
    } else if (typeof company?.parentCompany?.id !== 'undefined') {
      const response = await this.companyService.searchCompanies({ id: company.parentCompany.id } as CompanyArgs);
      return response.count ? response.results[0] : null;
    }
  }

  @ResolveField()
  projects(@Args() projectArgs: ProjectSearchArgs, @Parent() company) {
    return this.companyService.searchProjects(company.id, projectArgs);
  }

  @ResolveField(() => ContactResponseUnion)
  contacts(@Args() contactSearchArgs: ContactSearchArgs, @Parent() company) {
    return this.companyService.searchContacts(company.id, contactSearchArgs);
  }

  @ResolveField(() => ProductResponseUnion)
  products(@Args() productSearchArgs: ProductSearchArgs, @Parent() company) {
    return this.companyService.searchProducts(company.id, productSearchArgs);
  }

  @ResolveField(() => CompanyProjectsOverview)
  projectsOverview(@Parent() company) {
    return this.companyService.getProjectsOverview(company.id);
  }

  @ResolveField(() => InsuranceResponseUnion)
  insuranceCoverage(@Args() insuranceSearchArgs: InsuranceSearchArgs, @Parent() company) {
    return this.companyService.searchInsurances(company.id, insuranceSearchArgs);
  }

  @ResolveField(() => LocationResponseUnion)
  locations(@Args() locationSearchArgs: LocationSearchArgs, @Parent() company) {
    return this.companyService.searchLocations(company.id, locationSearchArgs);
  }

  @ResolveField(() => CertificationResultUnion)
  certifications(@Args() certificationSearchArgs: CertificationSearchArgs, @Parent() company) {
    return this.companyService.searchCertifications(company.id, certificationSearchArgs);
  }

  @ResolveField(() => ContingencyResponseUnion)
  contingencies(@Args() contingencySearchArgs: ContingencySearchArgs, @Parent() company) {
    return this.companyService.searchContingencies({ ...contingencySearchArgs, companyId: company.id });
  }

  @ResolveField(() => CompanyNotesResponseUnion)
  notes(@Args() noteSearchArgs: NoteSearchArgs, @Parent() company) {
    return this.companyService.searchNotes({ ...noteSearchArgs, companyId: company.id });
  }

  @ResolveField()
  stimulusScore(@Args() stimulusScoreSearchArgs: StimulusScoreSearchArgs, @Parent() company) {
    if (company.latestScore) return { count: 1, results: [company.latestScore] };
    return this.companyService.searchStimulusScores({ ...stimulusScoreSearchArgs, companyId: company.id });
  }

  @ResolveField()
  dataPoints(@Args() dataPointSearchArgs: DataPointSearchArgs, @Parent() company) {
    return this.companyService.searchDataPoints({ ...dataPointSearchArgs, companyId: company.id });
  }

  @ResolveField()
  evaluations(@Parent() company) {
    const evaluations = company.evaluations;
    return evaluations;
  }

  @ResolveField()
  async diverseOwnership(@Parent() company) {
    return company.diverseOwnership ?? [];
  }

  @Mutation(() => CompanyUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  createCompany(@Args() companyArgs: CompanyArgs): Promise<typeof CompanyUnion> {
    return this.companyService.createCompany(companyArgs);
  }

  @Mutation(() => BaseResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteCompany(@Args() deleteArgs: DeleteCompanyArgs) {
    return this.companyService.deleteCompany(deleteArgs);
  }

  @Mutation(() => CompanyUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async updateCompany(
    @Args() companyArgs: CompanyUpdateArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof CompanyUnion> {
    return this.companyService.updateCompany(companyArgs, tracingArgs, user.sub);
  }

  @Query(() => CompaniesResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  searchUnusedCompanies(
    @Args() unusedCompanySearchArgs: UnusedCompanySearchArgs
  ): Promise<typeof CompaniesResponseUnion> {
    return this.companyService.searchUnusedCompanies(unusedCompanySearchArgs);
  }

  @Query(() => InternalCompaniesDashboardResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  getInternalCompaniesDashboard(@Args() internalCompaniesDashboardArgs: InternalCompaniesDashboardArgs): Promise<any> {
    return this.companyService.getInternalCompaniesDashboard(internalCompaniesDashboardArgs);
  }

  @Query(() => InternalCompaniesDashboardResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  checkDataInternalDashboard(): Promise<any> {
    return this.companyService.checkInternalDataDashboard();
  }

  @Query(() => CompaniesResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async getCompaniesByTaxIdAndName(
    @Args() companyDiscoveryArgs: CompanyDiscoveryArgs
  ): Promise<typeof CompaniesResponseUnion> {
    return this.companyService.getCompaniesByTaxIdAndName(companyDiscoveryArgs);
  }
}
