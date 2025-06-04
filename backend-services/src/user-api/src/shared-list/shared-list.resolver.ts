import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TenantScopeGuard } from 'src/auth/tenant-scope.guard';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { CollaboratorsResult } from 'src/auth/models/user-profile-result';
import { ScopeContextGuard } from 'src/auth/scope-context.guard';
import { SharedListArgs } from 'src/dto/sharedListArgs';
import { SharedListResponseUnion, SharedListUnion } from 'src/models/SharedLists';
import { SharedListService } from './shared-list.service';

@Resolver()
export class SharedListResolver {
  constructor(private readonly SharedService: SharedListService) {}

  @Query(() => SharedListResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  GetSharedList(): Promise<any> {
    return this.SharedService.GetSharedList();
  }

  @Query(() => CollaboratorsResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async GetCollaboratorsList(@Args() sharedListArgs: SharedListArgs): Promise<typeof CollaboratorsResult> {
    const response = await this.SharedService.getCollaboratorsList(sharedListArgs);
    return response;
  }

  @Mutation(() => SharedListUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async createSharedList(@Args() sharedListArgs: SharedListArgs): Promise<typeof SharedListUnion> {
    return await this.SharedService.createSharedList(sharedListArgs);
  }

  @Mutation(() => SharedListUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  changeStatusSharedList(@Args() sharedListArgs: SharedListArgs): Promise<typeof SharedListUnion> {
    return this.SharedService.changeSharedList(sharedListArgs);
  }
}
