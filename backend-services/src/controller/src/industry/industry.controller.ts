import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Industry } from './industry.entity';
import { IndustryService } from './industry.service';

@Controller('industry')
export class IndustryController {
  constructor(private industryService: IndustryService) {}

  @GrpcMethod('DataService', 'CreateIndustry')
  async createIndustry(data: any): Promise<Industry> {
    const { dataTraceSource, userId, traceFrom, industry } = data;
    return this.industryService.createIndustry(industry, { dataTraceSource, meta: { userId, method: traceFrom } });
  }

  @GrpcMethod('DataService', 'DeleteIndustry')
  async deleteIndustry(data: any): Promise<any> {
    const res = await this.industryService.deleteIndustry(data.id);

    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'UpdateIndustry')
  async updateIndustry(data: any): Promise<Industry> {
    const { dataTraceSource, userId, traceFrom, industry: industryData } = data;
    const { id, ...industry } = industryData;

    return this.industryService.updateIndustry(id, industry, { dataTraceSource, meta: { userId, method: traceFrom } });
  }

  @GrpcMethod('DataService', 'SearchIndustries')
  async searchIndustries(data: any): Promise<{ results: Industry[] }> {
    const { query, industry: filters } = data;
    const { results } = await this.industryService.getIndustries(filters, query);

    return { results };
  }
}
