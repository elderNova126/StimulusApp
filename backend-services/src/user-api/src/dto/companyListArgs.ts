import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CompanyListArgs {
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  name?: string;
  @Field(() => [String], { nullable: true })
  companyIds?: string[];
  @Field({ nullable: true })
  isPublic?: boolean;
  @Field({ nullable: true })
  tenantId?: string;
}

@ArgsType()
export class CompanyListSearchArgs {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  userId: string;
  @Field({ nullable: true })
  isPublic: boolean;

  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  orderBy?: string;
  @Field({ nullable: true })
  direction?: string;
}
