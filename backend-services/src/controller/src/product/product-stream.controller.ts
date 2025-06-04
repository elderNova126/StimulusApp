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
import { ProductStreamService } from './product-stream.service';

@Controller('product')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class ProductStreamController extends NormalizerStreamLogic {
  constructor(
    private productStreamService: ProductStreamService,
    private uploadReportService: UploadReportService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    protected readonly logger: StimulusLogger
  ) {
    super();
  }

  @GrpcStreamMethod('NormalizerService', 'ProductsStream')
  async handleStream(message: Observable<any>) {
    const uploadReportId = this.reqContextResolutionService.getUploadReportId();
    return this.handleActionBasedStream(
      'product',
      message,
      (products) =>
        this.productStreamService.createProducts(products).then(({ errors }) => {
          if (errors.length) {
            this.uploadReportService.streamUpdates(
              uploadReportId,
              errors.map((errId) => ({ code: ReportErrorCode.INGEST_PRODUCT, data: { id: errId } }))
            );
          }
        }),
      (id, product) =>
        this.productStreamService.updateProductUsingInternalId(id, product).catch((_err) => {
          this.uploadReportService.streamUpdates(
            uploadReportId,
            [],
            [{ code: ReportErrorCode.INGEST_PRODUCT, data: { id: product.internalId } }]
          );
        }),
      (id) => this.productStreamService.deleteProductUsingInternalId(id)
    );
  }
}
