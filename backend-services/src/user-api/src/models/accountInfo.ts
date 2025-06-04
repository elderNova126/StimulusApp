import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class AccountInfo {
  @Field({ nullable: true })
  active?: number;
  @Field({ nullable: true })
  inactive?: number;
  @Field({ nullable: true })
  archived?: number;
  @Field({ nullable: true })
  total?: number;
  @Field({ nullable: true })
  convertedFromExternal?: number;
}

export const AccountInfoResponseUnion = createUnionType({
  name: 'AccountInfoResponse',
  types: () => [AccountInfo, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return AccountInfo;
  },
});
