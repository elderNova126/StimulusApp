import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ContingencyResponseUnion, ContingencyUnion } from '../models/contingency';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ContingencyService } from './contingency.service';
import { ContingencySearchArgs, ContingencyArgs } from '../dto/contingencyArgs';
import { DeleteArgs } from '../dto/deleteArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ActionResponseUnion } from '../models/baseResponse';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { TracingArgs } from '../dto/tracingArgs';

@Resolver('Contingency')
@UseInterceptors(GqlLoggingInterceptor)
export class ContingencyResolver {
  constructor(private readonly contingencyService: ContingencyService) {}

  @Query(() => ContingencyResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  contingencies(@Args() contingencySearchArgs: ContingencySearchArgs): Promise<typeof ContingencyResponseUnion> {
    return this.contingencyService.searchContingencies(contingencySearchArgs);
  }

  @Mutation(() => ContingencyUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  createContingency(
    @Args() contingencyArgs: ContingencyArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof ContingencyUnion> {
    return this.contingencyService.createContingency(contingencyArgs, tracingArgs, user.sub);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteContingency(@Args() deleteArgs: DeleteArgs): Promise<typeof ActionResponseUnion> {
    return this.contingencyService.deleteContingency(deleteArgs);
  }

  @Mutation(() => ContingencyUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  updateContingency(
    @Args() contingencyArgs: ContingencyArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof ContingencyUnion> {
    return this.contingencyService.updateContingency(contingencyArgs, tracingArgs, user.sub);
  }
}
