import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CertificationArgs {
  @Field({ nullable: true })
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
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  companyId?: string;
  @Field({ nullable: true })
  certificationNumber?: string;
  @Field({ nullable: true })
  certificationDate?: string;
  @Field({ nullable: true })
  expirationDate?: string;
  @Field({ nullable: true })
  issuedBy?: string;
  @Field({ nullable: true })
  diversityOwnership?: boolean;
}

@ArgsType()
export class CertificationSearchArgs extends CertificationArgs {
  @Field({ nullable: true })
  query?: string;
}
