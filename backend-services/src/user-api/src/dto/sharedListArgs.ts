import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class SharedListArgs {
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  listId?: string;
  @Field({ nullable: true })
  listName?: string;
  @Field({ nullable: true })
  userId?: string;
  @Field({ nullable: true })
  tenantId?: string;
  @Field({ nullable: true })
  created?: Date;
  @Field({ nullable: true })
  status?: string;
}

@ArgsType()
export class SharedListSearchArgs extends SharedListArgs {
  @Field({ nullable: true })
  page: number;
  @Field({ nullable: true })
  limit: number;
  @Field({ nullable: true })
  orderBy: string;
}
