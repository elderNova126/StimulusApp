import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { DeleteIndustryArgs } from '../dto/deleteArgs';
import { ActionResponseUnion } from '../models/baseResponse';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { TracingArgs } from '../dto/tracingArgs';
import { IndustryService } from './industry.service';
import { IndustryResponseUnion, IndustryUnion } from '../models/industry';
import { IndustryArgs } from '../dto/industryArgs';

@Resolver('Industry')
export class IndustryResolver {
  constructor(private readonly industryService: IndustryService) {}

  @Query(() => IndustryResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async industries(): Promise<typeof IndustryResponseUnion> {
    return this.industryService.getAllIndustries();
  }

  @Mutation(() => IndustryUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  createIndustry(
    @Args() industryArgs: IndustryArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof IndustryUnion> {
    return this.industryService.createIndustry(industryArgs, tracingArgs, user.sub);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteIndustry(@Args() deleteArgs: DeleteIndustryArgs): Promise<typeof ActionResponseUnion> {
    return this.industryService.deleteIndustry(deleteArgs);
  }

  @Mutation(() => IndustryUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  updateIndustry(
    @Args() industryArgs: IndustryArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof IndustryUnion> {
    return this.industryService.updateIndustry(industryArgs, tracingArgs, user.sub);
  }
}
