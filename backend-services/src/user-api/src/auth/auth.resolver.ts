import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlTenantId, GqlUser } from '../core/decorators/gql-decorators';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ActionResponseUnion } from '../models/baseResponse';
import { Role } from '../models/role';
import { AuthService } from './auth.service';
import { BaseEntity, ChangeStatusApiKeyArgs, CreateApiKeyArgs } from './dto/apikeyArgs';
import { SwitchTenantArgs } from './dto/switchTenantArgs';
import {
  FindByNameArgs,
  InviteUserArgs,
  TopicCategoryArgs,
  UserIdentifierArgs,
  UserNotificationArgs,
  UserProfileArgs,
} from './dto/userProfileArgs';
import { GlobalAdminScopeGuard } from './global-admin-scope.guard';
import { GqlAuthGuard } from './gql-auth.guard';
import { ApiKey, ApiKeysResults, OperationSuccessfully } from './models/apiKeyResults';
import { RequestAccessResult } from './models/requestAccessResult';
import { ScopeContextResult } from './models/scopeContextResult';
import {
  UserNotificationResult,
  UserProfileResult,
  UsersProfileResult,
  UserSearchArgs,
  UsersResult,
} from './models/user-profile-result';
import { UserAccountResult } from './models/userAccountResult';
import { ScopeContextGuard } from './scope-context.guard';
import { TenantScopeGuard } from './tenant-scope.guard';

@Resolver(() => UserProfileResult)
@UseInterceptors(GqlLoggingInterceptor)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => UserProfileResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async userProfile(@Args() userProfileArgs: UserIdentifierArgs, @GqlUser() user) {
    return this.authService.getUser(userProfileArgs?.externalAuthSystemId ?? user.sub);
  }

  @Query(() => UserNotificationResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  userNotificationProfile(@GqlUser() user) {
    return this.authService.getNotificationProfile(user.sub);
  }

  @Query(() => UserAccountResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  userAccount() {
    return this.authService.getUserAccount();
  }

  @Query(() => [Role])
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  userTenantRoles(@GqlUser() user, @GqlTenantId() tenantId) {
    return this.authService.getUserTenantRoles({
      externalAuthSystemId: user.sub,
      tenantId,
    });
  }

  @Query(() => UsersResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  tenantUsers(@GqlTenantId() tenantId, @Args() userSearchArgs: UserSearchArgs) {
    return this.authService.getTenantUsers(
      tenantId,
      userSearchArgs.page,
      userSearchArgs.limit,
      userSearchArgs.typeOfList
    );
  }

  @Query(() => [UserProfileResult])
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  tenantMyUsers(@GqlTenantId() tenantId, @GqlUser() user) {
    const externalAuthSystemId = user.sub;
    return this.authService.getTenantMyUsers(tenantId, externalAuthSystemId);
  }

  @Mutation(() => UserProfileResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  updateUserProfile(@Args() userProfileArgs: UserProfileArgs) {
    return this.authService.updateUserProfile(userProfileArgs);
  }

  @Mutation(() => UserProfileResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  updateMyProfile(@Args() userProfileArgs: UserProfileArgs, @GqlUser() user) {
    return this.authService.updateUserProfile({ ...userProfileArgs, externalAuthSystemId: user.sub });
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteUser(@Args() userProfileArgs: UserProfileArgs) {
    return this.authService.deleteUser(userProfileArgs.externalAuthSystemId);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  deleteTenantUser(@Args() userProfileArgs: UserProfileArgs) {
    return this.authService.deleteTenantUser(userProfileArgs.externalAuthSystemId);
  }

  @Mutation(() => ScopeContextResult)
  @UseGuards(GqlAuthGuard)
  issueContextToken(@Args() switchTenantArgs: SwitchTenantArgs, @GqlUser() user) {
    return this.authService.issueScopeContextToken(user.sub, switchTenantArgs.tenantId);
  }

  @Mutation(() => RequestAccessResult)
  @UseGuards(GqlAuthGuard)
  requestAccess(@GqlUser() user) {
    return this.authService.requestAccess({ externalAuthSystemId: user.sub });
  }

  @Mutation(() => UserNotificationResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  subscribeToTopic(@Args() topicArgs: UserNotificationArgs) {
    return this.authService.subscribeToTopic(topicArgs);
  }

  @Mutation(() => UserNotificationResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  subscribeToCategoryTopic(@Args() topicArgs: TopicCategoryArgs) {
    return this.authService.subscribeToCategoryTopic(topicArgs);
  }

  @Mutation(() => UserNotificationResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  unsubscribeFromCategoryTopic(@Args() topicArgs: TopicCategoryArgs) {
    return this.authService.unsubscribeFromCategoryTopic(topicArgs);
  }

  @Mutation(() => UserNotificationResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  unsubscribeFromTopic(@Args() topicArgs: UserNotificationArgs) {
    return this.authService.unsubscribeFromTopic(topicArgs);
  }

  @Mutation(() => UserProfileResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  inviteTenantUser(@Args() inviteUserArgs: InviteUserArgs) {
    const { email, resend } = inviteUserArgs;
    return this.authService.inviteTenantUser(email, resend);
  }

  @Query(() => UsersProfileResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async getUserByName(@Args() user: FindByNameArgs) {
    return this.authService.getUserByNameAndSurname(user);
  }

  @Query(() => UserProfileResult)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async getUserById(@Args() user: UserProfileArgs) {
    return this.authService.getUserById(user);
  }

  @Query(() => ApiKeysResults)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  async getApiKeys() {
    return await this.authService.getApiKeys();
  }

  @Mutation(() => ApiKey)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async createNewApiKey(@Args() apiKey: CreateApiKeyArgs) {
    return await this.authService.createNewApiKey(apiKey);
  }

  @Mutation(() => ApiKey)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async updateApiKey(@Args() apiKey: ChangeStatusApiKeyArgs) {
    return await this.authService.updateApiKey(apiKey);
  }

  @Mutation(() => OperationSuccessfully)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  async removeApiKey(@Args() args: BaseEntity) {
    const result = await this.authService.deleteApiKey(args);
    return result;
  }
}
