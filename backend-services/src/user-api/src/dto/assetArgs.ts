import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class AssetArgs {
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  companyId?: string;
  @Field({ nullable: true })
  userId?: string;
  @Field({ nullable: true })
  url?: string;
  @Field({ nullable: true })
  createdBy?: string;
  @Field({ nullable: true })
  created?: string;
  @Field({ nullable: true })
  updated?: string;
}
