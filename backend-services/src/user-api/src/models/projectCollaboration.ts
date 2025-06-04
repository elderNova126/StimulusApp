import { Field, ObjectType } from '@nestjs/graphql';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { UserProfileResult } from '../auth/models/user-profile-result';
import { Project } from './project';

export enum UserType {
  COLLABORATOR = 'collaborator',
  VIEWER = 'viewer',
  OWNER = 'owner',
}

export const UserTypeMapping: Record<UserType, controller.UserCollaborationType> = {
  [UserType.COLLABORATOR]: controller.UserCollaborationType.COLLABORATOR,
  [UserType.VIEWER]: controller.UserCollaborationType.VIEWER,
  [UserType.OWNER]: controller.UserCollaborationType.OWNER,
};

@ObjectType()
export class ProjectCollaboration {
  @Field()
  id: string;
  @Field()
  created: string;
  @Field({ nullable: true })
  updated: string;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  userType: string;
  @Field({ nullable: true })
  userId: string;
  @Field({ nullable: true })
  user: UserProfileResult;
  @Field({ nullable: true })
  projectId: string;
  @Field(() => Project, { nullable: true })
  project: Project;
}

@ObjectType()
export class ProjectCollaborationsResponse {
  @Field(() => [ProjectCollaboration], { nullable: true })
  results: ProjectCollaboration[];
  @Field({ nullable: true })
  count: number;
}
