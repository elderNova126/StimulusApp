import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';
import { CustomCompanyList } from './company-list';
import { Tenant } from './tenant';
import { User } from './User';

@ObjectType()
export class SharedList {
  @Field()
  id: string;
  @Field()
  status: string;
  @Field()
  created: string;
  @Field()
  createdBy: string;
  @Field(() => CustomCompanyList, { nullable: true })
  companyList: CustomCompanyList;
  @Field(() => Tenant, { nullable: true })
  tenant: Tenant;
  @Field(() => User, { nullable: true })
  user: User;
}

@ObjectType()
export class SharedListResult {
  @Field(() => [SharedList], { nullable: true })
  results: SharedList[];
  @Field({ nullable: true })
  count: number;
}

export const SharedListUnion = createUnionType({
  name: 'SharedListUnion',
  types: () => [SharedList, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return SharedList;
  },
});

export const SharedListResponseUnion = createUnionType({
  name: 'SharedListResponseUnion',
  types: () => [SharedListResult, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return SharedListResult;
  },
});
