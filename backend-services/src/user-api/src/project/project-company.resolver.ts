import { Resolver, Query, Args } from '@nestjs/graphql';
import { ProjectCompanyArgs } from '../dto/projectArgs';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectCompany, ProjectCompanyResponseUnion } from '../models/project';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { GqlUser } from '../core/decorators/gql-decorators';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { TenantScopeGuard } from '../auth/tenant-scope.guard';

@Resolver(() => ProjectCompany)
@UseInterceptors(GqlLoggingInterceptor)
export class ProjectCompanyResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => ProjectCompanyResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  searchProjectCompanies(
    @Args() projectCompaniesArgs: ProjectCompanyArgs,
    @GqlUser() user
  ): Promise<typeof ProjectCompanyResponseUnion> {
    return this.projectService.searchProjectCompanies(projectCompaniesArgs, user.sub);
  }
}
