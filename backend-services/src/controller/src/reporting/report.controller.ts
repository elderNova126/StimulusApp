import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { ReportingEmbeddingConfigService } from './report-embedding-config.service';
import { ReportService } from './report.service';

@Controller('report')
@UseInterceptors(LoggingInterceptor)
export class ReportController {
  constructor(
    private reportService: ReportService,
    private reportingEmbeddingConfigService: ReportingEmbeddingConfigService
  ) {}

  @GrpcMethod('DataService', 'GetAllReports')
  async getAllReports(): Promise<any> {
    const reports = await this.reportService.getAllReports();
    return { reports };
  }

  @GrpcMethod('DataService', 'GetReportEmbeddingParameters')
  async getReportEmbeddingParameters(
    embedReportPayload: controller.IEmbedReportPayload
  ): Promise<controller.IEmbedParamsResponse> {
    const { reportId, workspaceId } = embedReportPayload;
    return await this.reportingEmbeddingConfigService.getEmbedParamsReport(workspaceId, reportId);
  }

  @GrpcMethod('DataService', 'GetMultipleReportsEmbeddingParameters')
  getMultipleReportsEmbeddingParameters(
    embedReportPayload: controller.IEmbedMultipleReportsPayload
  ): Promise<controller.IEmbedParamsResponse> {
    const { reportIds, workspaceId } = embedReportPayload;
    return this.reportingEmbeddingConfigService.getEmbedParamsForMultipleReportsSingleWorkspace(workspaceId, reportIds);
  }
}
