import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';
import { Company } from './company';
import { Tenant } from './tenant';

@ObjectType()
export class TenantCompanyRelationResponse {
  @Field(() => [TenantCompanyRelation], { nullable: true })
  results: TenantCompanyRelation[];
}
@ObjectType()
export class TenantCompanyRelation {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  created: string;

  @Field({ nullable: true })
  isFavorite: boolean;

  @Field({ nullable: true })
  isToCompare: boolean;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  type: string;

  @Field({ nullable: true })
  internalName: string;

  @Field({ nullable: true })
  internalId: string;

  @Field(() => Company, { nullable: true })
  company: Company;

  @Field({ nullable: true })
  totalSpent?: number;

  @Field({ nullable: true })
  noOfProjects?: number;

  @Field({ nullable: true })
  tenant: Tenant;

  @Field({ nullable: true })
  supplierTier: number;
}

export const TenantCompanyRelationResponseUnion = createUnionType({
  name: 'TenantCompanyRelationResponseUnion',
  types: () => [TenantCompanyRelationResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return TenantCompanyRelationResponse;
  },
});

export const TenantCompanyRelationUnion = createUnionType({
  name: 'TenantCompanyRelationUnion',
  types: () => [TenantCompanyRelation, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return TenantCompanyRelation;
  },
});
