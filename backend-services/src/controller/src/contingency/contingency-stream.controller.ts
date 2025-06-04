import { ReportErrorCode } from './../upload-report/upload-report.entity';
import { ReqContextResolutionService } from './../core/req-context-resolution.service';
import { UploadReportService } from './../upload-report/upload-report.service';
import { Controller, UseInterceptors, UseFilters } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { Observable } from 'rxjs';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { NormalizerStreamLogic } from '../shared/normalizer.class';
import { ContingencyStreamService } from './contingency-stream.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';

@Controller('contingency-stream')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class ContingencyStreamController extends NormalizerStreamLogic {
  constructor(
    private contingencyStreamService: ContingencyStreamService,
    private uploadReportService: UploadReportService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    protected readonly logger: StimulusLogger
  ) {
    super();
  }

  @GrpcStreamMethod('NormalizerService', 'ContingenciesStream')
  async handleStream(message: Observable<any>) {
    const uploadReportId = this.reqContextResolutionService.getUploadReportId();
    return this.handleActionBasedStream(
      'contingency',
      message,
      (contingencies) =>
        this.contingencyStreamService.createContingencies(contingencies).then(({ errors }) => {
          if (errors.length) {
            this.uploadReportService.streamUpdates(
              uploadReportId,
              errors.map((errId) => ({ code: ReportErrorCode.INGEST_CONTINGENCY, data: { id: errId } }))
            );
          }
        }),
      (id, contingency) =>
        this.contingencyStreamService.updateContingencyUsingInternalId(id, contingency).catch((_err) => {
          this.uploadReportService.streamUpdates(
            uploadReportId,
            [],
            [{ code: ReportErrorCode.INGEST_CONTINGENCY, data: { id: contingency.internalId } }]
          );
        }),
      (id) => this.contingencyStreamService.deleteContingencyUsingInternalId(id)
    );
  }
}
