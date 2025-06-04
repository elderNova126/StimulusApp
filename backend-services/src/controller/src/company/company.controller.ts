import { Body, Controller, Inject, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { GLOBAL_COMPANY_AGGREGATE_INDEX_NAME, GLOBAL_LOCATION_AGGREGATE_INDEX_NAME } from '../search/search.constants';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { ValidationPipe } from '../shared/validation.pipe';
import { Company } from './company.entity';
import { UpdateCompanyDto } from './dtos/UpdateCompany.dto';
import { CompanyService } from './company.service';
import { MinorityOwnershipDetail } from 'src/minority-ownershipDetail/minorityOwnershipDetail.entity';

@Controller('company')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly logger: StimulusLogger,
    @Inject(GLOBAL_COMPANY_AGGREGATE_INDEX_NAME)
    private readonly globalCompanyAggregateIndexName: string,
    @Inject(GLOBAL_LOCATION_AGGREGATE_INDEX_NAME)
    private readonly globalLocationAggregateIndexName: string
  ) {
    this.logger.context = CompanyController.name;
  }

  @GrpcMethod('DataService', 'SearchCompanies')
  async searchCompanies(data: any): Promise<any> {
    const { ids, company: filters, pagination, order } = data;
    const [results, count] = await this.companyService.getCompanies(filters, pagination, order, {
      ...(ids && { idIn: ids }),
    });

    return { results, count };
  }

  @GrpcMethod('DataService', 'SearchCompanyById')
  async searchCompanyById(data: any): Promise<any> {
    const { id } = data;
    try {
      return await this.companyService.getCompany(id);
    } catch (error) {
      throw error;
    }
  }

  @GrpcMethod('DataService', 'SearchCompaniesByTaxId')
  async searchCompaniesByTaxId(data: any): Promise<any> {
    const { query } = data;
    return { results: await this.companyService.searchCompaniesByTaxId(query) };
  }

  @GrpcMethod('DataService', 'SearchCompaniesSubset')
  async searchCompaniesSubset(data: any): Promise<any> {
    const { query } = data;

    return { results: await this.companyService.searchCompaniesSubset(query) };
  }

  @GrpcMethod('DataService', 'GetDistinctDiverseOwnership')
  async getDistinctDiverseOwnership(_data: any): Promise<{ values: any[] }> {
    return this.companyService.getDistinctDiverseOwnership();
  }

  @GrpcMethod('DataService', 'GetMinorityOwnership')
  async getMinorityOwnership(_data: any): Promise<{ results: MinorityOwnershipDetail[] }> {
    return this.companyService.getMinorityOwnership();
  }

  @GrpcMethod('DataService', 'GetDistinctMinorityOwnership')
  async getDistinctMinorityOwnership(_data: any): Promise<{ values: any[] }> {
    return this.companyService.getDistinctMinoryOwnership();
  }

  @GrpcMethod('DataService', 'CreateCompany')
  async createCompany(@Body('company', new ValidationPipe(Company)) data: any): Promise<Company> {
    return this.companyService.createCompany(data.company);
  }

  @GrpcMethod('DataService', 'UpdateCompany')
  async updateCompany(@Body('company', new ValidationPipe(Company, UpdateCompanyDto)) data: any): Promise<Company> {
    const { company, dataTraceSource, userId, traceFrom, industriesPayload } = data;
    const { id, ...rest } = company;

    return this.companyService.updateCompany(id, rest, {
      industriesPayload,
      dataTraceSource,
      meta: { userId, method: traceFrom },
    });
  }

  @GrpcMethod('DataService', 'DeleteCompany')
  async deleteCompany(data: any): Promise<any> {
    const res = await this.companyService.deleteBulkCompany(data.ids);
    return { done: res.affected > 0 };
  }

  @GrpcMethod('DiscoveryService', 'DiscoverCompanies')
  async discoverCompanies(queryRequestPayload: controller.QueryRequestPayload): Promise<any> {
    return this.companyService.discoverCompanies(queryRequestPayload, this.globalCompanyAggregateIndexName);
  }

  @GrpcMethod('DiscoveryService', 'CountCompaniesByList')
  async countCompaniesByList(queryRequestPayload: controller.CompaniesByListTypePayload): Promise<any> {
    const { listType } = queryRequestPayload;
    return this.companyService.countCompaniesByList(listType);
  }

  @GrpcMethod('DiscoveryService', 'DiscoverCompaniesMap')
  async discoverCompaniesMap(queryRequestPayload: controller.QueryRequestPayload): Promise<any> {
    return this.companyService.discoverCompanies(queryRequestPayload, this.globalLocationAggregateIndexName);
  }

  @GrpcMethod('DataService', 'SearchUnusedCompanies')
  async searchUnusedCompanies(queryUnusedRequestPayload: controller.SearchUnusedRequestPayload): Promise<any> {
    const [results, count] = await this.companyService.getUnusedCompanies(queryUnusedRequestPayload);

    return { results, count };
  }

  @GrpcMethod('DataService', 'GetInternalCompaniesDashboard')
  async getInternalCompaniesDashboard(
    queryInternalCompaniesDashboard: controller.FiltersDashboardPayload
  ): Promise<any> {
    const [results, count, checkPrevYear] = await this.companyService.getInternalCompaniesDashboard(
      queryInternalCompaniesDashboard
    );

    return { results, count, checkPrevYear };
  }

  @GrpcMethod('DataService', 'CheckDataInternalDashboard')
  async checkDataInternalDashboard(): Promise<any> {
    const [hasData, prevYear, currentYear] = await this.companyService.checkDataInternalDashboard();
    return { hasData, prevYear, currentYear };
  }

  @GrpcMethod('DataService', 'GetCompaniesByTaxIdAndName')
  async getCompaniesByTaxIdAndName(queryRequestPayload: controller.QueryRequestPayload): Promise<any> {
    return this.companyService.getCompaniesByTaxIdAndName(queryRequestPayload, this.globalCompanyAggregateIndexName);
  }
}
