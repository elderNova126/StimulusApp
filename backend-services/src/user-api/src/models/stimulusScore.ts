import { Company } from './company';
import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class StimulusScore {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  timestamp: string;
  @Field({ nullable: true })
  brandValue: number;
  @Field({ nullable: true })
  employeeValue: number;
  @Field({ nullable: true })
  customerValue: number;
  @Field({ nullable: true })
  longevityValue: number;
  @Field({ nullable: true })
  scoreValue: number;
  @Field({ nullable: true })
  quality: number;
  @Field({ nullable: true })
  reliability: number;
  @Field({ nullable: true })
  features: number;
  @Field({ nullable: true })
  cost: number;
  @Field({ nullable: true })
  relationship: number;
  @Field({ nullable: true })
  financial: number;
  @Field({ nullable: true })
  diversity: number;
  @Field({ nullable: true })
  innovation: number;
  @Field({ nullable: true })
  flexibility: number;
  @Field({ nullable: true })
  brand: number;
  @Field(() => Company, { nullable: true })
  company: Company;
}

@ObjectType()
export class StimulusScoreResponse {
  @Field(() => [StimulusScore], { nullable: true })
  results: StimulusScore[];
  @Field({ nullable: true })
  count: number;
}

export const StimulusScoreResponseUnion = createUnionType({
  name: 'StimulusScoreResponseUnion',
  types: () => [StimulusScoreResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return StimulusScoreResponse;
  },
});

export const StimulusScoreUnion = createUnionType({
  name: 'StimulusScoreUnion',
  types: () => [StimulusScore, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return StimulusScore;
  },
});
