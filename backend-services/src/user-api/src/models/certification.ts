import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { Company } from './company';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class Certification {
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

  @Field({ nullable: true })
  certificationDate?: string;

  @Field({ nullable: true })
  expirationDate?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  certificationNumber?: string;

  @Field({ nullable: true })
  issuedBy?: string;

  @Field(() => Company, { nullable: true })
  company?: Company;
}

@ObjectType()
export class CertificationResult {
  @Field(() => [Certification], { nullable: true })
  results: Certification[];
  @Field({ nullable: true })
  count: number;
}

export const CertificationUnion = createUnionType({
  name: 'CertificationResponse',
  types: () => [Certification, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Certification;
  },
});

export const CertificationResultUnion = createUnionType({
  name: 'CertificationResultResponse',
  types: () => [CertificationResult, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return CertificationResult;
  },
});
