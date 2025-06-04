import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { Project } from './project';
import { ErrorResponse } from './baseResponse';

@ObjectType()
export class ProjectNote {
  @Field()
  id: number;
  @Field({ nullable: true })
  parentNote: number;
  @Field({ nullable: true })
  createdBy: string;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  created: string;
  @Field({ nullable: true })
  updated: string;
  @Field({ nullable: true })
  title: string;
  @Field({ nullable: true })
  body: string;
  @Field({ nullable: true })
  visibility: string;
  @Field({ nullable: true })
  attachments: string;
  @Field(() => Project, { nullable: true })
  project: Project;
}

@ObjectType()
export class ProjectNotesResponse {
  @Field(() => [ProjectNote], { nullable: true })
  results: ProjectNote[];
  @Field({ nullable: true })
  count: number;
}

export const ProjectNotesResponseUnion = createUnionType({
  name: 'ProjectNotesResponseUnion',
  types: () => [ProjectNotesResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return ProjectNotesResponse;
  },
});

export const ProjectNoteUnion = createUnionType({
  name: 'ProjectNoteUnion',
  types: () => [ProjectNote, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return ProjectNote;
  },
});
