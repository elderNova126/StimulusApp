import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class TriggerCalculationArgs {
  @Field({ nullable: true })
  companyId: string;
}
@ArgsType()
export class StimulusScoreArgs {
  @Field({ nullable: true })
  id: number;
  @Field({ nullable: true })
  companyId: string;
  @Field({ nullable: true })
  internalCompanyId: string;
  @Field({ nullable: true })
  brandValue: number;
  @Field({ nullable: true })
  employeeValue: number;
  @Field({ nullable: true })
  customerValue: number;
  @Field({ nullable: true })
  longevityValue: number;
  @Field({ nullable: true })
  scoreValue: number;
  @Field({ nullable: true })
  timestamp: string;
}

@ArgsType()
export class StimulusScoreSearchArgs extends StimulusScoreArgs {
  @Field({ nullable: true })
  query: string;
  @Field({ nullable: true })
  page: number;
  @Field({ nullable: true })
  limit: number;
  @Field({ nullable: true })
  orderBy: string;
  @Field({ nullable: true })
  direction: string;
  @Field({ nullable: true })
  timestampFrom: string;
  @Field({ nullable: true })
  timestampTo: string;
}
