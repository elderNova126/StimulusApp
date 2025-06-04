import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { UploadReport } from './upload-report.entity';
import { UploadReportService } from './upload-report.service';

@Controller('uploadReport')
export class UploadReportController {
  constructor(
    private uploadReportService: UploadReportService,
    private readonly logger: StimulusLogger
  ) {
    this.logger.context = UploadReportController.name;
  }

  @GrpcMethod('DataService', 'GetUploadReports')
  async searchUploadReport(data: any) {
    const [results, count] = await this.uploadReportService.getUploadReports(data);

    return { results, count };
  }
  @GrpcMethod('NormalizerService', 'GetUploadReports')
  async searchUploadReportNormalizer(data: any) {
    const [results, count] = await this.uploadReportService.getUploadReports(data);

    return { results, count };
  }
  @GrpcMethod('DataService', 'CreateUploadReport')
  createUploadReport(data: any): Promise<any> {
    return this.uploadReportService.createUploadReport(data.fileName, data.userId);
  }

  @GrpcMethod('DataService', 'DeleteUploadReport')
  async deleteUploadReport(data: any): Promise<any> {
    const { id } = data;

    await this.uploadReportService.deleteUploadReport(id);
    return { done: true };
  }

  @GrpcMethod('NormalizerService', 'UpdateUploadReport')
  updateUploadReport(data: any): Promise<UploadReport> {
    const {
      uploadReport: { id, ...uploadReport },
    } = data;

    return this.uploadReportService.updateUploadReport(id, uploadReport);
  }

  @GrpcMethod('NormalizerService', 'AddUploadReportError')
  addUploadReportError(data: any): Promise<UploadReport> {
    const {
      uploadReport: { id },
      error,
    } = data;

    return this.uploadReportService.addUploadReportError(id, error);
  }
}
