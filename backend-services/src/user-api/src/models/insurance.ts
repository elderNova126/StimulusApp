import { Company } from './company';
import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class Insurance {
  @Field()
  id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  created?: string;

  @Field({ nullable: true })
  updated?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  coverageLimit: number;

  @Field({ nullable: true })
  coverageStart: string;

  @Field({ nullable: true })
  coverageEnd: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  insurer: string;

  @Field({ nullable: true })
  policyNumber: string;

  @Field(() => Company, { nullable: true })
  company: Company;
}

@ObjectType()
export class InsuranceResponse {
  @Field(() => [Insurance], { nullable: true })
  results: Insurance[];
  @Field({ nullable: true })
  count: number;
}

export const InsuranceUnion = createUnionType({
  name: 'InsuranceUnion',
  types: () => [Insurance, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Insurance;
  },
});

export const InsuranceResponseUnion = createUnionType({
  name: 'InsuranceResponseUnion',
  types: () => [InsuranceResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return InsuranceResponse;
  },
});
