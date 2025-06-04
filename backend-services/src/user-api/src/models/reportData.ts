import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class ReportData {
  @Field({ nullable: true })
  accessToken: string;
  @Field({ nullable: true })
  embedUrl: string;
  @Field({ nullable: true })
  reportPage: string;
}

@ObjectType()
export class ReportDataResponse {
  @Field({ nullable: true })
  reportData: ReportData;
}

export const ReportDataResponseUnion = createUnionType({
  name: 'ReportDataResponseUnion',
  types: () => [ReportDataResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return ReportDataResponse;
  },
});
