import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { NormalizerStreamLogic } from '../shared/normalizer.class';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { IndustryStreamService } from './industry-stream.service';

@Controller('industry-stream')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class IndustryStreamController extends NormalizerStreamLogic {
  constructor(
    private industryStreamService: IndustryStreamService,
    protected readonly logger: StimulusLogger
  ) {
    super();
  }

  @GrpcStreamMethod('NormalizerService', 'IndustriesStream')
  async handleStream(message: Observable<any>) {
    return this.handleActionBasedStream(
      'industry',
      message,
      (industry) => this.industryStreamService.createIndustryWithCompany(industry),
      (id, industry) => this.industryStreamService.updateIndustryUsingInternalId(id, industry),
      (id) => this.industryStreamService.deleteIndustryUsingInternalId(id)
    );
  }
}
