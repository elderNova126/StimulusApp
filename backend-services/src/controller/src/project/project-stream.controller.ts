import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { ReportErrorCode } from 'src/upload-report/upload-report.entity';
import { UploadReportService } from 'src/upload-report/upload-report.service';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { NormalizerStreamLogic } from '../shared/normalizer.class';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { ProjectStreamService } from './project-stream.service';
import { Project } from './project.entity';

@Controller('project-stream')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class ProjectStreamController extends NormalizerStreamLogic {
  private readonly savingQuantity: number;

  constructor(
    private projectStreamService: ProjectStreamService,
    private uploadReportService: UploadReportService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    protected readonly logger: StimulusLogger,
    private readonly configService: ConfigService
  ) {
    super();
    this.logger.context = ProjectStreamController.name;
    this.savingQuantity = this.configService.get<number>('SAVING_QUANTITY_PROJECTS', 20);
  }

  @GrpcStreamMethod('NormalizerService', 'ProjectStream')
  async handleStream(message: Observable<any>): Promise<any> {
    const uploadReportId = this.reqContextResolutionService.getUploadReportId();
    return this.handleActionBasedStream(
      'projectMessage',
      message,
      async (projectsData) =>
        await this.projectStreamService
          .createProjects(projectsData)
          .then((projects: Project[]) => {
            projects.forEach((project) => {
              this.uploadReportService.streamUpdates(uploadReportId, [project.id]);
            });
          })
          .catch((_) => {
            this.uploadReportService.streamUpdates(
              uploadReportId,
              [],
              [{ code: ReportErrorCode.INGEST_PROJECT, data: { id: projectsData[0].project.id } }]
            );
          }),
      (_, project) =>
        this.projectStreamService
          .updateProject(project)
          .then((_) => {
            this.uploadReportService.streamUpdates(uploadReportId, [project.id]);
          })
          .catch((_) => {
            this.uploadReportService.streamUpdates(
              uploadReportId,
              [],
              [{ code: ReportErrorCode.INGEST_PROJECT, data: { id: project.id } }]
            );
          }),
      (projectData) => this.projectStreamService.deleteProject(projectData),
      (companiesIds) => this.projectStreamService.endHandler(companiesIds),
      this.savingQuantity
    );
  }
}
