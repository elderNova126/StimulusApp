import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class SwitchTenantArgs {
  @Field({ nullable: true })
  tenantId?: string;
}
