import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { InternalCompaniesDashboardArgs } from 'src/dto/companyArgs';

import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { TenantScopeGuard } from '../auth/tenant-scope.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { EvaluateCompanyArgs, EvaluationArgs } from '../dto/evaluationArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { CompanyEvaluation, TotalSpendDashboardResponse } from '../models/companyEvaluation';
import { Evaluation, EvaluationResponseUnion } from '../models/evaluation';
import { EvaluationService } from './evaluation.service';

@Resolver(() => Evaluation)
@UseInterceptors(GqlLoggingInterceptor)
export class EvaluationResolver {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Query(() => EvaluationResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  projectEvaluation(@Args() evaluationArgs: EvaluationArgs): Promise<typeof EvaluationResponseUnion> {
    return this.evaluationService.getProjectEvaluation(evaluationArgs);
  }

  @ResolveField()
  metrics(@Parent() projectEvaluation) {
    return projectEvaluation.metrics?.map?.((metric: any) => ({ ...metric, id: metric?.id ?? metric.keyId }));
  }

  @Mutation(() => CompanyEvaluation)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  evaluateCompany(@Args() evaluateArgs: EvaluateCompanyArgs, @GqlUser() user): Promise<CompanyEvaluation> {
    return this.evaluationService.evaluateCompany(evaluateArgs, user.sub);
  }

  @Mutation(() => CompanyEvaluation)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  updateCompanyEvaluation(@Args() evaluateArgs: EvaluateCompanyArgs): Promise<CompanyEvaluation> {
    return this.evaluationService.updateCompanyEvaluation(evaluateArgs);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  async reEvaluationCompanyEvaluation() {
    const res = await this.evaluationService.reEvaluationCompanyEvaluation();
    return res && res.synchronized;
  }

  @Query(() => TotalSpendDashboardResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  getTotalSpendDashboard(@Args() totalSpendDashboardArgs: InternalCompaniesDashboardArgs): Promise<any> {
    return this.evaluationService.getTotalSpendDashboard(totalSpendDashboardArgs);
  }

  @Query(() => TotalSpendDashboardResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  checkDataSpentDashboard(): Promise<any> {
    return this.evaluationService.checkSpentDataDashboard();
  }
}
