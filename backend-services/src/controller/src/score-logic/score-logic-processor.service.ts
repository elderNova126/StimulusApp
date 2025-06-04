import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import moment from 'moment';
import { ConnectionProviderService } from '../database/connection-provider.service';
import { EvaluationCollectionRepository } from '../evaluation/evaluation-collection.repository';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { StimulusJobData } from '../scheduler/stimulus-job-data.interface';
import { Score } from '../stimulus-score/stimulus-score.entity';
import { ProvisionStatus, Tenant } from '../tenant/tenant.entity';
import { CALCULATE_SCORE_JOB, SCORE_ON_DEMAND_JOB, SCORE_QUEUE } from './score-job.constants';
import { monthLimit } from './score-logic.constants';
import { ScoreLogicServiceV2 } from './score-logic.service.v2';

@Injectable()
@Processor(SCORE_QUEUE)
export class ScoreLogicProcessorService {
  constructor(
    private readonly logger: StimulusLogger,
    private scoreLogicServiceV2: ScoreLogicServiceV2,
    private connectionProviderService: ConnectionProviderService
  ) {
    this.logger.context = ScoreLogicProcessorService.name;
  }

  private async getEvaluations(companyId?: string) {
    const globalConnection = await this.connectionProviderService.getGlobalConnection();
    const tenantRepository = globalConnection.getRepository(Tenant);
    const tenants = await tenantRepository.find({
      where: { provisionStatus: ProvisionStatus.PROVISIONED },
    });
    let evaluations = [];
    for (const tenant of tenants) {
      const tenantConnection = await this.connectionProviderService.getTenantConnection(tenant.id);
      const evaluationCollectionRepository = tenantConnection.getCustomRepository(EvaluationCollectionRepository);

      let evaluationCollection = [];
      if (companyId) evaluationCollection = await evaluationCollectionRepository.getCompanyData(companyId);
      if (!companyId) evaluationCollection = await evaluationCollectionRepository.getData();
      if (evaluationCollection)
        evaluations = evaluations.concat(
          evaluationCollection.reduce(
            (acc: any, cur): any =>
              acc.concat(
                cur.evaluations.map((evaluation) => {
                  return {
                    companyId: cur.companyId,
                    project: cur.project,
                    evaluation,
                  };
                })
              ),
            []
          )
        );
    }
    return evaluations;
  }

  async computeScore(companyId: string, companyEvaluations: any[]) {
    const globalConnection = await this.connectionProviderService.getGlobalConnection();
    const results = [];

    for (const companyEvaluation of companyEvaluations) {
      const { evaluation, project } = companyEvaluation;
      let customMetrics = [];
      if (project.evaluationTemplate) customMetrics = project.evaluationTemplate.customMetrics;
      const result = this.scoreLogicServiceV2.computeEvaluation(
        evaluation,
        evaluation.budgetSpend,
        moment(project.created),
        customMetrics
      );
      results.push(result);
    }
    const sumComponents = {};
    let sumDenominator = 0;
    for (const iterator of results) {
      if (iterator.monthSinceEval >= monthLimit) continue;
      sumDenominator += iterator.denominator;
      for (const [key, value] of Object.entries(iterator.numerators)) {
        if (sumComponents[key]) {
          sumComponents[key] += value;
        } else {
          sumComponents[key] = value;
        }
      }
    }
    const score: any = Object.keys(sumComponents).reduce((newObj, value) => {
      newObj[value] = +(sumComponents[value] / sumDenominator).toFixed(2);
      return newObj;
    }, {});
    const scoreRepository = await globalConnection.getRepository(Score);

    await scoreRepository.save({
      company: {
        id: companyId,
      },
      scoreValue: score?.overall ?? 1000,
      ...score,
    });
  }

  @Process(CALCULATE_SCORE_JOB)
  async calculateScore(job: Job<StimulusJobData<any>>) {
    this.logger.log(JSON.stringify(job.data));

    const evaluations = await this.getEvaluations();
    const companiesIds = [...new Set(evaluations.map((evaluation) => evaluation.companyId))];
    const errors = [];

    for (const companyId of companiesIds) {
      const companyEvaluations = evaluations
        .filter((evaluation) => evaluation.companyId === companyId)
        .sort((a, b) => {
          return moment(a.evaluation.created) > moment(b.evaluation.created) ? 1 : -1;
        });
      try {
        await this.computeScore(companyId, companyEvaluations);
      } catch (error) {
        this.logger.error(`Error calculating score for Company: ${companyId}`);
        errors.push(companyId);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Failed to calculate score for companies: ${JSON.stringify(errors)}`);
    }
    return {};
  }

  @Process(SCORE_ON_DEMAND_JOB)
  async calculateScoreForCompany(job: Job<StimulusJobData<any>>) {
    this.logger.log(JSON.stringify(job.data));
    const data = job.data.data;
    const companies = data.companies;
    for (const companyId of companies) {
      const evaluations = await this.getEvaluations(companyId);
      const companyEvaluations = evaluations.sort((a, b) => {
        return moment(a.evaluation.created) > moment(b.evaluation.created) ? 1 : -1;
      });
      await this.computeScore(companyId, companyEvaluations);
    }
    return {};
  }
}
