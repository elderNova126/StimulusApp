import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class ProjectCollaborationArgs {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  created: string;

  @Field({ nullable: true })
  updated: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  userType: string;

  @Field({ nullable: true })
  userId: string;

  @Field({ nullable: true })
  projectId: number;

  @Field({ nullable: true })
  startDate: string;

  @Field({ nullable: true })
  endDate: string;

  @Field({ nullable: true })
  title: string;
}

@ArgsType()
export class ProjectCollaborationSearchArgs extends ProjectCollaborationArgs {
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  orderBy?: string;
  @Field({ nullable: true })
  direction?: string;
  @Field({ nullable: true })
  startDate: string;
  @Field({ nullable: true })
  endDate: string;
  @Field({ nullable: true })
  title: string;
}
