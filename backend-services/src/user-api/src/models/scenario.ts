import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class Scenario {
  @Field()
  id: number;
  @Field()
  userId: string;
  @Field({ nullable: true })
  created: Date;
  @Field({ nullable: true })
  updated: Date;
  @Field()
  public: boolean;
  @Field()
  name: string;
}

@ObjectType()
export class ScenariosResponse {
  @Field(() => [Scenario], { nullable: true })
  results: Scenario[];
  @Field({ nullable: true })
  count: number;
}

export const ScenarioUnion = createUnionType({
  name: 'ScenarioUnion',
  types: () => [Scenario, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Scenario;
  },
});

export const ScenariosResponseUnion = createUnionType({
  name: 'ScenariosResponseUnion',
  types: () => [ScenariosResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return ScenariosResponse;
  },
});
