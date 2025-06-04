import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class BadgeArgs {
  @Field({ nullable: true })
  id?: string;

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
}

@ArgsType()
export class BadgeTenantRelationshipArgs {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  badgeDate?: string;

  @Field({ nullable: true })
  badgeId?: string;

  @Field({ nullable: true })
  tenantCompanyRelationshipId?: string;
}

@ArgsType()
export class BadgeSearchArgs extends BadgeArgs {
  @Field({ nullable: true })
  query: string;
}
