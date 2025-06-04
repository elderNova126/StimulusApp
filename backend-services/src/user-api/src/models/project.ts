import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { Company } from './company';
import { ProjectNotesResponseUnion } from './project-note';
import { ErrorResponse } from './baseResponse';
import { ProjectCollaboration } from './projectCollaboration';
import { Evaluation } from './evaluation';
import { CompanyEvaluation } from './companyEvaluation';

@ObjectType()
export class ProjectSubset {
  @Field({ nullable: true })
  id: number;
  @Field({ nullable: true })
  title: string;
}
@ObjectType()
export class ProjectSubsetResponse {
  @Field(() => [ProjectSubset], { nullable: true })
  results: ProjectSubset[];
}
@ObjectType()
export class Project {
  @Field({ nullable: true })
  id: number;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  ongoing: boolean;
  @Field({ nullable: true })
  archived: boolean;
  @Field({ nullable: true })
  deleted: boolean;
  @Field({ nullable: true })
  created: string;
  @Field()
  createdBy: string;
  @Field({ nullable: true })
  expectedStartDate: string;
  @Field({ nullable: true })
  expectedEndDate: string;
  @Field({ nullable: true })
  startDate: string;
  @Field({ nullable: true })
  endDate: string;
  @Field({ nullable: true })
  title: string;
  @Field({ nullable: true })
  description: string;
  @Field({ nullable: true })
  contract: number;
  @Field({ nullable: true })
  budget: number;
  @Field({ nullable: true })
  parentProjectTreeId: number;
  @Field({ nullable: true })
  treeProjectId: number;
  @Field({ nullable: true })
  targetScore: number;
  @Field({ nullable: true })
  keywords: string;
  @Field(() => [ProjectCompany], { nullable: true })
  projectCompany: ProjectCompany[];
  @Field(() => ProjectNotesResponseUnion, { nullable: true })
  notes?: typeof ProjectNotesResponseUnion;
  @Field(() => Project, { nullable: true })
  continuationOfProject: Project;
  @Field(() => Project, { nullable: true })
  isContinuedByProject: Project;
  @Field(() => Project, { nullable: true })
  parentProject: Project;
  @Field(() => [Project], { nullable: true })
  subProjects: Project[];
  @Field(() => ProjectCollaboration, { nullable: true })
  collaboration: ProjectCollaboration;
  @Field(() => [ProjectCollaboration], { nullable: true })
  collaborations: ProjectCollaboration[];
  @Field(() => Evaluation, { nullable: true })
  evaluation: Evaluation;
  @Field(() => [String], { nullable: true })
  selectionCriteria: string[];
  @Field({ nullable: true })
  currency: string;
  @Field({ nullable: true })
  scoreProject: number;

  @Field({ nullable: true })
  searchProjects: number;
}

@ObjectType()
export class CriteriaAnswer {
  @Field({ nullable: true })
  criteria: string;
  @Field({ nullable: true })
  answer: boolean;
}

@ObjectType()
export class ProjectCompany {
  @Field({ nullable: true })
  id: number;
  @Field({ nullable: true })
  companyId: string;
  @Field(() => Company, { nullable: true })
  company: Company;
  @Field(() => Project, { nullable: true })
  project: Project;
  @Field({ nullable: true })
  type: string;
  @Field(() => [CompanyEvaluation], { nullable: true })
  evaluations: CompanyEvaluation[];
  @Field(() => [CriteriaAnswer], { nullable: true })
  criteriaAnswers: CriteriaAnswer[];
  @Field(() => [ProjectCompany], { nullable: true })
  suppliers: ProjectCompany[];
}

@ObjectType()
export class ProjectDashboardData {
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  Projects: number;
}

@ObjectType()
export class ProjectDashboardResponse {
  @Field(() => [ProjectDashboardData], { nullable: true })
  results: ProjectDashboardData[];
  @Field({ nullable: true })
  count: number;
  @Field({ nullable: true })
  checkPrevYear: number;
  @Field({ nullable: true })
  hasData: boolean;
  @Field({ nullable: true })
  prevYear: number;
  @Field({ nullable: true })
  currentYear: number;
}

@ObjectType()
export class ProjectsResponse {
  @Field(() => [Project], { nullable: true })
  results: Project[];
  @Field({ nullable: true })
  count: number;
}

@ObjectType()
export class ProjectCompanyResponse {
  @Field(() => [ProjectCompany], { nullable: true })
  results: ProjectCompany[];
  @Field({ nullable: true })
  count: number;
}

export const ProjectsResponseUnion = createUnionType({
  name: 'ProjectsResponseUnion',
  types: () => [ProjectsResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return ProjectsResponse;
  },
});

export const ProjectCompanyUnion = createUnionType({
  name: 'ProjectCompanyUnion',
  types: () => [ProjectCompany, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return ProjectCompany;
  },
});

export const ProjectCompanyResponseUnion = createUnionType({
  name: 'ProjectCompanyResponseUnion',
  types: () => [ProjectCompanyResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return ProjectCompanyResponse;
  },
});

export const ProjectUnion = createUnionType({
  name: 'ProjectUnion',
  types: () => [Project, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Project;
  },
});
