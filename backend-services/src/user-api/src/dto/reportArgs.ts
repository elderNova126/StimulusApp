import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class EmbedReportArgs {
  @Field()
  workspaceId: string;
  @Field()
  reportId: string;
}

@ArgsType()
export class EmbedMultipleReportsArgs {
  @Field()
  workspaceId: string;
  @Field(() => [String], { nullable: true })
  reportIds: string[];
}
