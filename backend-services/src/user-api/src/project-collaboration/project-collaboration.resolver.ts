import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, ResolveField, Resolver, Parent } from '@nestjs/graphql';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { ProjectCollaborationArgs, ProjectCollaborationSearchArgs } from '../dto/projectCollaborationArgs';
import { BaseResponse, ActionResponseUnion } from '../models/baseResponse';
import { ProjectCollaboration, ProjectCollaborationsResponse } from '../models/projectCollaboration';
import { ProjectCollaborationService } from './project-collaboration.service';
import { AuthService } from '../auth/auth.service';
import { TenantScopeGuard } from '../auth/tenant-scope.guard';

@Resolver(() => ProjectCollaboration)
export class ProjectCollaborationResolver {
  constructor(
    private readonly projectCollaborationService: ProjectCollaborationService,
    private readonly userService: AuthService
  ) {}

  @Query(() => ProjectCollaborationsResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  searchProjectCollaborations(
    @Args() projectCollaborationSearchArgs: ProjectCollaborationSearchArgs
  ): Promise<ProjectCollaborationsResponse> {
    return this.projectCollaborationService.searchProjectCollaborations(projectCollaborationSearchArgs);
  }

  @Query(() => ProjectCollaborationsResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  searchUserCollaborations(
    @Args() projectCollaborationSearchArgs: ProjectCollaborationSearchArgs
  ): Promise<ProjectCollaborationsResponse> {
    const collaboratios = this.projectCollaborationService.searchUserCollaborations(projectCollaborationSearchArgs);
    return collaboratios;
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  cancelCollaboration(@Args() projectCollaborationArgs: ProjectCollaborationArgs): Promise<typeof ActionResponseUnion> {
    return this.projectCollaborationService.cancelCollaboration(projectCollaborationArgs);
  }

  @Mutation(() => ProjectCollaboration)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  acceptCollaboration(
    @Args() projectCollaborationArgs: ProjectCollaborationArgs,
    @GqlUser() user
  ): Promise<ProjectCollaboration> {
    return this.projectCollaborationService.acceptCollaboration(projectCollaborationArgs, user?.sub);
  }

  @Mutation(() => ProjectCollaboration)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  rejectCollaboration(
    @Args() projectCollaborationArgs: ProjectCollaborationArgs,
    @GqlUser() user
  ): Promise<ProjectCollaboration> {
    return this.projectCollaborationService.rejectCollaboration(projectCollaborationArgs, user?.sub);
  }

  @Mutation(() => ProjectCollaboration)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  createProjectCollaboration(
    @Args() projectCollaborationArgs: ProjectCollaborationArgs
  ): Promise<ProjectCollaboration> {
    return this.projectCollaborationService.createProjectCollaboration(projectCollaborationArgs);
  }

  @Query(() => BaseResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  setCollaborationUserType(@Args() projectCollaborationArgs: ProjectCollaborationArgs): Promise<BaseResponse> {
    return this.projectCollaborationService.setUserType(projectCollaborationArgs);
  }

  @ResolveField()
  user(@Parent() collaboration) {
    return this.userService.getUserByInternalId(collaboration.userId);
  }
}
