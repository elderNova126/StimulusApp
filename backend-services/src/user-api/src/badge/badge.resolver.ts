import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { DeleteBadgeArgs, DeleteBadgeRelationsArgs } from '../dto/deleteArgs';
import { ActionResponseUnion } from '../models/baseResponse';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { BadgeResponseUnion, BadgeUnion, BadgeTenantCompanyRelationshipUnion } from 'src/models/badge';
import { BadgeArgs, BadgeSearchArgs, BadgeTenantRelationshipArgs } from 'src/dto/badgeArgs';

@Resolver('Badge')
@UseInterceptors(GqlLoggingInterceptor)
export class BadgeResolver {
  constructor(private readonly badgeService: BadgeService) {}

  @Query(() => BadgeResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async badges(@Args() badgeSearchArgs: BadgeSearchArgs): Promise<typeof BadgeResponseUnion> {
    return this.badgeService.searchBadges(badgeSearchArgs);
  }

  @Mutation(() => BadgeUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  createBadge(@Args() badgeArgs: BadgeArgs): Promise<typeof BadgeUnion> {
    return this.badgeService.createBadge(badgeArgs);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteBadge(@Args() deleteArgs: DeleteBadgeArgs): Promise<typeof ActionResponseUnion> {
    return this.badgeService.deleteBadge(deleteArgs);
  }

  @Mutation(() => BadgeUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  updateBadge(@Args() badgeArgs: BadgeArgs): Promise<typeof BadgeUnion> {
    return this.badgeService.updateBadge(badgeArgs);
  }

  @Mutation(() => BadgeTenantCompanyRelationshipUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  createBadgeTenantRelationship(
    @Args() badgeTenantRelationshipArgs: BadgeTenantRelationshipArgs
  ): Promise<typeof BadgeTenantCompanyRelationshipUnion> {
    return this.badgeService.createBadgeTenantRelationship(badgeTenantRelationshipArgs);
  }

  @Mutation(() => BadgeTenantCompanyRelationshipUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  updateBadgeTenantRelationship(
    @Args() badgeTenantRelationshipArgs: BadgeTenantRelationshipArgs
  ): Promise<typeof BadgeTenantCompanyRelationshipUnion> {
    return this.badgeService.updateBadgeTenantRelationship(badgeTenantRelationshipArgs);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteBadgeTenantRelationship(@Args() badgeTenantArgs: DeleteBadgeRelationsArgs) {
    return this.badgeService.deleteBadgeTenantRelationship(badgeTenantArgs);
  }
}
