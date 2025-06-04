import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class DeleteArgs {
  @Field({ nullable: true })
  id: number;
}

@ArgsType()
export class DeleteIndustryArgs {
  @Field({ nullable: true })
  id: string;
}

@ArgsType()
export class DeleteBadgeArgs {
  @Field({ nullable: true })
  id: string;
}

@ArgsType()
export class DeleteBadgeRelationsArgs {
  @Field(() => [String], { nullable: true })
  ids: string[];
}

@ArgsType()
export class DeleteCompanyArgs {
  @Field(() => [String], { nullable: true })
  ids: string[];
}
