import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ProjectArgs {
  @Field({ nullable: true })
  companyId: string;
  @Field({ nullable: true })
  companyType: string;
  @Field({ nullable: true })
  id: number;
  @Field({ nullable: true })
  budget: number;
  @Field({ nullable: true })
  ongoing: boolean;
  @Field({ nullable: true })
  archived: boolean;
  @Field({ nullable: true })
  deleted: boolean;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
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
  targetScore: number;
  @Field({ nullable: true })
  keywords: string;
  @Field({ nullable: true })
  parentProjectTreeId: number;
  @Field(() => [String], { nullable: true })
  selectionCriteria: string[];
  @Field({ nullable: true })
  currency: string;
}

@ArgsType()
export class ProjectCompaniesArgs {
  @Field()
  projectId: number;
  @Field(() => [String], { nullable: true })
  companyIds: string[];
}

@ArgsType()
export class ProjectCompanyArgs {
  @Field()
  projectId: number;
  @Field({ nullable: true })
  companyId: string;
  @Field({ nullable: true })
  companyType: string;
  @Field({ nullable: true })
  criteriaAnswers: string;
}
@ArgsType()
export class ProjectSearchArgs extends ProjectArgs {
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  orderBy?: string;
  @Field({ nullable: true })
  direction?: string;
  @Field({ nullable: true })
  continuationOfProject?: number;
  @Field({ nullable: true })
  parentProject?: number;
  @Field(() => [String], { nullable: true })
  statusIn: string[];
  @Field({ nullable: true })
  userId?: string;
  @Field({ nullable: true })
  accessType?: string;
  @Field({ nullable: true })
  companyId: string;
}

@ArgsType()
export class ProjectActivityLogArgs {
  @Field({ nullable: true })
  projectId: number;
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  orderBy?: string;
  @Field({ nullable: true })
  direction?: string;
}

@ArgsType()
export class CloneProjectArgs {
  @Field()
  id: number;
  @Field()
  title: string;
  @Field()
  relation: string;
  @Field()
  userId: string;
  @Field({ nullable: true })
  includeDescription?: boolean;
  @Field({ nullable: true })
  includeSuppliers?: boolean;
  @Field({ nullable: true })
  includeNotes?: boolean;
  @Field({ nullable: true })
  includeCriteria?: boolean;
  @Field({ nullable: true })
  includePeople?: boolean;
  @Field(() => [String], { nullable: true })
  people: string[];
  @Field({ nullable: true })
  includeBudget: boolean;
  @Field({ nullable: true })
  includeKeywords: boolean;
  @Field({ nullable: true })
  includeAttatchment: boolean;
}
