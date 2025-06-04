import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlUser } from 'src/core/decorators/gql-decorators';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { DeleteArgs } from '../dto/deleteArgs';
import { InsuranceArgs, InsuranceSearchArgs } from '../dto/insuranceArgs';
import { TracingArgs } from '../dto/tracingArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ActionResponseUnion } from '../models/baseResponse';
import { InsuranceResponseUnion, InsuranceUnion } from '../models/insurance';
import { InsuranceService } from './insurance.service';
@Resolver('Insurance')
@UseInterceptors(GqlLoggingInterceptor)
export class InsuranceResolver {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Query(() => InsuranceResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  insuranceCoverage(@Args() insuranceSearchArgs: InsuranceSearchArgs): Promise<typeof InsuranceResponseUnion> {
    return this.insuranceService.searchInsurances(insuranceSearchArgs);
  }

  @Mutation(() => InsuranceUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  createInsurance(
    @Args() insuranceSearchArgs: InsuranceArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof InsuranceUnion> {
    return this.insuranceService.createInsurance(insuranceSearchArgs, tracingArgs, user.sub);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteInsurance(@Args() deleteArgs: DeleteArgs): Promise<typeof ActionResponseUnion> {
    return this.insuranceService.deleteInsurance(deleteArgs);
  }

  @Mutation(() => InsuranceUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  updateInsurance(
    @Args() insuranceArgs: InsuranceArgs,
    @Args() tracingArgs: TracingArgs,
    @GqlUser() user
  ): Promise<typeof InsuranceUnion> {
    return this.insuranceService.updateInsurance(insuranceArgs, tracingArgs, user.sub);
  }
}
