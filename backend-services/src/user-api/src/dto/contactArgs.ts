import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class ContactArgs {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  companyId: string;
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
  fullName: string;
  @Field({ nullable: true })
  middleName: string;
  @Field({ nullable: true })
  suffix: string;
  @Field({ nullable: true })
  lastName: string;
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
  addressCity: string;
  @Field({ nullable: true })
  addressState: string;
  @Field({ nullable: true })
  addressPostalCode: string;
  @Field({ nullable: true })
  addressCountry: string;
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
  type: string;
  @Field({ nullable: true })
  tenantId: string;
}

@ArgsType()
export class ContactSearchArgs extends ContactArgs {
  @Field({ nullable: true })
  query: string;
}
