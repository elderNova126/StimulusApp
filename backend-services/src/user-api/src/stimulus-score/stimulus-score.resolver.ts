import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { DeleteArgs } from '../dto/deleteArgs';
import { StimulusScoreArgs, StimulusScoreSearchArgs } from '../dto/stimulusScoreArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ActionResponseUnion } from '../models/baseResponse';
import { StimulusScore, StimulusScoreResponseUnion, StimulusScoreUnion } from '../models/stimulusScore';
import { StimulusScoreService } from './stimulus-score.service';

@Resolver(() => StimulusScore)
@UseInterceptors(GqlLoggingInterceptor)
export class StimulusScoreResolver {
  constructor(private readonly stimulusScoreService: StimulusScoreService) {}

  @Query(() => StimulusScoreResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  stimulusScores(@Args() stimulusScoreSearchArgs: StimulusScoreSearchArgs): Promise<typeof StimulusScoreResponseUnion> {
    return this.stimulusScoreService.searchStimulusScores(stimulusScoreSearchArgs);
  }

  @Mutation(() => StimulusScoreUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  createStimulusScore(@Args() stimulusScoreArgs: StimulusScoreArgs): Promise<typeof StimulusScoreUnion> {
    return this.stimulusScoreService.createStimulusScore(stimulusScoreArgs);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteStimulusScore(@Args() deleteArgs: DeleteArgs): Promise<typeof ActionResponseUnion> {
    return this.stimulusScoreService.deleteStimulusScore(deleteArgs);
  }

  @Mutation(() => StimulusScoreUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  updateStimulusScore(@Args() stimulusScoreArgs: StimulusScoreArgs): Promise<typeof StimulusScoreUnion> {
    return this.stimulusScoreService.updateStimulusScore(stimulusScoreArgs);
  }

  @ResolveField()
  timestamp(@Parent() score): string {
    if (typeof score.timestamp !== 'undefined') {
      return new Date(score.timestamp).toISOString();
    }
  }
}
