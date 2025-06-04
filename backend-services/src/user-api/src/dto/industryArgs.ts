import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class IndustryArgs {
  @Field({ nullable: true })
  companyId?: string;
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  title?: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  code?: string;
}

@ArgsType()
export class IndustrySearchArgs extends IndustryArgs {
  @Field({ nullable: true })
  query: string;
}
