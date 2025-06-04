import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { GlobalProjectService } from 'src/project-tree/project-tree.service';
import { ProjectStatus } from 'src/project/project.constants';
import { SupplierTierLogicService } from 'src/supplier-tier/supplier-tier-logic.service';
import { getMonthName } from 'src/utils/date';
import { Connection, In, Repository } from 'typeorm';
import { TENANT_CONNECTION } from '../database/database.constants';
import { EventCode } from '../event/event-code.enum';
import { InternalEventService } from '../event/internal-event.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { Project } from '../project/project.entity';
import { ProjectCompany } from '../project/projectCompany.entity';
import { StimulusJobData } from '../scheduler/stimulus-job-data.interface';
import { SCORE_ON_DEMAND_JOB, SCORE_QUEUE } from '../score-logic/score-job.constants';
import { ScoreComponents, ScoreLogicServiceV2 } from '../score-logic/score-logic.service.v2';
import { TenantCompanyRelationshipService } from '../tenant-company-relationship/tenant-company-relationship.service';
import { CompanyEvaluation } from './company-evaluation.entity';
import { CustomMetric } from './custom-metric.entity';
import { EvaluationTemplate } from './evaluation-template.entity';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GrpcUnavailableException } from '../shared/utils-grpc/exception';
import { setHoursToZero } from '../utils/date';

@Injectable()
export class EvaluationService {
  private readonly metricRepository: Repository<CustomMetric>;
  private readonly evaluationRepository: Repository<EvaluationTemplate>;
  private readonly companyEvaluationRepository: Repository<CompanyEvaluation>;
  private readonly projectCompanyRepository: Repository<ProjectCompany>;
  private readonly projectRepository: Repository<Project>;

  constructor(
    @Inject(TENANT_CONNECTION) tenantConnection: Connection,
    @InjectQueue(SCORE_QUEUE) private scoreQueue: Queue<StimulusJobData<any>>,
    private eventService: InternalEventService,
    private tenantRelationService: TenantCompanyRelationshipService,
    private readonly logger: StimulusLogger,
    private readonly scoreLogicService: ScoreLogicServiceV2,
    private supplierTierLogicService: SupplierTierLogicService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private globalProjectService: GlobalProjectService
  ) {
    this.metricRepository = tenantConnection.getRepository(CustomMetric);
    this.evaluationRepository = tenantConnection.getRepository(EvaluationTemplate);
    this.companyEvaluationRepository = tenantConnection.getRepository(CompanyEvaluation);
    this.projectCompanyRepository = tenantConnection.getRepository(ProjectCompany);
    this.projectRepository = tenantConnection.getRepository(Project);
  }

  getMetric(filters: CustomMetric) {
    return this.metricRepository.find(filters);
  }

  async createEvaluationTemplate(
    project: Project,
    customMetrics: {
      exceptionalValue: number;
      metExpectationsValue: number;
      unsatisfactoryValue: number;
      extendsCategory: string;
    }[]
  ): Promise<EvaluationTemplate> {
    return this.evaluationRepository.save({
      project,
      ...(customMetrics.length && {
        customMetrics: await this.metricRepository.save(customMetrics),
      }),
    });
  }

  async getEvaluation(projectId: number): Promise<EvaluationTemplate> {
    let evaluation = await this.evaluationRepository.findOne({
      project: { id: projectId },
    });

    if (!evaluation) {
      const project = await this.projectRepository.findOneOrFail(projectId);
      evaluation = await this.createEvaluationTemplate(project, []);
    }

    return evaluation;
  }

  async getCompanyEvaluations(projectCompanyId: string): Promise<any> {
    const evaluationCount = await this.projectCompanyRepository.count({
      relations: ['project'],
      where: {
        companyId: projectCompanyId,
        project: { status: ProjectStatus.COMPLETED },
      },
    });

    return evaluationCount;
  }

  async getCompanyEvaluationsByprojectCompanyIds(projectCompanyIds: number[]): Promise<any> {
    try {
      const [results, count] = await this.companyEvaluationRepository.findAndCount({
        where: {
          projectCompany: {
            id: In(projectCompanyIds),
          },
        },
      });
      return { results, count };
    } catch (error) {
      this.logger.error('Error getting company evaluations by project company ids', error);
    }
  }

  async getProjectCompanyEvaluations(projectId: number): Promise<{ results: CompanyEvaluation[]; count?: number }> {
    const projectCompany = await this.projectCompanyRepository.find({
      project: { id: projectId },
    });

    const [results, count] = await this.companyEvaluationRepository
      .createQueryBuilder('companyEvaluation')
      .where('projectCompany.id IN (:...projectCompanyIds)', {
        projectCompanyIds: projectCompany.map(({ id }) => id),
      })
      .getManyAndCount();

    return { results, count };
  }

  async evaluateCompany(props: controller.EvaluateCompanyPayload): Promise<CompanyEvaluation> {
    const { projectId, projectCompanyId, budgetSpend, components, description, createdBy } = props;

    const evaluation = await this.evaluationRepository.findOneOrFail({
      project: { id: projectId },
    });

    const projectCompany = await this.projectCompanyRepository.findOneOrFail(projectCompanyId);
    const { evaluationScore: scoreValue } = this.scoreLogicService.computeProjectScore(components as ScoreComponents);

    const companyEvaluation = await this.companyEvaluationRepository.save({
      ...components,
      scoreValue,
      evaluation,
      projectCompany,
      submitted: true,
      budgetSpend,
      createdBy,
      description,
    });
    const { project } = evaluation;
    const projectTree = await this.globalProjectService.saveProjcetAndSupplier(project, [projectCompany.companyId]);

    this.supplierTierLogicService.calculateSupplierTier(projectTree.id);

    const eventData = {
      project: { id: projectId },
      company: { id: projectCompany.companyId },
    };
    this.eventService.dispatchInternalEvents([{ code: EventCode.EVALUATE_PROJECT_COMPANY, data: eventData }]);

    try {
      await this.scoreQueue.add(SCORE_ON_DEMAND_JOB, {
        data: {
          companies: [projectCompany.companyId],
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
    if (project.status === ProjectStatus.COMPLETED) {
      this.tenantRelationService.addEvaluationRelation(projectCompany.companyId);
      this.tenantRelationService.addRelationSpent(projectCompany.companyId, budgetSpend ?? 0);
    }
    return companyEvaluation;
  }

  async updateCompanyEvaluation(props: controller.EvaluateCompanyPayload): Promise<CompanyEvaluation> {
    const { id, projectCompanyId, budgetSpend, components, description, evaluationDate } = props;
    const { evaluationScore: scoreValue } = this.scoreLogicService.computeProjectScore(components as ScoreComponents);
    const projectCompany = await this.projectCompanyRepository.findOneOrFail({
      relations: ['project'],
      where: { id: projectCompanyId },
    });
    const {
      companyId,
      project: { startDate },
    } = projectCompany;
    const { project } = projectCompany;
    const currentDate = new Date();
    const tenantId = this.reqContextResolutionService.getTenantId();

    if (evaluationDate) {
      const newEvaluationDate = setHoursToZero(new Date(evaluationDate));
      const newStartDate = setHoursToZero(new Date(startDate));
      if (newEvaluationDate < newStartDate || newEvaluationDate > currentDate) {
        throw new GrpcUnavailableException('Evaluation date must be between project start date and current date');
      }
    }
    const evaluationToUpdate = await this.companyEvaluationRepository.preload({
      ...components,
      scoreValue,
      id,
      description,
      created: evaluationDate ?? new Date(),
    });

    // update totalSpent on tenant company relation
    if (project.status === ProjectStatus.COMPLETED) {
      this.tenantRelationService.addRelationSpent(
        companyId,
        Number(budgetSpend ?? 0) - Number(evaluationToUpdate.budgetSpend ?? 0)
      );
    }
    const [projectTree] = await this.globalProjectService.findByProjectId(project.id, tenantId);

    this.supplierTierLogicService.calculateSupplierTier(projectTree.id);

    const companyEvaluation = this.companyEvaluationRepository.save({
      ...evaluationToUpdate,
      budgetSpend,
    });

    const eventData = {
      project: { id: projectCompany.project.id },
      company: { id: projectCompany.companyId },
    };

    this.eventService.dispatchInternalEvent({
      code: EventCode.UPDATE_COMPANY_EVALUATION,
      data: eventData,
    });
    try {
      this.scoreQueue.add(SCORE_ON_DEMAND_JOB, {
        data: {
          companies: [projectCompany.companyId],
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
    return companyEvaluation;
  }

  async deleteCompanyEvaluation(projectCompanyId: number) {
    const projectCompany = await this.projectCompanyRepository.findOneOrFail(projectCompanyId);
    const companyEvaluation = await this.companyEvaluationRepository.findOneOrFail({ projectCompany });

    return this.companyEvaluationRepository.delete(companyEvaluation);
  }

  async deleteCompanyEvaluationByTenantId(projectCompanyId: number, tenantConnection: Connection) {
    try {
      const companyEvaluationRepository = tenantConnection.getRepository(CompanyEvaluation);
      const projectCompanyRepository = tenantConnection.getRepository(ProjectCompany);

      const projectCompany = await projectCompanyRepository.findOneOrFail(projectCompanyId);
      const companyEvaluation = await companyEvaluationRepository.findOneOrFail({ projectCompany });

      return companyEvaluationRepository.delete(companyEvaluation);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getAllCompanyEvaluation() {
    return this.companyEvaluationRepository.find();
  }

  async reEvaluationAllCompanyEvaluation() {
    const companyEvaluations = await this.companyEvaluationRepository
      .createQueryBuilder('companyEvaluation')
      .leftJoinAndSelect('companyEvaluation.projectCompany', 'projectCompany')
      .getMany();
    const evaluationAll = new Map();
    let setName = 0;
    try {
      for (const evaluation of companyEvaluations) {
        const { evaluationScore } = this.scoreLogicService.computeProjectScore(evaluation as ScoreComponents);
        const {
          id,
          projectCompany: { companyId },
        } = evaluation;
        evaluation.scoreValue = evaluationScore;
        if (id % 2000 === 0) {
          setName++;
        }
        evaluationAll.set(
          setName,
          evaluationAll.get(setName) ? [...evaluationAll.get(setName), evaluation] : [evaluation]
        );
        try {
          this.scoreQueue.add(SCORE_ON_DEMAND_JOB, {
            data: {
              companies: [companyId],
            },
          });
        } catch (error) {
          this.logger.error(error);
        }
      }
      for (const [_key, evaluations] of evaluationAll) {
        await this.companyEvaluationRepository.save(evaluations);
      }
      this.logger.log('Re-evaluation all company evaluation success');
      return true;
    } catch (error) {
      this.logger.error('Re-evaluation all company evaluation failed', error);
      return false;
    }
  }

  async getTotalSpendDashboard(queryTotalSpendsDashboard: controller.FiltersDashboardPayload) {
    const { timePeriodFilter, granularityFilter } = queryTotalSpendsDashboard;

    const year = new Date().getFullYear();

    const query = await this.companyEvaluationRepository
      .createQueryBuilder('companyEvaluation')
      .leftJoinAndSelect('companyEvaluation.projectCompany', 'projectCompany')
      .leftJoinAndSelect('projectCompany.project', 'project');

    if (granularityFilter === 'month') {
      query
        .select('MONTH(project.endDate) as name, SUM(companyEvaluation.budgetSpend) as Spent')
        .groupBy('MONTH(project.endDate)');
    } else if (granularityFilter === 'quarter') {
      query
        .select('DATEPART(quarter, project.endDate) as name, SUM(companyEvaluation.budgetSpend) as Spent')
        .groupBy('DATEPART(quarter, project.endDate)');
    }

    const checkPrevYear = await query.andWhere('YEAR(project.endDate)= :year', { year: year - 1 }).getCount();

    query.where('YEAR(project.endDate)= :year', { year: timePeriodFilter === 'current' ? year : year - 1 });
    query.andWhere('project.endDate <= GETDATE() ');
    const totalSpend = await query.execute();

    const results = totalSpend.map((data) => {
      return { ...data, name: granularityFilter === 'month' ? getMonthName(data.name) : 'Q' + data.name };
    });

    const count = results.reduce((accumulator, object) => {
      return accumulator + object.Spent;
    }, 0);

    return [results, count, checkPrevYear];
  }

  async checkDataSpentDashboard() {
    const year = new Date().getFullYear();
    const query = this.companyEvaluationRepository
      .createQueryBuilder('companyEvaluation')
      .leftJoinAndSelect('companyEvaluation.projectCompany', 'projectCompany')
      .leftJoinAndSelect('projectCompany.project', 'project');
    const currentYear = await query.where('YEAR(project.endDate)= :year', { year }).getCount();
    const prevYear = await query.where('YEAR(project.endDate)= :year', { year: year - 1 }).getCount();

    const hasData = (prevYear ?? currentYear) > 0 ? true : false;

    return [hasData, prevYear, currentYear];
  }
}
