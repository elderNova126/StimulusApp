import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Report } from 'src/models/report';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { GqlAuthGuard } from './../auth/gql-auth.guard';
import { ScopeContextGuard } from './../auth/scope-context.guard';
import { TenantScopeGuard } from './../auth/tenant-scope.guard';
import { EmbedMultipleReportsArgs, EmbedReportArgs } from './../dto/reportArgs';
import { EmbedParamsResponseUnion, ReportResponseUnion } from './../models/report';
import { ReportingService } from './reporting.service';

@Resolver(() => Report)
@UseInterceptors(GqlLoggingInterceptor)
export class ReportingResolver {
  constructor(private readonly reportingService: ReportingService) {}

  @Query(() => ReportResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  reports(): Promise<typeof ReportResponseUnion> {
    return this.reportingService.getAllReports();
  }

  @Query(() => EmbedParamsResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  reportParameters(@Args() args: EmbedReportArgs): Promise<typeof EmbedParamsResponseUnion> {
    return this.reportingService.getReportEmbeddingParameters(args);
  }

  @Query(() => EmbedParamsResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  reportsParameters(@Args() args: EmbedMultipleReportsArgs): Promise<typeof EmbedParamsResponseUnion> {
    return this.reportingService.getMultipleReportsEmbeddingParameters(args);
  }
}
