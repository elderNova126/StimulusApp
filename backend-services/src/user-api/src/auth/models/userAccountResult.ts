import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserAccountResult {
  @Field()
  id: number;
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
  @Field()
  created: string;
  @Field()
  updated: string;
}
