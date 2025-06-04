import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { Project } from './project';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class ProjectAttachment {
  @Field({ nullable: true })
  id?: number;
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
  @Field({ nullable: true })
  size?: string;
  @Field(() => Project, { nullable: true })
  project: Project;
}

@ObjectType()
export class ProjectAttachmentResponse {
  @Field(() => [ProjectAttachment], { nullable: true })
  results: ProjectAttachment[];
  @Field({ nullable: true })
  count: number;
}

export const ProjectAttachmentsResponseUnion = createUnionType({
  name: 'ProjectAttachmentsResponseUnion',
  types: () => [ProjectAttachmentResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return ProjectAttachmentResponse;
  },
});

export const ProjectAttachmentUnion = createUnionType({
  name: 'ProjectAttachmentUnion',
  types: () => [ProjectAttachment, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return ProjectAttachment;
  },
});
