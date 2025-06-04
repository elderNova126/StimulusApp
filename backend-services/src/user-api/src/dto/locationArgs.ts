import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class LocationArgs {
  @Field({ nullable: true })
  companyId: string;
  @Field({ nullable: true })
  contactId: number;
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  created: string;
  @Field({ nullable: true })
  updated: string;
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  type: string;
  @Field({ nullable: true })
  addressStreet: string;
  @Field({ nullable: true })
  addressStreet2: string;
  @Field({ nullable: true })
  addressStreet3: string;
  @Field({ nullable: true })
  country: string;
  @Field({ nullable: true })
  postalCode: string;
  @Field({ nullable: true })
  city: string;
  @Field({ nullable: true })
  phone: string;
  @Field({ nullable: true })
  fax: string;
  @Field({ nullable: true })
  state: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  zip: string;
  @Field({ nullable: true })
  latitude: string;
  @Field({ nullable: true })
  longitude?: string;
}

@ArgsType()
export class LocationSearchArgs extends LocationArgs {
  @Field({ nullable: true })
  query: string;
}
