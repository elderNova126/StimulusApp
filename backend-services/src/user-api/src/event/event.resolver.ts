import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { EventService } from './event.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { EventArgs, EventSearchArgs } from '../dto/eventArgs';
import { BaseResponse } from '../models/baseResponse';
import { DeleteArgs } from '../dto/deleteArgs';
import { Event, EventsResponse } from '../models/event';
import { TenantScopeGuard } from '../auth/tenant-scope.guard';
import { GqlUser } from '../core/decorators/gql-decorators';

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Query(() => EventsResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  searchEvents(@Args() eventSearchArgs: EventSearchArgs, @GqlUser() user): Promise<EventsResponse> {
    return this.eventService.searchEvents(eventSearchArgs, user.sub);
  }

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  createEvent(@Args() EventSearchArgs: EventArgs): Promise<Event> {
    return this.eventService.createEvent(EventSearchArgs);
  }

  @Mutation(() => BaseResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  deleteEvent(@Args() deleteArgs: DeleteArgs) {
    return this.eventService.deleteEvent(deleteArgs);
  }

  @ResolveField()
  async user(@Parent() event) {
    return this.eventService.getUser(event.userId);
  }
}
