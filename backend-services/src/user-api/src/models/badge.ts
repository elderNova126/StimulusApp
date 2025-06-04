import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';
import { Tenant } from './tenant';

@ObjectType()
export class Badge {
  @Field()
  id: string;

  @Field({ nullable: true })
  created: string;

  @Field({ nullable: true })
  updated: string;

  @Field({ nullable: true })
  badgeName: string;

  @Field({ nullable: true })
  badgeDescription: string;

  @Field({ nullable: true })
  badgeDateStatus: string;

  @Field({ nullable: true })
  badgeDateLabel: string;

  @Field(() => Tenant, { nullable: true })
  tenant: Tenant;

  @Field({ nullable: true })
  tenantId: string;

  @Field(() => [BadgeTenantCompanyRelationship], { nullable: true })
  badgeTenantCompanyRelationships?: BadgeTenantCompanyRelationship[];
}

@ObjectType()
export class BadgeTenantCompanyRelationship {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  badgeDate: string;

  @Field({ nullable: true })
  badgeId: string;

  @Field({ nullable: true })
  tenantCompanyRelationshipId: string;
}

@ObjectType()
export class BadgeResponse {
  @Field(() => [Badge], { nullable: true })
  results: Badge[];
  @Field({ nullable: true })
  count: number;
}

export const BadgeTenantCompanyRelationshipUnion = createUnionType({
  name: 'BadgeTenantCompanyRelationshipUnion',
  types: () => [BadgeTenantCompanyRelationship, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return BadgeTenantCompanyRelationship;
  },
});

export const BadgeUnion = createUnionType({
  name: 'BadgeUnion',
  types: () => [Badge, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Badge;
  },
});

export const BadgeResponseUnion = createUnionType({
  name: 'BadgeResponseUnion',
  types: () => [BadgeResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return BadgeResponse;
  },
});
