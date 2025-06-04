import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class TenantArgs {
  // tenant company
  @Field()
  name: string;
  @Field()
  departmentName: string;
  @Field()
  ein: string;
  @Field()
  duns: string;

  // tenant account
  @Field()
  stimulusPlan: string;
  @Field()
  paymentMethod: string;
  @Field()
  nameOnCard: string;
  @Field()
  cardNumber: string;
  @Field()
  cardExpirationDate: string;
  @Field()
  postalCode: string;
  @Field()
  country: string;
}
