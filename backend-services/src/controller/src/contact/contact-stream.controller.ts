import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { NormalizerStreamLogic } from '../shared/normalizer.class';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { ReqContextResolutionService } from './../core/req-context-resolution.service';
import { ReportErrorCode } from './../upload-report/upload-report.entity';
import { UploadReportService } from './../upload-report/upload-report.service';
import { ContactStreamService } from './contact-stream.service';

@Controller('contact-stream')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class ContactStreamController extends NormalizerStreamLogic {
  constructor(
    private contactStreamService: ContactStreamService,
    private uploadReportService: UploadReportService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    protected readonly logger: StimulusLogger
  ) {
    super();
  }

  @GrpcStreamMethod('NormalizerService', 'ContactsStream')
  async handleStream(message: Observable<any>) {
    const uploadReportId = this.reqContextResolutionService.getUploadReportId();
    return this.handleActionBasedStream(
      'contact',
      message,
      (contacts) =>
        this.contactStreamService.createContacts(contacts).then(({ errors }) => {
          if (errors.length) {
            this.uploadReportService.streamUpdates(
              uploadReportId,
              errors.map((errId) => ({ code: ReportErrorCode.INGEST_CONTACT, data: { id: errId } }))
            );
          }
        }),
      (id, contact) =>
        this.contactStreamService.updateContactUsingInternalId(id, contact).catch((_err) => {
          this.uploadReportService.streamUpdates(
            uploadReportId,
            [],
            [{ code: ReportErrorCode.INGEST_CONTACT, data: { id: contact.internalId } }]
          );
        }),
      (id) => this.contactStreamService.deleteContactUsingInternalId(id)
    );
  }
}
