import { Resolver, Args, Query, Mutation } from '@nestjs/graphql';
import { LocationService } from './location.service';
import { LocationSearchArgs, LocationArgs } from '../dto/locationArgs';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { LocationResponseUnion, LocationUnion } from '../models/location';
import { DeleteArgs } from '../dto/deleteArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ActionResponseUnion } from '../models/baseResponse';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { TracingArgs } from '../dto/tracingArgs';

@Resolver('Location')
@UseInterceptors(GqlLoggingInterceptor)
export class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Query(() => LocationResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  locations(@Args() locationSearchArgs: LocationSearchArgs): Promise<typeof LocationResponseUnion> {
    return this.locationService.searchLocations(locationSearchArgs);
  }

  @Mutation(() => LocationUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  createLocation(
    @Args() locationArgs: LocationArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof LocationUnion> {
    return this.locationService.createLocation(locationArgs, tracingArgs, user.sub);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteLocation(@Args() deleteArgs: DeleteArgs): Promise<typeof ActionResponseUnion> {
    return this.locationService.deleteLocation(deleteArgs);
  }

  @Mutation(() => LocationUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  updateLocation(
    @Args() locationArgs: LocationArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof LocationUnion> {
    return this.locationService.updateLocation(locationArgs, tracingArgs, user.sub);
  }
}
