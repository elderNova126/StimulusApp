import { ReportErrorCode } from './../upload-report/upload-report.entity';
import { ReqContextResolutionService } from './../core/req-context-resolution.service';
import { UploadReportService } from './../upload-report/upload-report.service';
import { Controller, UseInterceptors, UseFilters } from '@nestjs/common';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { Observable } from 'rxjs';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { LocationStreamService } from './location-stream.service';
import { NormalizerStreamLogic } from '../shared/normalizer.class';
import { StimulusLogger } from '../logging/stimulus-logger.service';

@Controller('location-stream')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class LocationStreamController extends NormalizerStreamLogic {
  constructor(
    private locationStreamService: LocationStreamService,
    private uploadReportService: UploadReportService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    protected readonly logger: StimulusLogger
  ) {
    super();
  }

  @GrpcStreamMethod('NormalizerService', 'LocationsStream')
  async handleStream(message: Observable<any>) {
    const uploadReportId = this.reqContextResolutionService.getUploadReportId();
    return this.handleActionBasedStream(
      'location',
      message,
      (locations) =>
        this.locationStreamService.createLocations(locations).then(({ errors }) => {
          if (errors?.length) {
            this.uploadReportService.streamUpdates(
              uploadReportId,
              errors.map((errId) => ({ code: ReportErrorCode.INGEST_LOCATION, data: { id: errId } }))
            );
          }
        }),
      (id, location) =>
        this.locationStreamService.updateLocationUsingInternalId(id, location).catch((_err) => {
          this.uploadReportService.streamUpdates(
            uploadReportId,
            [],
            [{ code: ReportErrorCode.INGEST_LOCATION, data: { id: location.internalId } }]
          );
        }),
      (id) => this.locationStreamService.deleteLocationUsingInternalId(id)
    );
  }
}
