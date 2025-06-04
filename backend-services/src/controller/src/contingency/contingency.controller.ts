import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { Contingency } from './contingency.entity';
import { ContingencyService } from './contingency.service';

@Controller('contingency')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class ContingencyController {
  constructor(private contingencyService: ContingencyService) {}

  @GrpcMethod('DataService', 'SearchContingencies')
  async searchContingencies(data: any): Promise<{ results: Contingency[]; count: number }> {
    const { query, contingency: filters } = data;
    const [results, count] = await this.contingencyService.getContingencies(filters, query);

    return { results, count };
  }

  @GrpcMethod('DataService', 'CreateContingency')
  async createContingency(data: any): Promise<Contingency> {
    const { dataTraceSource, userId, traceFrom, contingency } = data;
    return this.contingencyService.createContingency(contingency, {
      dataTraceSource,
      meta: { userId, method: traceFrom },
    });
  }

  @GrpcMethod('DataService', 'DeleteContingency')
  async deleteContingency(data: any): Promise<any> {
    const { id } = data;
    const res = await this.contingencyService.deleteContingency(id);
    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'UpdateContingency')
  updateContingency(data: any): Promise<Contingency> {
    const { dataTraceSource, userId, traceFrom, contingency: contingencyData } = data;
    const { id, ...contingency } = contingencyData;
    return this.contingencyService.updateContingency(id, contingency, {
      dataTraceSource,
      meta: { userId, method: traceFrom },
    });
  }
}
