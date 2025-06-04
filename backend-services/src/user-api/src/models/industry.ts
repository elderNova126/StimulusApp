// eslint-disable-next-line max-classes-per-file
import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';
import { Company } from './company';

@ObjectType()
export class Industry {
  @Field()
  id: string;
  @Field({ nullable: true })
  title: string;
  @Field({ nullable: true })
  description: string;
  @Field({ nullable: true })
  code: string;
  @Field(() => Company, { nullable: true })
  company: Company;
}

@ObjectType()
export class IndustryResponse {
  @Field(() => [Industry], { nullable: true })
  results: Industry[];
  @Field({ nullable: true })
  count: number;
}

export const IndustryUnion = createUnionType({
  name: 'IndustryUnion',
  types: () => [Industry, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Industry;
  },
});

export const IndustryResponseUnion = createUnionType({
  name: 'IndustryResponseUnion',
  types: () => [IndustryResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return IndustryResponse;
  },
});
