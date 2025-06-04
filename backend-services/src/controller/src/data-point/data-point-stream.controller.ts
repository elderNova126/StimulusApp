import { Controller, UseInterceptors, UseFilters } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { Observable } from 'rxjs';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { NormalizerStreamLogic } from '../shared/normalizer.class';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { DataPointStreamService } from './data-point-stream.service';
import { UploadReportService } from 'src/upload-report/upload-report.service';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { ReportErrorCode } from 'src/upload-report/upload-report-errors.entity';

@Controller('data-point-stream')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class DataPointStreamController extends NormalizerStreamLogic {
  constructor(
    private dataPointStreamService: DataPointStreamService,
    protected readonly logger: StimulusLogger,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private uploadReportService: UploadReportService
  ) {
    super();
  }

  @GrpcStreamMethod('NormalizerService', 'DataPointsStream')
  async handleStream(message: Observable<any>): Promise<any> {
    const uploadReportId = this.reqContextResolutionService.getUploadReportId();
    return this.handleActionBasedStream(
      'dataPoint',
      message,
      (dataPoints) =>
        this.dataPointStreamService.createDataPoints(dataPoints).then(({ errors }) => {
          if (errors.length) {
            this.uploadReportService.streamUpdates(
              uploadReportId,
              errors.map((errId) => ({ code: ReportErrorCode.INGEST_CERTIFICATION, data: { id: errId } }))
            );
          }
        }),
      (id, dataPoint) => this.dataPointStreamService.updateDataPointUsingInternalId(id, dataPoint),
      (id) => this.dataPointStreamService.deleteDataPointUsingInternalId(id)
    );
  }
}
