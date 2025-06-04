import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { NormalizerStreamLogic } from '../shared/normalizer.class';
import { ReqContextResolutionService } from './../core/req-context-resolution.service';
import { ReportErrorCode } from './../upload-report/upload-report.entity';
import { UploadReportService } from './../upload-report/upload-report.service';
import { InsuranceStreamService } from './insurance-stream.service';

@Controller('insurance-stream')
@UseInterceptors(LoggingInterceptor)
export class InsuranceStreamController extends NormalizerStreamLogic {
  constructor(
    private insuranceStreamService: InsuranceStreamService,
    private uploadReportService: UploadReportService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    protected readonly logger: StimulusLogger
  ) {
    super();
  }

  @GrpcStreamMethod('NormalizerService', 'InsurancesStream')
  async handleStream(message: Observable<any>) {
    const uploadReportId = this.reqContextResolutionService.getUploadReportId();
    return this.handleActionBasedStream(
      'insurance',
      message,
      (insurances) =>
        this.insuranceStreamService.createInsurances(insurances).then(({ errors }) => {
          if (errors.length) {
            this.uploadReportService.streamUpdates(
              uploadReportId,
              errors.map((errId) => ({ code: ReportErrorCode.INGEST_INSURANCE, data: { id: errId } }))
            );
          }
        }),
      (id, insurance) =>
        this.insuranceStreamService.updateInsuranceUsingInternalId(id, insurance).catch((_err) => {
          this.uploadReportService.streamUpdates(
            uploadReportId,
            [],
            [{ code: ReportErrorCode.INGEST_INSURANCE, data: { id: insurance.internalId } }]
          );
        }),
      (id) => this.insuranceStreamService.deleteInsuranceUsingInternalId(id)
    );
  }
}
