import { controller } from 'controller-proto/codegen/tenant_pb';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../project/project.entity';

export enum CollaborationStatus {
  PENDING = 'pending',
  ACCEPT = 'accept',
  REJECTED = 'rejected',
}

export const CollaborationStatusMapping: Record<controller.UserCollaborationStatus, CollaborationStatus> = {
  [controller.UserCollaborationStatus.PENDING]: CollaborationStatus.PENDING,
  [controller.UserCollaborationStatus.ACCEPTED]: CollaborationStatus.ACCEPT,
  [controller.UserCollaborationStatus.REJECTED]: CollaborationStatus.REJECTED,
};

export enum UserType {
  COLLABORATOR = 'collaborator',
  VIEWER = 'viewer',
  OWNER = 'owner',
}

export const UserTypeMapping: Record<controller.UserCollaborationType, UserType> = {
  [controller.UserCollaborationType.COLLABORATOR]: UserType.COLLABORATOR,
  [controller.UserCollaborationType.VIEWER]: UserType.VIEWER,
  [controller.UserCollaborationType.OWNER]: UserType.OWNER,
};

@Entity()
@Unique(['userId', 'project'])
export class ProjectCollaboration extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne((_type) => Project)
  project: Project;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;

  @Column({ nullable: false, default: CollaborationStatus.PENDING })
  status: CollaborationStatus;

  @Column({ nullable: false, default: UserType.VIEWER })
  userType: UserType;
}
