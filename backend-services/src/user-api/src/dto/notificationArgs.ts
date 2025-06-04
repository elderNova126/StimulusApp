import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class SearchNotificationArgs {
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  polling: boolean;
  @Field({ nullable: true })
  fromTimestamp: string;
  @Field({ nullable: true })
  companiesOnly?: boolean;
  @Field({ nullable: true })
  projectsOnly?: boolean;
  @Field({ nullable: true })
  read?: boolean;
  @Field(() => [Number], { nullable: true })
  projectIds?: number[];
  @Field(() => [String], { nullable: true })
  companyIds?: string[];
}

@ArgsType()
export class ReadNotificationArgs {
  @Field({ nullable: true })
  id?: string;
}
