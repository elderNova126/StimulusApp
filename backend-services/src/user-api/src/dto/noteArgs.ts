import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class NoteArgs {
  @Field({ nullable: true })
  id?: number;
  @Field({ nullable: true })
  companyId?: string;
  @Field({ nullable: true })
  projectId?: number;
  @Field({ nullable: true })
  companyEvaluationId?: number;
  @Field({ nullable: true })
  parentNoteId?: number;
  @Field({ nullable: true })
  createdBy?: string;
  @Field({ nullable: true })
  status?: string;
  @Field({ nullable: true })
  created?: string;
  @Field({ nullable: true })
  updated?: string;
  @Field({ nullable: true })
  title?: string;
  @Field({ nullable: true })
  body?: string;
  @Field({ nullable: true })
  visibility?: string;
  @Field({ nullable: true })
  attachments?: string;
}

@ArgsType()
export class NoteSearchArgs extends NoteArgs {
  @Field({ nullable: true })
  query?: string;
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  orderBy?: string;
  @Field({ nullable: true })
  direction?: string;
}
