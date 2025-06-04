import { Company } from './company';
import { ObjectType, Field, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class Contact {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  created: Date;
  @Field({ nullable: true })
  updated: Date;
  @Field({ nullable: true })
  title: string;
  @Field({ nullable: true })
  firstName: string;
  @Field({ nullable: true })
  middleName: string;
  @Field({ nullable: true })
  suffix: string;
  @Field({ nullable: true })
  lastName: string;
  @Field({ nullable: true })
  fullName: string;
  @Field({ nullable: true })
  department: string;
  @Field({ nullable: true })
  jobTitle: string;
  @Field({ nullable: true })
  addressStreet: string;
  @Field({ nullable: true })
  addressStreet2: string;
  @Field({ nullable: true })
  addressStreet3: string;
  @Field({ nullable: true })
  city: string;
  @Field({ nullable: true })
  state: string;
  @Field({ nullable: true })
  addressPostalCode: string;
  @Field({ nullable: true })
  country: string;
  @Field({ nullable: true })
  email: string;
  @Field({ nullable: true })
  emailAlt: string;
  @Field({ nullable: true })
  phone: string;
  @Field({ nullable: true })
  phoneAlt: string;
  @Field({ nullable: true })
  fax: string;
  @Field({ nullable: true })
  faxAlt: string;
  @Field({ nullable: true })
  gender: string;
  @Field({ nullable: true })
  ethnicity: string;
  @Field({ nullable: true })
  language: string;
  @Field({ nullable: true })
  languageAlt: string;
  @Field({ nullable: true })
  manager: string;
  @Field({ nullable: true })
  linkedin: string;
  @Field({ nullable: true })
  twitter: string;
  @Field({ nullable: true })
  website: string;
  @Field({ nullable: true })
  zip: string;
  @Field({ nullable: true })
  latitude: string;
  @Field({ nullable: true })
  longitude: string;
  @Field({ nullable: true })
  pronouns: string;
  @Field({ nullable: true })
  type: string;
  @Field({ nullable: true })
  tenantId: string;
  @Field(() => Company, { nullable: true })
  company: Company;
}

@ObjectType()
export class ContactResponse {
  @Field(() => [Contact], { nullable: true })
  results: Contact[];
  @Field({ nullable: true })
  count: number;
}

export const ContactUnion = createUnionType({
  name: 'ContactUnion',
  types: () => [Contact, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Contact;
  },
});

export const ContactResponseUnion = createUnionType({
  name: 'ContactResponseUnion',
  types: () => [ContactResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return ContactResponse;
  },
});
