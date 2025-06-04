import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class EventArgs {
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  created: string;

  @Field({ nullable: true })
  body: string;

  @Field({ nullable: true })
  code: string;

  @Field({ nullable: true })
  level: string;

  @Field({ nullable: true })
  entityType: string;

  @Field({ nullable: true })
  userId: string;

  @Field({ nullable: true })
  entityId: string;
}

@ArgsType()
export class EventSearchArgs extends EventArgs {
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  fromTimestamp: string;
  @Field({ nullable: true })
  toTimestamp: string;
  @Field({ nullable: true })
  notUserId: string;
  @Field({ nullable: true })
  userId: string;
  @Field({ nullable: true })
  projectId: number;
  @Field({ nullable: true })
  companyId: string;
}
