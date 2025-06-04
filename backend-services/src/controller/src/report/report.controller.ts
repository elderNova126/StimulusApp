import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { LoggingInterceptor } from 'src/logging/logger.interceptor';
import { ReportService } from './report.service';

@Controller('reportData')
@UseInterceptors(LoggingInterceptor)
export class ReportController {
  constructor(private reportService: ReportService) {}

  @GrpcMethod('DataService', 'GetReportData')
  async getReportData(reportDataPayload: controller.IReportDataPayload): Promise<controller.IReportDataResponse> {
    const { tenantName } = reportDataPayload;
    return await this.reportService.getReportData(tenantName);
  }
}
