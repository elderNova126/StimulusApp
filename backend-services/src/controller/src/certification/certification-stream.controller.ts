import { ReportErrorCode } from './../upload-report/upload-report.entity';
import { ReqContextResolutionService } from './../core/req-context-resolution.service';
import { UploadReportService } from './../upload-report/upload-report.service';
import { Controller, UseInterceptors, UseFilters } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { Observable } from 'rxjs';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { NormalizerStreamLogic } from '../shared/normalizer.class';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { CertificationStreamService } from './certification-stream.service';

@Controller('certification-stream')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class CertificationStreamController extends NormalizerStreamLogic {
  constructor(
    private certificationStreamService: CertificationStreamService,
    private uploadReportService: UploadReportService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    protected readonly logger: StimulusLogger
  ) {
    super();
  }

  @GrpcStreamMethod('NormalizerService', 'CertificationsStream')
  async handleStream(message: Observable<any>) {
    const uploadReportId = this.reqContextResolutionService.getUploadReportId();
    return this.handleActionBasedStream(
      'certification',
      message,
      (certifications) =>
        this.certificationStreamService.createCertifications(certifications).then(({ errors }) => {
          if (errors.length) {
            this.uploadReportService.streamUpdates(
              uploadReportId,
              errors.map((errId) => ({ code: ReportErrorCode.INGEST_CERTIFICATION, data: { id: errId } }))
            );
          }
        }),
      (id, certification) =>
        this.certificationStreamService.updateCertificationUsingInternalId(id, certification).catch((_err) => {
          this.uploadReportService.streamUpdates(
            uploadReportId,
            [],
            [{ code: ReportErrorCode.INGEST_CERTIFICATION, data: { id: certification.internalId } }]
          );
        }),
      (id) => this.certificationStreamService.deleteCertificationUsingInternalId(id)
    );
  }
}
