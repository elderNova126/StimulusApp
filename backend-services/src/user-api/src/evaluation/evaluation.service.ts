import { Injectable, Inject } from '@nestjs/common';
import { ServicesMapping, ProtoServices } from '../core/proto.constants';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { CompanyEvaluation } from '../models/companyEvaluation';
import { EvaluateCompanyArgs, EvaluationArgs } from '../dto/evaluationArgs';
import { InternalCompaniesDashboardArgs } from 'src/dto/companyArgs';
@Injectable()
export class EvaluationService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  getProjectEvaluation(evaluationArgs: EvaluationArgs) {
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getProjectEvaluationTemplate,
      evaluationArgs
    );
  }

  async evaluateCompany(evaluateArgs: EvaluateCompanyArgs, userId: string): Promise<CompanyEvaluation> {
    const { id, projectCompanyId, projectId, budgetSpend, submitted, description, evaluationDate, ...components } =
      evaluateArgs;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.evaluateCompany, {
      id,
      projectCompanyId,
      projectId,
      budgetSpend,
      submitted,
      components,
      description,
      evaluationDate,
      createdBy: userId,
    });
  }

  async updateCompanyEvaluation(evaluateArgs: EvaluateCompanyArgs): Promise<CompanyEvaluation> {
    const { id, projectId, projectCompanyId, budgetSpend, submitted, description, evaluationDate, ...components } =
      evaluateArgs;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateCompanyEvaluation, {
      id,
      projectId,
      projectCompanyId,
      budgetSpend,
      submitted,
      description,
      evaluationDate,
      components,
    });
  }

  reEvaluationCompanyEvaluation() {
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.reEvaluationCompanyEvaluation,
      {}
    );
  }

  async getTotalSpendDashboard(totalSpendDasboardArgs: InternalCompaniesDashboardArgs): Promise<any> {
    const { granularityFilter, timePeriodFilter } = totalSpendDasboardArgs;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getTotalSpendDashboard, {
      granularityFilter,
      timePeriodFilter,
    });
  }

  async checkSpentDataDashboard(): Promise<any> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.checkDataSpentDashboard, {});
  }
}
