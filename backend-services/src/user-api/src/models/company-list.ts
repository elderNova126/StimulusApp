import { CompaniesResponse } from './company';
import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';
@ObjectType()
export class CompanyList {
  @Field()
  id: string;
  @Field()
  createdBy: string;
  @Field()
  name: string;
  @Field()
  isPublic: boolean;
  @Field(() => CompaniesResponse, { nullable: true })
  companies: CompaniesResponse;
  @Field(() => [String], { nullable: true })
  companyIds: string[];
}
@ObjectType()
export class CustomCompanyList {
  @Field()
  id: string;
  @Field()
  createdBy: string;
  @Field()
  created: string;
  @Field()
  name: string;
  @Field()
  isPublic: boolean;
  @Field(() => [String], { nullable: true })
  companies: string[];
}

@ObjectType()
export class CompanyListResponse {
  @Field(() => [CompanyList], { nullable: true })
  results: CompanyList[];
  @Field({ nullable: true })
  count: number;
}

export const CompanyListUnion = createUnionType({
  name: 'CompanyListUnion',
  types: () => [CompanyList, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return CompanyList;
  },
});

export const CompanyListResponseUnion = createUnionType({
  name: 'CompanyListResponseUnion',
  types: () => [CompanyListResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return CompanyListResponse;
  },
});
