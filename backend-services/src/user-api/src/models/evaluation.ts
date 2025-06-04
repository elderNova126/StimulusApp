import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { Project } from './project';
import { Metric } from './evaluationMetric';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class Evaluation {
  @Field()
  id: string;
  @Field(() => Project)
  project: Project;
  @Field(() => [Metric])
  metrics: Metric[];
}

export const EvaluationResponseUnion = createUnionType({
  name: 'EvaluationResponseUnion',
  types: () => [Evaluation, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Evaluation;
  },
});
