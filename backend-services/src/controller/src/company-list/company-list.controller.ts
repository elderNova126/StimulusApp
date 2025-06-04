import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { CompanyList } from './company-list.entity';
import { CompanyListService } from './company-list.service';

@Controller('CompanyList')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class CompanyListController {
  constructor(
    private companyListService: CompanyListService,
    private readonly logger: StimulusLogger
  ) {
    this.logger.context = CompanyListController.name;
  }

  @GrpcMethod('DataService', 'SearchCompanyList')
  searchCompanyList(data: any): Promise<any> {
    const { companyList: filters, pagination, order } = data;

    return this.companyListService.getCompanyLists(filters, order, pagination);
  }

  @GrpcMethod('DataService', 'CreateCompanyList')
  createCompanyList(data: any): Promise<CompanyList> {
    return this.companyListService.createCompanyList(data.companyList);
  }

  @GrpcMethod('DataService', 'CloneCompanyList')
  cloneCompanyList(data: any): Promise<CompanyList> {
    const { id, name, userId } = data;
    return this.companyListService.cloneCompanyList(id, name, userId);
  }

  @GrpcMethod('DataService', 'UpdateCompanyList')
  updateCompanyList(data: any): Promise<CompanyList> {
    const { id, userId, ...updates } = data;

    return this.companyListService.updateCompanyList(id, updates, userId);
  }

  @GrpcMethod('DataService', 'DeleteCompanyList')
  async deleteCompanyList(data: any): Promise<any> {
    const { id, userId } = data;
    await this.companyListService.deleteCompanyList(id, userId);
    return { done: true };
  }

  @GrpcMethod('DataService', 'AddToCompanyList')
  addTocompanyList(data: any): Promise<CompanyList> {
    const { id, companyIds, userId } = data;

    return this.companyListService.addToCompanyList(id, companyIds, userId);
  }

  @GrpcMethod('DataService', 'RemoveFromCompanyList')
  removeFromcompanyList(data: any): Promise<CompanyList> {
    return this.companyListService.removeFromCompanyList(data);
  }
}
