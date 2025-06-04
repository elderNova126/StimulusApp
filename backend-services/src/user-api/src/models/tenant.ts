import { CompanyTenantResult } from './../auth/models/companyTenantResult';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserAccountResult } from '../auth/models/userAccountResult';

@ObjectType()
export class Tenant {
  @Field()
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  isDefault: boolean;

  @Field({ nullable: true })
  provisionStatus: string;

  @Field(() => UserAccountResult, { nullable: true })
  account: UserAccountResult;

  @Field(() => CompanyTenantResult, { nullable: true })
  tenantCompany?: CompanyTenantResult;
}
