import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { NotificationResponseUnion, NotificationUnion } from '../models/notification';
import { SearchNotificationArgs, ReadNotificationArgs } from '../dto/notificationArgs';
import { TenantScopeGuard } from '../auth/tenant-scope.guard';

@Resolver()
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => NotificationResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  notifications(
    @Args() notificationArgs: SearchNotificationArgs,
    @GqlUser() user
  ): Promise<typeof NotificationResponseUnion> {
    return this.notificationService.getNotifications(notificationArgs, user.sub);
  }

  @Mutation(() => NotificationUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  readNotification(@Args() notificationArgs: ReadNotificationArgs, @GqlUser() user): Promise<typeof NotificationUnion> {
    return this.notificationService.readNotification(notificationArgs, user.sub);
  }
}
