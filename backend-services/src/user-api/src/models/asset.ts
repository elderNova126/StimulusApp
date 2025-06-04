import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { UserProfileResult } from '../auth/models/user-profile-result';
import { ErrorResponse } from './baseResponse';
import { Company } from './company';

@ObjectType()
export class Asset {
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  projectId?: number;
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
  @Field(() => Company, { nullable: true })
  company: Company;
}

@ObjectType()
export class AssetWithRelation {
  @Field(() => Asset, { nullable: true })
  asset: Asset;
  @Field(() => Company, { nullable: true })
  company: Company;
  @Field(() => UserProfileResult, { nullable: true })
  user: UserProfileResult;
}

@ObjectType()
export class AssetResponse {
  @Field(() => [AssetWithRelation], { nullable: true })
  results: AssetWithRelation[];
  @Field({ nullable: true })
  count: number;
}

export const AssetsResponseUnion = createUnionType({
  name: 'AssetsResponseUnion',
  types: () => [AssetResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return AssetResponse;
  },
});

export const AssetUnion = createUnionType({
  name: 'AssetUnion',
  types: () => [Asset, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Asset;
  },
});
