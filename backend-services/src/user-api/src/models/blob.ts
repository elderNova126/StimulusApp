import { ObjectType, Field, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';

export enum BlobMetadataKeys {
  USERNAME = 'username',
  NAME = 'originalname',
}

export const BlobMetadataProperties = [BlobMetadataKeys.NAME, BlobMetadataKeys.USERNAME];

export const BlobMetadataMapping: Record<BlobMetadataKeys, string> = {
  [BlobMetadataKeys.NAME]: 'name',
  [BlobMetadataKeys.USERNAME]: 'userName',
};
/* eslint max-classes-per-file: 0 */

@ObjectType()
export class BlobObj {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  source: string;

  @Field({ nullable: true })
  uploadTime: Date;

  @Field({ nullable: true })
  userName: string;
}

@ObjectType()
export class ContextError {
  @Field({ nullable: true })
  errorCode: string;
  @Field({ nullable: true })
  message: string;
}

@ObjectType()
export class ValidationError {
  @Field({ nullable: true })
  errorCode: string;
  @Field({ nullable: true })
  message: string;
  @Field({ nullable: true })
  property: string;
  @Field({ nullable: true })
  value: string;
}

@ObjectType()
export class ErrorData {
  @Field(() => [ValidationError], { nullable: true })
  context: ValidationError[];
  @Field({ nullable: true })
  properties: string;
  @Field({ nullable: true })
  id: string;
}
@ObjectType()
export class ReportError {
  @Field({ nullable: true })
  code: string;
  @Field(() => ErrorData, { nullable: true })
  data: ErrorData;
}

@ObjectType()
export class UploadReportErrors {
  @Field({ nullable: true })
  id: string;

  @Field(() => [ReportError], { nullable: true })
  errors: ReportError[];
}

@ObjectType()
export class UploadReport {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  created: string;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  fileName: string;
  @Field({ nullable: true })
  errorsCount: number;
  @Field({ nullable: true })
  userId: string;
  @Field(() => [String], { nullable: true })
  affectedCompanies: string[];
}
@ObjectType()
export class BlobReport {
  @Field(() => UploadReport, { nullable: true })
  uploadReport: UploadReport;

  @Field(() => BlobObj, { nullable: true })
  blob: BlobObj;
}

@ObjectType()
export class BlobReportResponse {
  @Field(() => [BlobReport], { nullable: true })
  results: BlobReport[];
  @Field({ nullable: true })
  count: number;
}

@ObjectType()
export class BlobResult {
  @Field(() => [BlobObj], { nullable: true })
  results: BlobObj[];
  @Field({ nullable: true })
  count: number;

  constructor() {
    this.results = [];
    this.count = 0;
  }
}

export const BlobResultUnion = createUnionType({
  name: 'BlobResultResponse',
  types: () => [BlobResult, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return BlobResult;
  },
});

export const BlobReportUnion = createUnionType({
  name: 'BlobReportResponseUnion',
  types: () => [BlobReportResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return BlobReportResponse;
  },
});

export const UploadReportUnion = createUnionType({
  name: 'UploadReportUnion',
  types: () => [UploadReport, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return UploadReport;
  },
});
