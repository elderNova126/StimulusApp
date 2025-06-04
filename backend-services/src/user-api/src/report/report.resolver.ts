import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Resolver, Query } from '@nestjs/graphql';
import { ReportData, ReportDataResponseUnion } from 'src/models/reportData';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ReportService } from './report.service';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { ScopeContextGuard } from 'src/auth/scope-context.guard';
import { TenantScopeGuard } from 'src/auth/tenant-scope.guard';
import { ReportDataArgs } from 'src/dto/reportDataArgs';

@Resolver(() => ReportData)
@UseInterceptors(GqlLoggingInterceptor)
export class ReportResolver {
  constructor(private readonly reportService: ReportService) {}

  @Query(() => ReportDataResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  reportData(@Args() args: ReportDataArgs): Promise<typeof ReportDataResponseUnion> {
    return this.reportService.getReportData(args);
  }
}
