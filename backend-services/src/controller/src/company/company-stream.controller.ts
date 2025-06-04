import { ReportErrorCode } from './../upload-report/upload-report.entity';
import { ReqContextResolutionService } from './../core/req-context-resolution.service';
import { UploadReportService } from './../upload-report/upload-report.service';
import { Controller, UseInterceptors, UseFilters } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { NormalizerStreamLogic } from '../shared/normalizer.class';
import { CompanyStreamService } from './company-stream.service';
import { LoggingInterceptor } from '../logging/logger.interceptor';

@Controller('company-stream')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class CompanyStreamController extends NormalizerStreamLogic {
  constructor(
    private companyStreamService: CompanyStreamService,
    private uploadReportService: UploadReportService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    protected readonly logger: StimulusLogger
  ) {
    super();
    this.logger.context = CompanyStreamController.name;
  }

  @GrpcStreamMethod('NormalizerService', 'CompaniesStream')
  async handleStream(message: Observable<any>): Promise<any> {
    this.logger.debug('handleStream');
    const uploadReportId = this.reqContextResolutionService.getUploadReportId();
    return this.handleActionBasedStream(
      'company',
      message,
      (companyData) =>
        this.companyStreamService
          .createCompanies(companyData)
          .then(({ successIds, errors }) => {
            this.uploadReportService.streamUpdates(
              uploadReportId,
              successIds,
              errors.map((data) => ({ code: ReportErrorCode.INGEST_COMPANY, data }))
            );
          })
          .catch((err) => {
            console.log(err);
          }),

      (id, company) =>
        this.companyStreamService
          .updateCompanyUsingInternalId(id, company)
          .then((company) => {
            this.uploadReportService.streamUpdates(uploadReportId, [company.id]);
          })
          .catch((err) => {
            this.uploadReportService.streamUpdates(
              uploadReportId,
              [],
              [{ code: ReportErrorCode.INGEST_COMPANY, data: err }]
            );
          }),
      (ids) => this.companyStreamService.deleteCompanyUsingInternalIds(ids)
    );
  }
}
