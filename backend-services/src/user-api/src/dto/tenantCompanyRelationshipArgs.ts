import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class SettingsArgs {
  @Field({ nullable: true })
  isFavorite?: boolean;
  @Field({ nullable: true })
  isToCompare?: boolean;
}

@ArgsType()
export class TenantCompanyArgs extends SettingsArgs {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  companyId: string;
  @Field({ nullable: true })
  internalId: string;
  @Field({ nullable: true })
  internalName: string;
}

@ArgsType()
export class BulkCompanyArgs extends SettingsArgs {
  @Field(() => [String], { nullable: true })
  companyIds: string[];
}
