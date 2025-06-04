import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ScenarioService } from './scenario.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScenarioSearchArgs, ScenarioArgs } from '../dto/scenarioArgs';
import { GqlUser } from '../core/decorators/gql-decorators';
import { ActionResponseUnion } from '../models/baseResponse';
import { DeleteArgs } from '../dto/deleteArgs';
import { ScenariosResponseUnion, ScenarioUnion } from '../models/scenario';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { TenantScopeGuard } from '../auth/tenant-scope.guard';

@Resolver('Scenario')
@UseInterceptors(GqlLoggingInterceptor)
export class ScenarioResolver {
  constructor(private readonly scenarioService: ScenarioService) {}

  @Query(() => ScenariosResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  scenarios(@Args() scenarioSearchArgs: ScenarioSearchArgs, @GqlUser() user): Promise<typeof ScenariosResponseUnion> {
    return this.scenarioService.searchScenarios({ userId: user.sub, ...scenarioSearchArgs });
  }

  @Mutation(() => ScenarioUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  createScenario(@Args() scenarioArgs: ScenarioArgs, @GqlUser() user): Promise<typeof ScenarioUnion> {
    return this.scenarioService.createScenario({ userId: user.sub, ...scenarioArgs });
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  deleteScenario(@Args() deleteArgs: DeleteArgs, @GqlUser() user): Promise<typeof ActionResponseUnion> {
    return this.scenarioService.deleteScenario({ userId: user.sub, ...deleteArgs });
  }

  @Mutation(() => ScenarioUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  updateScenario(@Args() scenarioArgs: ScenarioArgs, @GqlUser() user): Promise<typeof ScenarioUnion> {
    return this.scenarioService.updateScenario({ userId: user.sub, ...scenarioArgs });
  }
}
