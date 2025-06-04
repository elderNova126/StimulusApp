import { Company } from './company';
import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class Contingency {
  @Field()
  id: string;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  created: string;
  @Field({ nullable: true })
  updated: string;
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  type: string;
  @Field({ nullable: true })
  description: string;
  @Field({ nullable: true })
  createdDate: string;
  @Field({ nullable: true })
  lastUpdateDate: string;
  @Field(() => Company, { nullable: true })
  company: Company;
}

@ObjectType()
export class ContingencyResponse {
  @Field(() => [Contingency], { nullable: true })
  results: Contingency[];
  @Field({ nullable: true })
  count: number;
}

export const ContingencyUnion = createUnionType({
  name: 'ContingencyUnion',
  types: () => [Contingency, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Contingency;
  },
});

export const ContingencyResponseUnion = createUnionType({
  name: 'ContingencyResponseUnion',
  types: () => [ContingencyResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return ContingencyResponse;
  },
});
