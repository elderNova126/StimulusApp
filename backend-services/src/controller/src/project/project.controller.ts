import { ArgumentMetadata, Body, Controller, UseFilters, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { DeleteResult } from 'typeorm';
import { ProjectCollaborationAuthGuard } from '../project-collaboration/guards/project-collaboration.guard';
import { GrpcInvalidArgumentException } from '../shared/utils-grpc/exception';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { CompanyType, ProjectStatus, supplierProperty } from './project.constants';
import { ProjectCompanyCountDTO, ProjectStatusCountDTO } from './project.dto';
import { Project } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectCompany } from './projectCompany.entity';

@Controller('project')
@UseFilters(GrpcExceptionFilter)
export class ProjectController {
  private readonly validationPipe: ValidationPipe;
  constructor(private projectService: ProjectService) {
    this.validationPipe = new ValidationPipe(Project);
  }

  @GrpcMethod('DataService', 'SearchProjects')
  async searchProjects(data: any): Promise<any> {
    const { pagination, order, projectPayload } = data;
    const { companyId, companyType, statusIn, userId, accessType, project: filters } = projectPayload;

    const [results, count] = await this.projectService.getProjects(
      filters,
      pagination,
      order,
      companyId,
      companyType,
      statusIn,
      userId,
      accessType
    );

    return { results, count };
  }
  @GrpcMethod('DataService', 'SearchSupplierTierProjects')
  async searchSupplierTierProjects(data: any): Promise<any> {
    const { pagination, order, projectPayload } = data;

    const { companyId, companyType, statusIn, accessType, project: filters } = projectPayload;

    const [results, count] = await this.projectService.getAllSupplierTierProjects(
      filters,
      pagination,
      order,
      companyId,
      companyType,
      statusIn,
      accessType
    );

    return { results, count };
  }
  @GrpcMethod('DataService', 'SearchOtherTierProjects')
  async searchOtherTierProjects(data: any): Promise<any> {
    const { pagination, order, projectPayload } = data;

    const { companyId, companyType, statusIn, accessType, project: filters } = projectPayload;

    const [results, count] = await this.projectService.getAllOtherTierProjects(
      filters,
      pagination,
      order,
      companyId,
      companyType,
      statusIn,
      accessType
    );

    return { results, count };
  }

  @GrpcMethod('DataService', 'SearchAllProjects')
  async searchAllProjects(data: any): Promise<any> {
    const { pagination, order, projectPayload } = data;
    const { statusIn, userId, accessType, project: filters } = projectPayload;

    const [results, count] = await this.projectService.getAllProjects(
      filters,
      pagination,
      order,
      statusIn,
      userId,
      accessType
    );

    return { results, count };
  }

  @GrpcMethod('DataService', 'SearchProjectsSubset')
  async searchProjectsSubset(data: any): Promise<{ results: Project[] }> {
    return { results: await this.projectService.searchProjectsSubset(data.query) };
  }

  @GrpcMethod('DataService', 'RelationShipPanelInfo')
  async GetProjectsStatusClassified(data: any): Promise<{
    projectStatusClassification: ProjectStatusCountDTO;
    CompanyTypeClassification: ProjectCompanyCountDTO;
  }> {
    const { projectPayload } = data;
    const { companyId, project: filters } = projectPayload;
    const projectStatusClassification = await this.projectService.getProjectClassificatedByStatus({
      filters,
      companyId,
      types: [CompanyType.AWARDED],
    });
    const CompanyTypeClassification = await this.projectService.getCountProjectCompanyByCompanyId(
      companyId,
      [
        ProjectStatus.COMPLETED,
        ProjectStatus.INPROGRESS,
        ProjectStatus.NEW,
        ProjectStatus.OPEN,
        ProjectStatus.INREVIEW,
        ProjectStatus.CANCELED,
      ],
      [CompanyType.AWARDED, CompanyType.QUALIFIED, CompanyType.CONSIDERED, CompanyType.SHORTLISTED]
    );
    return { projectStatusClassification, CompanyTypeClassification };
  }

  @GrpcMethod('DataService', 'GetProjectCompanies')
  async getProjectCompanies(
    data: controller.CompanyProjectsPayload
  ): Promise<{ results: ProjectCompany[]; count: number }> {
    const [results, count] = await this.projectService.getProjectCompanies(data);
    const projectCompanyTier2 = await this.projectService.getSuppliersOfSuppliers(data.projectId);
    for (const projectCompany of results) {
      if (projectCompanyTier2.has(projectCompany.companyId))
        projectCompany[supplierProperty] = projectCompanyTier2.get(projectCompany.companyId);
    }

    return { results, count };
  }

  @GrpcMethod('DataService', 'CreateProject')
  async createProject(@Body('project', new ValidationPipe(Project)) data: any): Promise<Project> {
    const { companyId, companyType } = data;
    if (!data || !data.project || Object.keys(data.project).length === 0)
      throw new GrpcInvalidArgumentException('Missing create project arguments.');

    return this.projectService.createProject(data.project, companyId, companyType);
  }

  @UseGuards(ProjectCollaborationAuthGuard)
  @GrpcMethod('DataService', 'CancelProject')
  cancelProject(data: any): Promise<Project> {
    return this.projectService.cancelProject(data.id);
  }

  @UseGuards(ProjectCollaborationAuthGuard)
  @GrpcMethod('DataService', 'CloneProject')
  cloneProject(data: any): Promise<Project> {
    return this.projectService.cloneProject(data);
  }

  @UseGuards(ProjectCollaborationAuthGuard)
  @GrpcMethod('DataService', 'AnswerProjectCriteria')
  answerProjectCriteria(data: any): Promise<ProjectCompany> {
    const { projectId, companyId, criteriaAnswers } = data;
    return this.projectService.answerProjectCriteria(projectId, companyId, criteriaAnswers);
  }

  @UseGuards(ProjectCollaborationAuthGuard)
  @GrpcMethod('DataService', 'UpdateProjectCompany')
  updateProjectCompany(data: any): Promise<ProjectCompany> {
    const { projectId, companyId, type } = data;
    return this.projectService.updateProjectCompany(projectId, companyId, type);
  }

  @UseGuards(ProjectCollaborationAuthGuard)
  @GrpcMethod('DataService', 'AddCompaniesToProject')
  addCompaniesToProject(data: any): Promise<Project> {
    const { projectId, companyIds } = data;
    return this.projectService.addCompaniesToProject(projectId, companyIds);
  }

  @UseGuards(ProjectCollaborationAuthGuard)
  @GrpcMethod('DataService', 'RemoveCompanyFromProject')
  removeCompanyFromProject(data: any): Promise<DeleteResult> {
    const { projectId, companyId } = data;
    return this.projectService.removeCompanyFromProject(projectId, companyId);
  }

  @UseGuards(ProjectCollaborationAuthGuard)
  @GrpcMethod('DataService', 'UpdateProject')
  async updateProject(@Body() data: any): Promise<Project> {
    const validatedProject = await this.validationPipe.transform(data.projectPayload?.project, {} as ArgumentMetadata);
    return this.projectService.updateProject(data.userId, validatedProject);
  }

  @GrpcMethod('DataService', 'MarkProjectAsDeleted')
  async markProjectAsDeleted(data: any): Promise<{ done: boolean }> {
    return this.projectService.markProjectAsDeleted(data.id);
  }

  @GrpcMethod('DataService', 'GetProjectsDashboard')
  async getProjectsDashboard(queryProjectsDashboard: controller.FiltersDashboardPayload): Promise<any> {
    const [results, count, checkPrevYear] = await this.projectService.getProjectsDashboard(queryProjectsDashboard);

    return { results, count, checkPrevYear };
  }

  @GrpcMethod('DataService', 'CheckDataProjectsDashboard')
  async checkDataProjectsDashboard(): Promise<any> {
    const [hasData, prevYear, currentYear] = await this.projectService.checkDataProjectDashboard();
    return { hasData, prevYear, currentYear };
  }
}
