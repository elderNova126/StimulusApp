import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class CompanyAttachmentArgs {
  @Field({ nullable: true })
  id?: number;
  @Field({ nullable: true })
  companyId?: string;
  @Field({ nullable: true })
  tenantId?: string;
  @Field({ nullable: true })
  url?: string;
  @Field({ nullable: true })
  createdBy?: string;
  @Field({ nullable: true })
  created?: string;
  @Field({ nullable: true })
  updated?: string;
  @Field({ nullable: true })
  isPrivate?: boolean;
  @Field({ nullable: true })
  type?: string;
}

@ArgsType()
export class CompanyAttachmentSearchArgs extends CompanyAttachmentArgs {
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  orderBy?: string;
  @Field({ nullable: true })
  direction?: string;
}
