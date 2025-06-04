import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';
import { Company } from './company';
import { Tenant } from './tenant';

@ObjectType()
export class CompanyAttachment {
  @Field({ nullable: true })
  id?: number;
  @Field({ nullable: true })
  companyId?: string;
  @Field({ nullable: true })
  tenantId?: string;
  @Field({ nullable: true })
  url?: string;
  @Field({ nullable: true })
  filename?: string;
  @Field({ nullable: true })
  originalFilename?: string;
  @Field({ nullable: true })
  createdBy?: string;
  @Field({ nullable: true })
  created?: string;
  @Field({ nullable: true })
  updated?: string;
  @Field({ nullable: true })
  size?: string;
  @Field({ nullable: true })
  isPrivate?: boolean;
  @Field({ nullable: true })
  type?: string;
  @Field(() => Company, { nullable: true })
  company: Company;
  @Field(() => Tenant, { nullable: true })
  tenant: Tenant;
}

@ObjectType()
export class CompanyAttachmentResponse {
  @Field(() => [CompanyAttachment], { nullable: true })
  results: CompanyAttachment[];
  @Field({ nullable: true })
  count: number;
}

export const CompanyAttachmentsResponseUnion = createUnionType({
  name: 'CompanyAttachmentsResponseUnion',
  types: () => [CompanyAttachmentResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return CompanyAttachmentResponse;
  },
});

export const CompanyAttachmentUnion = createUnionType({
  name: 'CompanyAttachmentUnion',
  types: () => [CompanyAttachment, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return CompanyAttachment;
  },
});
