import { ObjectType, Field } from '@nestjs/graphql';
import { ProjectCompany } from './project';

@ObjectType()
export class CompanyEvaluation {
  @Field()
  id: number;
  @Field({ nullable: true })
  budgetSpend: number;
  @Field({ nullable: true })
  submitted: boolean;
  @Field(() => ProjectCompany)
  projectCompany: ProjectCompany;
  @Field({ nullable: true })
  created: string;
  @Field({ nullable: true })
  updated: string;
  @Field({ nullable: true })
  createdBy: string;
  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  scoreValue: number;

  @Field({ nullable: true })
  quality: number;
  @Field({ nullable: true })
  reliability: number;
  @Field({ nullable: true })
  features: number;
  @Field({ nullable: true })
  cost: number;
  @Field({ nullable: true })
  relationship: number;
  @Field({ nullable: true })
  financial: number;
  @Field({ nullable: true })
  diversity: number;
  @Field({ nullable: true })
  innovation: number;
  @Field({ nullable: true })
  flexibility: number;
  @Field({ nullable: true })
  brand: number;
}

@ObjectType()
export class TotalSpendDashboardData {
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  Spent: number;
}

@ObjectType()
export class TotalSpendDashboardResponse {
  @Field(() => [TotalSpendDashboardData], { nullable: true })
  results: TotalSpendDashboardData[];
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
