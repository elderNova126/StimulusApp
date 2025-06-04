import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class Report {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  type: string;
  @Field({ nullable: true })
  code: string;
  @Field({ nullable: true })
  workspaceId: string;
  @Field({ nullable: true })
  reportId: string;
}

@ObjectType()
export class ReportDetail {
  @Field({ nullable: true })
  reportId: string;
  @Field({ nullable: true })
  reportName: string;
  @Field({ nullable: true })
  embedUrl: string;
}

@ObjectType()
export class EmbedToken {
  @Field({ nullable: true })
  token: string;
  @Field({ nullable: true })
  tokenId: string;
  @Field({ nullable: true })
  expiration: string;
}

@ObjectType()
export class EmbedParamsResponse {
  @Field(() => [ReportDetail], { nullable: true })
  reportsDetail: ReportDetail[];
  @Field({ nullable: true })
  embedToken: EmbedToken;
}

@ObjectType()
export class ReportResponse {
  @Field(() => [Report], { nullable: true })
  reports: Report[];
}

export const ReportResponseUnion = createUnionType({
  name: 'ReportResponseUnion',
  types: () => [ReportResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return ReportResponse;
  },
});

export const EmbedParamsResponseUnion = createUnionType({
  name: 'ReportParamsResponseUnion',
  types: () => [EmbedParamsResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return EmbedParamsResponse;
  },
});
