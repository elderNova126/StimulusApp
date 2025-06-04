import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { InternalCompaniesDashboardArgs } from 'src/dto/companyArgs';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { ScopeContextGuard } from '../auth/scope-context.guard';
import { TenantScopeGuard } from '../auth/tenant-scope.guard';
import { GqlUser } from '../core/decorators/gql-decorators';
import { DeleteArgs } from '../dto/deleteArgs';
import { NoteSearchArgs } from '../dto/noteArgs';
import {
  CloneProjectArgs,
  ProjectActivityLogArgs,
  ProjectArgs,
  ProjectCompanyArgs,
  ProjectSearchArgs,
} from '../dto/projectArgs';
import { GqlLoggingInterceptor } from '../logging/gql-logging.interceptor';
import { ActionResponseUnion } from '../models/baseResponse';
import { EvaluationResponseUnion } from '../models/evaluation';
import { EventsResponseUnion } from '../models/event';
import {
  Project,
  ProjectCompanyUnion,
  ProjectDashboardResponse,
  ProjectsResponseUnion,
  ProjectSubsetResponse,
  ProjectUnion,
} from '../models/project';
import { ProjectNotesResponseUnion } from '../models/project-note';
import { RelationShipPanelInfoUnion } from '../models/projectClassifiedByStatus';
import { ProjectCollaboration } from '../models/projectCollaboration';
import { ProjectCollaborationService } from '../project-collaboration/project-collaboration.service';
import { ProjectCompaniesArgs } from './../dto/projectArgs';
import { ProjectService } from './project.service';

@Resolver(() => Project)
@UseInterceptors(GqlLoggingInterceptor)
export class ProjectResolver {
  private TablesName = {
    INTERNAL_PROJECT: 'searchProjects',
    TIER_2_TABLE: 'searchSupplierTierProjects',
    OTHER_PROJECT_TABLE: 'searchOtherTierProjects',
  };
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectCollaborationService: ProjectCollaborationService
  ) {}

  @Query(() => ProjectsResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  searchProjects(@Args() projectSearchArgs: ProjectSearchArgs, @GqlUser() user): Promise<typeof ProjectsResponseUnion> {
    return this.projectService.searchProjects(projectSearchArgs, user.sub, this.TablesName.INTERNAL_PROJECT);
  }

  @Query(() => ProjectsResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  searchSupplierTierProjects(
    @Args() projectSearchArgs: ProjectSearchArgs,
    @GqlUser() user
  ): Promise<typeof ProjectsResponseUnion> {
    return this.projectService.searchProjects(projectSearchArgs, user.sub, this.TablesName.TIER_2_TABLE);
  }

  @Query(() => ProjectsResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  SearchOtherTierProjects(
    @Args() projectSearchArgs: ProjectSearchArgs,
    @GqlUser() user
  ): Promise<typeof ProjectsResponseUnion> {
    return this.projectService.searchProjects(projectSearchArgs, user.sub, this.TablesName.OTHER_PROJECT_TABLE);
  }

  @Query(() => ProjectsResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  searchAllProjects(
    @Args() projectSearchArgs: ProjectSearchArgs,
    @GqlUser() user
  ): Promise<typeof ProjectsResponseUnion> {
    return this.projectService.searchAllProjects(projectSearchArgs, user.sub);
  }

  @Query(() => ProjectSubsetResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  searchProjectsSubset(@Args({ name: 'query', type: () => String }) query: string): Promise<ProjectSubsetResponse> {
    return this.projectService.searchProjectsSubset(query);
  }

  @Query(() => EventsResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  projectActivityLog(
    @Args() projectActivityArgs: ProjectActivityLogArgs,
    @GqlUser() user
  ): Promise<typeof EventsResponseUnion> {
    return this.projectService.getProjectActivityLog(projectActivityArgs, user.sub);
  }

  @Query(() => RelationShipPanelInfoUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  RelationShipPanelInfo(
    @Args() projectSearchArgs: ProjectSearchArgs,
    @GqlUser() user
  ): Promise<typeof RelationShipPanelInfoUnion> {
    return this.projectService.getRelationShipPanelInfo(projectSearchArgs, user.sub);
  }

  @ResolveField()
  async evaluation(@Parent() project): Promise<typeof EvaluationResponseUnion> {
    return this.projectService.getProjectEvaluation(project.id);
  }

  @ResolveField()
  notes(@Args() noteSearchArgs: NoteSearchArgs, @Parent() project): Promise<typeof ProjectNotesResponseUnion> {
    return this.projectService.searchNotes({ ...noteSearchArgs, projectId: project.id });
  }

  @ResolveField()
  async continuationOfProject(
    @Args() projectSearchArgs: ProjectSearchArgs,
    @Parent() project,
    @GqlUser() user
  ): Promise<typeof ProjectsResponseUnion> {
    if (project.continuationOfProject) {
      const response: any = await this.projectService.searchProjects(
        {
          ...projectSearchArgs,
          id: project.continuationOfProject,
        },
        user.sub,
        this.TablesName.INTERNAL_PROJECT
      );

      return response?.results?.length ? response.results[0] : null;
    }
  }

  @ResolveField()
  async isContinuedByProject(
    @Args() projectSearchArgs: ProjectSearchArgs,
    @Parent() project,
    @GqlUser() user
  ): Promise<typeof ProjectUnion> {
    const response: any = await this.projectService.searchProjects(
      {
        ...projectSearchArgs,
        continuationOfProject: project.id,
      },
      user.sub,
      this.TablesName.INTERNAL_PROJECT
    );

    return response?.results?.length ? response.results[0] : null;
  }

  @ResolveField()
  async parentProject(
    @Args() projectSearchArgs: ProjectSearchArgs,
    @Parent() project,
    @GqlUser() user
  ): Promise<typeof ProjectUnion> {
    if (project.parentProject) {
      const response: any = await this.projectService.searchProjects(
        {
          ...projectSearchArgs,
          id: project.parentProject,
        },
        user.sub,
        this.TablesName.INTERNAL_PROJECT
      );

      return response?.results?.length ? response.results[0] : null;
    }
  }

  @ResolveField()
  async subProjects(
    @Args() projectSearchArgs: ProjectSearchArgs,
    @Parent() project,
    @GqlUser() user
  ): Promise<typeof ProjectsResponseUnion> {
    const response: any = await this.projectService.searchProjects(
      { ...projectSearchArgs, parentProject: project.id },
      user.sub,
      this.TablesName.INTERNAL_PROJECT
    );

    return response?.results;
  }

  @ResolveField()
  async collaboration(@Parent() project): Promise<ProjectCollaboration> {
    if (!project.createdBy) {
      return null;
    }
    const { results, count } = await this.projectCollaborationService.getProjectUserCollaborations(
      project.id,
      project.createdBy
    );
    return count > 0 ? results?.[0] : null;
  }

  @Mutation(() => ProjectUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  createProject(@Args() projectArgs: ProjectArgs, @GqlUser() user): Promise<typeof ProjectUnion> {
    return this.projectService.createProject(projectArgs, user.sub);
  }

  @Mutation(() => ProjectUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  cancelProject(@Args() deleteArgs: DeleteArgs): Promise<typeof ProjectUnion> {
    return this.projectService.cancelProject(deleteArgs);
  }

  @Mutation(() => ActionResponseUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  deleteProject(@Args() deleteArgs: DeleteArgs): Promise<typeof ActionResponseUnion> {
    return this.projectService.markProjectAsDeleted(deleteArgs);
  }

  @Mutation(() => ProjectUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  cloneProject(@Args() cloneArgs: CloneProjectArgs, @GqlUser() user): Promise<typeof ProjectUnion> {
    return this.projectService.cloneProject(cloneArgs, user.sub);
  }

  @Mutation(() => ProjectUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  updateProject(@Args() projectArgs: ProjectArgs, @GqlUser() user): Promise<typeof ProjectUnion> {
    return this.projectService.updateProject(projectArgs, user.sub);
  }

  /**
   * Updating projectCompany details
   */
  @Mutation(() => ProjectCompanyUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  updateProjectCompanies(@Args() projectCompaniesArgs: ProjectCompanyArgs): Promise<typeof ProjectCompanyUnion> {
    return this.projectService.updateProjectCompanies(projectCompaniesArgs);
  }

  /**
   *  Adding projectCompanie to the project
   */
  @Mutation(() => ProjectUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  addCompaniesToProject(@Args() projectCompaniesArgs: ProjectCompaniesArgs): Promise<typeof ProjectUnion> {
    return this.projectService.addCompaniesToProject(projectCompaniesArgs);
  }

  @Mutation(() => ProjectCompanyUnion)
  @UseGuards(GqlAuthGuard, ScopeContextGuard, TenantScopeGuard)
  answerProjectCriteria(@Args() projectCompaniesArgs: ProjectCompanyArgs): Promise<typeof ProjectCompanyUnion> {
    return this.projectService.answerProjectCriteria(projectCompaniesArgs);
  }

  @Query(() => ProjectDashboardResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  getProjectsDashboard(@Args() projectsDashboardArgs: InternalCompaniesDashboardArgs): Promise<any> {
    return this.projectService.getProjectsDashboard(projectsDashboardArgs);
  }

  @Query(() => ProjectDashboardResponse)
  @UseGuards(GqlAuthGuard, ScopeContextGuard)
  checkDataProjectsDashboard(): Promise<any> {
    return this.projectService.checkProjectsDataDashboard();
  }
}
