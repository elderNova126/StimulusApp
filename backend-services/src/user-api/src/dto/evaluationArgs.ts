import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class EvaluateCompanyArgs {
  @Field({ nullable: true })
  id: number;
  @Field({ nullable: true })
  projectCompanyId: number;
  @Field({ nullable: true })
  projectId: number;
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
  @Field({ nullable: true })
  budgetSpend: number;
  @Field({ nullable: true })
  submitted: boolean;
  @Field({ nullable: true })
  description: string;
  @Field({ nullable: true })
  evaluationDate: string;
}

@ArgsType()
export class EvaluationArgs {
  @Field({ nullable: true })
  projectId: number;
}
