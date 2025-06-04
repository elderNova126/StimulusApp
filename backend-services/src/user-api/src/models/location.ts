import { Contact } from './contact';
import { Company } from './company';
import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class Location {
  @Field()
  id?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  created?: string;

  @Field({ nullable: true })
  updated?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  type?: string;

  @Field(() => Company, { nullable: true })
  company?: Company;

  @Field(() => Contact, { nullable: true })
  contact?: Contact;

  @Field({ nullable: true })
  addressStreet?: string;

  @Field({ nullable: true })
  addressStreet2?: string;

  @Field({ nullable: true })
  addressStreet3?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  fax?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  zip?: string;

  @Field({ nullable: true })
  latitude?: string;

  @Field({ nullable: true })
  longitude?: string;
}

@ObjectType()
export class LocationResponse {
  @Field(() => [Location], { nullable: true })
  results: Location[];
  @Field({ nullable: true })
  count: number;
}

export const LocationUnion = createUnionType({
  name: 'LocationUnion',
  types: () => [Location, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Location;
  },
});

export const LocationResponseUnion = createUnionType({
  name: 'LocationResponseUnion',
  types: () => [LocationResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return LocationResponse;
  },
});
