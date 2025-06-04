import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ReportDataArgs {
  @Field()
  tenantName: string;
}
