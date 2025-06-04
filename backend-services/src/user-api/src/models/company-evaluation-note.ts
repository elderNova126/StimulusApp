import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';
import { CompanyEvaluation } from './companyEvaluation';
@ObjectType()
export class CompanyEvaluationNote {
  @Field()
  id: number;
  @Field({ nullable: true })
  parentNote: number;
  @Field({ nullable: true })
  createdBy: string;
  @Field({ nullable: true })
  createdByName: string;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  created: string;
  @Field({ nullable: true })
  updated: string;
  @Field({ nullable: true })
  title: string;
  @Field({ nullable: true })
  body: string;
  @Field({ nullable: true })
  visibility: string;
  @Field({ nullable: true })
  attachments: string;
  @Field(() => CompanyEvaluation, { nullable: true })
  companyEvaluation: CompanyEvaluation;
}

@ObjectType()
export class CompanyEvaluationNotesResponse {
  @Field(() => [CompanyEvaluationNote], { nullable: true })
  results: CompanyEvaluationNote[];
  @Field({ nullable: true })
  count: number;
}

export const CompanyEvaluationNoteUnion = createUnionType({
  name: 'CompanyEvaluationNoteUnion',
  types: () => [CompanyEvaluationNote, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return CompanyEvaluationNote;
  },
});

export const CompanyEvaluationNotesResponseUnion = createUnionType({
  name: 'CompanyEvaluationNotesResponseUnion',
  types: () => [CompanyEvaluationNotesResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return CompanyEvaluationNotesResponse;
  },
});
