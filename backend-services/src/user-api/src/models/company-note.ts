import { Company } from './company';
import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';
@ObjectType()
export class CompanyNote {
  @Field()
  id: number;
  @Field({ nullable: true })
  parentNote: number;
  @Field({ nullable: true })
  createdBy: string;
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
  @Field(() => Company, { nullable: true })
  company: Company;
}

@ObjectType()
export class CompanyNotesResponse {
  @Field(() => [CompanyNote], { nullable: true })
  results: CompanyNote[];
  @Field({ nullable: true })
  count: number;
}

export const CompanyNoteUnion = createUnionType({
  name: 'CompanyNoteUnion',
  types: () => [CompanyNote, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return CompanyNote;
  },
});

export const CompanyNotesResponseUnion = createUnionType({
  name: 'CompanyNotesResponseUnion',
  types: () => [CompanyNotesResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return CompanyNotesResponse;
  },
});
