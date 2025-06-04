import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class InsuranceArgs {
  @Field({ nullable: true })
  companyId: string;
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  created: string;
  @Field({ nullable: true })
  updated: string;
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  type: string;
  @Field({ nullable: true })
  coverageLimit: number;
  @Field({ nullable: true })
  coverageStart: string;
  @Field({ nullable: true })
  coverageEnd: string;
  @Field({ nullable: true })
  description: string;
  @Field({ nullable: true })
  insurer: Date;
  @Field({ nullable: true })
  policyNumber: string;
}

@ArgsType()
export class InsuranceSearchArgs extends InsuranceArgs {
  @Field({ nullable: true })
  query: string;
}
