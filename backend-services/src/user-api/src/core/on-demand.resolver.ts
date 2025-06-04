import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { OnDemandService } from './on-demand.service';
import { ActionResponseUnion } from '../models/baseResponse';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { TriggerCalculationArgs } from '../dto/stimulusScoreArgs';
import { TenantCompanyRelationResponseUnion } from '../models/tenantCompanyRelation';

@Resolver()
@UseInterceptors(GqlLoggingInterceptor)
export class OnDemandResolver {
  constructor(private onDemandService: OnDemandService) {}

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  triggerScoreCalculation(@Args() args: TriggerCalculationArgs): Promise<typeof ActionResponseUnion> {
    return this.onDemandService.triggerScoreCalculation(args);
  }

  @Mutation(() => TenantCompanyRelationResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  triggerRelationUpdate(): Promise<typeof TenantCompanyRelationResponseUnion> {
    return this.onDemandService.triggerRelationUpdate();
  }
}
