import { Controller } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CompanyEvaluation } from './company-evaluation.entity';
import { defaultMetrics, DefaultMetric } from './default-metrics';
import { CustomMetric } from './custom-metric.entity';
import { controller } from 'controller-proto/codegen/tenant_pb';

const mapMetrics = (defaults: DefaultMetric[], customItems: CustomMetric[]) => {
  return defaults.map((metric: DefaultMetric) => {
    const { category } = metric;
    const customMetric = customItems?.find?.((item) => item.extendsCategory === category);

    return {
      ...metric,
      ...customMetric,
      isDefault: !customMetric,
    };
  });
};
@Controller('evaluation')
export class EvaluationController {
  constructor(private evaluationService: EvaluationService) {}

  @GrpcMethod('DataService', 'GetProjectEvaluationTemplate')
  async projectEvaluationTemplate(data: controller.GetEvaluationsPayload): Promise<any> {
    const { projectId } = data;
    const evaluation = await this.evaluationService.getEvaluation(projectId);

    return {
      ...evaluation,
      metrics: mapMetrics(defaultMetrics, evaluation.customMetrics),
    };
  }

  @GrpcMethod('DataService', 'GetProjectCompanyEvaluations')
  async getProjectCompanyEvaluations(
    data: controller.GetEvaluationsPayload
  ): Promise<{ results: CompanyEvaluation[]; count?: number }> {
    const { projectId } = data;

    return this.evaluationService.getProjectCompanyEvaluations(projectId);
  }

  @GrpcMethod('DataService', 'EvaluateCompany')
  async evaluateCompany(data: controller.EvaluateCompanyPayload): Promise<CompanyEvaluation> {
    return this.evaluationService.evaluateCompany(data);
  }

  @GrpcMethod('DataService', 'UpdateCompanyEvaluation')
  async updateCompanyEvaluation(data: controller.EvaluateCompanyPayload): Promise<CompanyEvaluation> {
    return this.evaluationService.updateCompanyEvaluation(data);
  }

  @GrpcMethod('DataService', 'ReEvaluationCompanyEvaluation')
  async reEvaluationCompanyEvaluation(_data: controller.ReEvaluationResponse) {
    return this.evaluationService.reEvaluationAllCompanyEvaluation();
  }

  @GrpcMethod('DataService', 'GetTotalSpendDashboard')
  async getTotalSpendDashboard(queryTotalSpendDashboard: controller.FiltersDashboardPayload): Promise<any> {
    const [results, count, checkPrevYear] =
      await this.evaluationService.getTotalSpendDashboard(queryTotalSpendDashboard);

    return { results, count, checkPrevYear };
  }

  @GrpcMethod('DataService', 'CheckDataSpentDashboard')
  async checkDataSpentDashboard(): Promise<any> {
    const [hasData, prevYear, currentYear] = await this.evaluationService.checkDataSpentDashboard();
    return { hasData, prevYear, currentYear };
  }
}
