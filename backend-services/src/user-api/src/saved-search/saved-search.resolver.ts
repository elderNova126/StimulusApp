import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TenantScopeGuard } from 'src/auth/tenant-scope.guard';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { DeleteArgs } from '../dto/deleteArgs';
import { SavedSearchArgs } from '../dto/savedSearchArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ActionResponseUnion } from '../models/baseResponse';
import { SavedSearch, SavedSearchResponseUnion, SavedSearchUnion } from '../models/savedSearch';
import { SavedSearchService } from './saved-search.service';

@Resolver(() => SavedSearch)
@UseInterceptors(GqlLoggingInterceptor)
export class SavedSearchResolver {
  constructor(private readonly savedSearchService: SavedSearchService) {}

  @Query(() => SavedSearchResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  savedSearches(@Args() savedSearchArgs: SavedSearchArgs, @GqlUser() user): Promise<typeof SavedSearchResponseUnion> {
    return this.savedSearchService.getSavedSearches({ ...savedSearchArgs, userId: user.sub });
  }

  @Mutation(() => SavedSearch)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  createSavedSearch(@Args() savedSearchArgs: SavedSearchArgs, @GqlUser() user): Promise<typeof SavedSearchUnion> {
    return this.savedSearchService.createSavedSearch({ ...savedSearchArgs, userId: user.sub });
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  deleteSavedSearch(@Args() deleteArgs: DeleteArgs, @GqlUser() user): Promise<typeof ActionResponseUnion> {
    return this.savedSearchService.deleteSavedSearch({ ...deleteArgs, userId: user.sub });
  }

  @Mutation(() => SavedSearch)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  updateSavedSearch(@Args() savedSearchArgs: SavedSearchArgs, @GqlUser() user): Promise<typeof SavedSearchUnion> {
    return this.savedSearchService.updateSavedSearch({ ...savedSearchArgs, userId: user.sub });
  }
}
