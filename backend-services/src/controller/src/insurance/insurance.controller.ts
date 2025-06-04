import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { Insurance } from './insurance.entity';
import { InsuranceService } from './insurance.service';

@Controller('insurance')
@UseInterceptors(LoggingInterceptor)
export class InsuranceController {
  constructor(private insuranceService: InsuranceService) {}

  @GrpcMethod('DataService', 'SearchInsurances')
  async searchInsurances(data: any): Promise<{ results: Insurance[]; count: number }> {
    const { query, insurance: filters } = data;

    const [results, count] = await this.insuranceService.getInsurances(filters, query);

    return { results, count };
  }

  @GrpcMethod('DataService', 'CreateInsurance')
  async createInsurance(data: any): Promise<Insurance> {
    const { dataTraceSource, userId, traceFrom, insurance } = data;
    return this.insuranceService.createInsurance(insurance, { dataTraceSource, meta: { userId, method: traceFrom } });
  }

  @GrpcMethod('DataService', 'DeleteInsurance')
  async deleteInsurance(data: any): Promise<any> {
    const { id } = data;
    const res = await this.insuranceService.deleteInsurance(id);

    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'UpdateInsurance')
  async updateInsurance(data: any): Promise<Insurance> {
    const { dataTraceSource, userId, traceFrom, insurance } = data;
    const { id, ...rest } = insurance;

    return this.insuranceService.updateInsurance(id, rest, { dataTraceSource, meta: { userId, method: traceFrom } });
  }
}
