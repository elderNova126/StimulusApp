import { InjectQueue } from '@nestjs/bull';
import { ArgumentMetadata, Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { UserTenantRoleService } from 'src/user/user-tenant-role.service';
import { Connection, In, Repository, UpdateResult } from 'typeorm';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from '../database/database.constants';
import { EvaluationTemplate } from '../evaluation/evaluation-template.entity';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { CollaborationStatus, UserTypeMapping } from '../project-collaboration/project-collaboration.entity';
import { ProjectCollaborationService } from '../project-collaboration/project-collaboration.service';
import { StimulusJobData } from '../scheduler/stimulus-job-data.interface';
import { SCORE_ON_DEMAND_JOB, SCORE_QUEUE } from '../score-logic/score-job.constants';
import { GrpcCanceledException } from '../shared/utils-grpc/exception';
import { TenantCompanyRelationship } from '../tenant-company-relationship/tenant-company-relationship.entity';
import { TenantCompanyRelationshipService } from '../tenant-company-relationship/tenant-company-relationship.service';
import { UserProfileService } from '../user-profile/user-profile.service';
import { CompanyType, ProjectStatus } from './project.constants';
import { Project } from './project.entity';
import { ProjectService } from './project.service';

const ProjectStatusMapping: Record<controller.ProjectStatus, ProjectStatus> = {
  [controller.ProjectStatus.NEW]: ProjectStatus.NEW,
  [controller.ProjectStatus.CANCELED]: ProjectStatus.CANCELED,
  [controller.ProjectStatus.OPEN]: ProjectStatus.OPEN,
  [controller.ProjectStatus.INREVIEW]: ProjectStatus.INREVIEW,
  [controller.ProjectStatus.INPROGRESS]: ProjectStatus.INPROGRESS,
  [controller.ProjectStatus.COMPLETED]: ProjectStatus.COMPLETED,
};

export const CompanyTypeMapping: Record<controller.CompanyProjectType, CompanyType> = {
  [controller.CompanyProjectType.CONSIDERED]: CompanyType.CONSIDERED,
  [controller.CompanyProjectType.AWARDED]: CompanyType.AWARDED,
  [controller.CompanyProjectType.CLIENT]: CompanyType.CLIENT,
  [controller.CompanyProjectType.QUALIFIED]: CompanyType.QUALIFIED,
  [controller.CompanyProjectType.SHORTLISTED]: CompanyType.SHORTLISTED,
};

@Injectable()
export class ProjectStreamService {
  private readonly projectRepository: Repository<Project>;
  private readonly tenantCompanyRepository: Repository<TenantCompanyRelationship>;
  private readonly evaluationTemplateRepository: Repository<EvaluationTemplate>;
  private readonly validationPipe: ValidationPipe;

  constructor(
    @InjectQueue(SCORE_QUEUE) private scoreQueue: Queue<StimulusJobData<any>>,
    @Inject(TENANT_CONNECTION) connection: Connection,
    @Inject(GLOBAL_CONNECTION) globalConnection: Connection,
    private readonly logger: StimulusLogger,
    private projectService: ProjectService,
    private projectCollaborationService: ProjectCollaborationService,
    private userProfileService: UserProfileService,
    private tenantRelationService: TenantCompanyRelationshipService,
    private userTenantRoleService: UserTenantRoleService,
    private readonly reqContextResolutionService: ReqContextResolutionService
  ) {
    this.projectRepository = connection.getRepository(Project);
    this.tenantCompanyRepository = globalConnection.getRepository(TenantCompanyRelationship);
    this.evaluationTemplateRepository = connection.getRepository(EvaluationTemplate);
    this.logger.context = ProjectStreamService.name;
    this.validationPipe = new ValidationPipe(Project);
  }

  private async translateProjectDataToProject(projectData: any): Promise<any> {
    const project = projectData;
    if (project.hasOwnProperty('projectCompany')) {
      const tenantId = this.reqContextResolutionService.getTenantId();
      const projectCompanies = await Promise.all(
        project.projectCompany.map(async (company): Promise<any> => {
          const tenantCompanyRelation = await this.tenantCompanyRepository.findOne({
            relations: ['company'],
            where: { internalId: company.companyId, tenant: { id: tenantId } },
          });
          return tenantCompanyRelation !== undefined
            ? {
                type: CompanyTypeMapping[company.type],
                companyId: tenantCompanyRelation.company.id,
                ...(company.evaluations && {
                  evaluations: company.evaluations.map((evaluation) => {
                    return {
                      ...evaluation,
                      ...(project.createdBy && { createdBy: project.createdBy }),
                    };
                  }),
                }),
              }
            : {};
        })
      );
      project.projectCompany = projectCompanies.filter((company) => Object.keys(company).length !== 0);
    }
    if (project.hasOwnProperty('status')) project.status = ProjectStatusMapping[projectData.status];
    return project;
  }

  private async translateProjectsDataToProjects(
    projectData: any,
    tenantCompanyRelations: TenantCompanyRelationship[]
  ): Promise<any> {
    try {
      const project = projectData;
      const userAdmin = await this.userTenantRoleService.getAdminTenant(tenantCompanyRelations[0].tenant.id);

      if (project.hasOwnProperty('projectCompany')) {
        const projectCompanies = await Promise.all(
          project.projectCompany.map(async (company): Promise<any> => {
            const tenantCompanyRelation: TenantCompanyRelationship = tenantCompanyRelations.find(
              (tcr) => tcr.internalId === company.companyId
            );
            return tenantCompanyRelation !== undefined
              ? {
                  type: CompanyTypeMapping[company.type],
                  companyId: tenantCompanyRelation.company.id,
                  ...(company.evaluations && {
                    evaluations: company.evaluations.map((evaluation) => {
                      return {
                        ...evaluation,
                        ...(project.createdBy && { createdBy: project.createdBy }),
                      };
                    }),
                  }),
                }
              : {};
          })
        );
        project.projectCompany = projectCompanies.filter((company) => Object.keys(company).length !== 0);
        project.createdBy = userAdmin.user.id;
        project.archived = true;
      }
      if (project.hasOwnProperty('status')) project.status = ProjectStatusMapping[projectData.status];
      return project;
    } catch (error) {
      console.log(error);
    }
  }

  getBudgetSpend(projectCompany) {
    const budgetSpend = projectCompany.evaluations.map((evaluation) => evaluation.budgetSpend).reduce((a, b) => a + b);
    return budgetSpend;
  }

  async createProject(projectData: any): Promise<Project> {
    try {
      const clientCompany = await this.projectService.getClientCompany();
      if (clientCompany === undefined) {
        throw new GrpcCanceledException('Client company not found');
      }
      const project = await this.translateProjectDataToProject(projectData.project);
      if (project.projectCompany.length === 0) throw new GrpcCanceledException('No project companies found');
      this.validationPipe.transform(project, {} as ArgumentMetadata);
      const projectCompanyClient = { companyId: clientCompany.id, type: CompanyType.CLIENT };
      project.projectCompany.push(projectCompanyClient);
      const projectSaved = await this.projectRepository.save({ ...project });
      if (projectData.metrics && projectData.metrics.length > 0) {
        const evaluationTemplate = {
          project: {
            id: projectSaved.id,
          },
        };
        const evaluation = await this.evaluationTemplateRepository.save(evaluationTemplate);
        evaluation.customMetrics = projectData.metrics;
        await this.evaluationTemplateRepository.save(evaluation);
      }
      project.projectCompany.map((projectCompany) => {
        if (projectCompany.type === CompanyType.AWARDED) {
          const budgetSpend = projectCompany.evaluations
            .map((evaluation) => evaluation.budgetSpend)
            .reduce((prev, next) => prev + next);
          this.tenantRelationService.updateProjectInfo(projectCompany.companyId, budgetSpend);
        }
      });
      await this.projectCollaborationService.sendProjectCollaboration(
        projectSaved,
        projectSaved.createdBy,
        UserTypeMapping[controller.UserCollaborationType.OWNER],
        CollaborationStatus.ACCEPT
      );
      this.userProfileService.subscribeToTopic({ projectIds: [`${projectSaved.id}`] });
      return projectSaved;
    } catch (error) {
      console.log(error);
    }
  }

  async createProjects(projectsData: any[]): Promise<Project[]> {
    try {
      const internalsIds = projectsData.map(
        (projectData) => projectData.project.projectCompany.map((company) => company.companyId)[0]
      );
      const tenantId = this.reqContextResolutionService.getTenantId();

      const tenantCompanyRelations = await this.tenantCompanyRepository.find({
        relations: ['company'],
        where: { internalId: In(internalsIds), tenant: { id: tenantId } },
      });

      const clientCompany = await this.projectService.getClientCompany();
      if (clientCompany === undefined) {
        throw new GrpcCanceledException('Client company not found');
      }

      const promises = projectsData.map(async (projectData) => {
        try {
          const project = await this.translateProjectsDataToProjects(projectData.project, tenantCompanyRelations);
          if (project.projectCompany.length === 0) throw new GrpcCanceledException('No project companies found');
          this.validationPipe.transform(project, {} as ArgumentMetadata);
          const projectCompanyClient = { companyId: clientCompany.id, type: CompanyType.CLIENT };
          project.projectCompany.push(projectCompanyClient);
          const projectSaved: Project = await this.projectRepository.save({ ...project });

          if (projectData.metrics && projectData.metrics.length > 0) {
            const evaluationTemplate = {
              project: {
                id: projectSaved.id,
              },
            };
            const evaluation = await this.evaluationTemplateRepository.save(evaluationTemplate);
            evaluation.customMetrics = projectData.metrics;
            await this.evaluationTemplateRepository.save(evaluation);
          }
          // update project info for awarded company
          project.projectCompany.map((projectCompany) => {
            if (projectCompany.type === CompanyType.AWARDED) {
              const budgetSpend = projectCompany.evaluations
                .map((evaluation) => evaluation.budgetSpend)
                .reduce((prev, next) => prev + next);
              this.tenantRelationService.updateProjectInfo(projectCompany.companyId, budgetSpend);
            }
          });
          // send project collaboration to project owner

          if (projectSaved.createdBy) {
            await this.projectCollaborationService.sendProjectCollaborationWithUser(
              projectSaved,
              UserTypeMapping[controller.UserCollaborationType.OWNER],
              CollaborationStatus.ACCEPT
            );
          }
          this.userProfileService.subscribeToTopic({ projectIds: [`${projectSaved.id}`] });
          return projectSaved;
        } catch (error) {
          console.log(error);
        }
      });

      const projectsSaved = await Promise.all(promises);
      return projectsSaved;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updateProject(projectData: any): Promise<UpdateResult> {
    const internalId = projectData.project.internalId;
    const project = await this.projectRepository.findOneOrFail({ internalId });
    const newProjectData = await this.translateProjectDataToProject(projectData.project);
    this.validationPipe.transform(newProjectData, {} as ArgumentMetadata);
    newProjectData.id = project.id;
    return this.projectRepository.save(newProjectData);
  }

  async deleteProject(projectData: any): Promise<any> {
    const internalId = projectData.project.internalId;
    const evaluations = await this.evaluationTemplateRepository
      .createQueryBuilder()
      .loadAllRelationIds({ relations: ['project'] })
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('project.id')
          .from(Project, 'project')
          .where('project.internalId = :internalId')
          .getQuery();
        return 'projectId IN ' + subQuery;
      })
      .setParameter('internalId', internalId)
      .getMany();
    if (evaluations.length > 0)
      await this.evaluationTemplateRepository.delete(evaluations.map((evaluation) => evaluation.id));
    return this.projectRepository.delete({ internalId });
  }

  async endHandler(companiesInternalIds): Promise<any> {
    const tenantId = this.reqContextResolutionService.getTenantId();
    const tenantCompanyRelation = await this.tenantCompanyRepository.find({
      relations: ['company'],
      where: { internalId: In(companiesInternalIds), tenant: { id: tenantId } },
    });
    const companiesIds = tenantCompanyRelation.map((tcr) => tcr.company.id);
    await this.scoreQueue.add(SCORE_ON_DEMAND_JOB, {
      data: {
        companies: companiesIds,
      },
    });
  }
}
