import { BaseResponse } from './../models/baseResponse';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { DataPointService } from './data-point.service';
import { DataPoint } from '../models/dataPoint';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { DataPointArgs } from '../dto/dataPointArgs';
import { DeleteArgs } from '../dto/deleteArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { GlobalAdminScopeGuard } from '../auth/global-admin-scope.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
@Resolver('DataPoint')
@UseInterceptors(GqlLoggingInterceptor)
export class DataPointResolver {
  constructor(private readonly dataPointService: DataPointService) {}

  @Mutation(() => DataPoint)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  createDataPoint(@Args() dataPointArgs: DataPointArgs): Promise<DataPoint> {
    return this.dataPointService.createDataPoint(dataPointArgs);
  }

  @Mutation(() => BaseResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  deleteDataPoint(@Args() deleteArgs: DeleteArgs): Promise<BaseResponse> {
    return this.dataPointService.deleteDataPoint(deleteArgs);
  }

  @Mutation(() => DataPoint)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, GlobalAdminScopeGuard)
  updateDataPoint(@Args() DataPointArgs: DataPointArgs): Promise<DataPoint> {
    return this.dataPointService.updateDataPoint(DataPointArgs);
  }
}
