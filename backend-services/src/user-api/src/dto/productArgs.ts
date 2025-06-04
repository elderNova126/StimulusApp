import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class ProductArgs {
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
  description: string;
}

@ArgsType()
export class ProductSearchArgs extends ProductArgs {
  @Field({ nullable: true })
  query: string;
}
