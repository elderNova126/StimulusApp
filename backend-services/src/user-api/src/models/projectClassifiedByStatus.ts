import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class ProjectStatusClassified {
  @Field()
  companyId: string;

  @Field({ nullable: true })
  NEW: number;

  @Field({ nullable: true })
  OPEN: number;

  @Field({ nullable: true })
  INREVIEW: number;

  @Field({ nullable: true })
  INPROGRESS: number;

  @Field({ nullable: true })
  COMPLETED: number;

  @Field({ nullable: true })
  CANCELED: number;
}
@ObjectType()
export class CompanyTypeClassification {
  @Field()
  companyId: string;

  @Field({ nullable: true })
  CONSIDERED: number;

  @Field({ nullable: true })
  QUALIFIED: number;

  @Field({ nullable: true })
  SHORTLISTED: number;

  @Field({ nullable: true })
  AWARDED: number;

  @Field({ nullable: true })
  CLIENT: number;
}

@ObjectType()
export class ProjectStatusClassifiedResponse {
  @Field(() => ProjectStatusClassified, { nullable: true })
  results: ProjectStatusClassified;

  @Field({ nullable: true })
  count: number;
}

@ObjectType()
export class CompanyTypeClassificationResponse {
  @Field(() => CompanyTypeClassification, { nullable: true })
  results: CompanyTypeClassification;

  @Field({ nullable: true })
  count: number;
}

@ObjectType()
export class RelationShipPanelInfoResponse {
  @Field(() => ProjectStatusClassifiedResponse, { nullable: true })
  projectStatusClassification: ProjectStatusClassifiedResponse;

  @Field(() => CompanyTypeClassificationResponse, { nullable: true })
  CompanyTypeClassification: CompanyTypeClassificationResponse;
}

export const ProjectStatusClassifiedUnion = createUnionType({
  name: 'ProjectStatusClassifiedUnion',
  types: () => [ProjectStatusClassifiedResponse, ErrorResponse],
  resolveType: (value) => (value?.error ? ErrorResponse : ProjectStatusClassifiedResponse),
});

export const CompanyTypeClassificationUnion = createUnionType({
  name: 'CompanyTypeClassificationUnion',
  types: () => [CompanyTypeClassificationResponse, ErrorResponse],
  resolveType: (value) => (value?.error ? ErrorResponse : CompanyTypeClassificationResponse),
});

export const RelationShipPanelInfoUnion = createUnionType({
  name: 'CompanyTypeClassificationUnion',
  types: () => [RelationShipPanelInfoResponse, ErrorResponse],
  resolveType: (value) => (value?.error ? ErrorResponse : RelationShipPanelInfoResponse),
});
