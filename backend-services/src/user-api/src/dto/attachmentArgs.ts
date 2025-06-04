import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class AttachmentArgs {
  @Field({ nullable: true })
  id?: number;
  @Field({ nullable: true })
  projectId?: number;
  @Field({ nullable: true })
  url?: string;
  @Field({ nullable: true })
  createdBy?: string;
  @Field({ nullable: true })
  created?: string;
  @Field({ nullable: true })
  updated?: string;
}

@ArgsType()
export class AttachmentSearchArgs extends AttachmentArgs {
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  orderBy?: string;
  @Field({ nullable: true })
  direction?: string;
}
