import { Controller, UseInterceptors, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CertificationService } from './certification.service';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';

@Controller('certification')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class CertificationController {
  constructor(private certificationService: CertificationService) {}

  @GrpcMethod('DataService', 'SearchCertifications')
  async searchCertifications(data: any): Promise<any> {
    const { query, certification } = data;
    const [results, count] = await this.certificationService.getCertifications(certification, query);

    return { results, count };
  }

  @GrpcMethod('DataService', 'CreateCertification')
  async createCertification(data: any): Promise<any> {
    const { dataTraceSource, userId, traceFrom, certification } = data;
    return this.certificationService.createCertification(certification, {
      dataTraceSource,
      meta: { userId, method: traceFrom },
    });
  }

  @GrpcMethod('DataService', 'DeleteCertification')
  async deleteCertification(data: any): Promise<any> {
    const { id } = data;
    const res = await this.certificationService.deleteCertification(id);

    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'UpdateCertification')
  async updateCertification(data: any): Promise<any> {
    const { dataTraceSource, userId, traceFrom, certification } = data;
    const { id, ...rest } = certification;

    return this.certificationService.updateCertification(id, rest, {
      dataTraceSource,
      meta: { userId, method: traceFrom },
    });
  }
}
