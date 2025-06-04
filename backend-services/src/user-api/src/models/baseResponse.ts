import { Field, ObjectType, createUnionType } from '@nestjs/graphql';

@ObjectType()
export class BaseResponse {
  @Field()
  done: boolean;

  @Field({ nullable: true })
  error?: string;
}

@ObjectType()
export class ErrorResponse {
  @Field({ nullable: true })
  code?: number;
  @Field({ nullable: true })
  message?: string;
  @Field({ nullable: true })
  details?: string;
  @Field()
  error: boolean;
}

export const ActionResponseUnion = createUnionType({
  name: 'ActionResponse',
  types: () => [BaseResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return BaseResponse;
  },
});
