import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, Length, Matches, Min } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attachment } from '../attachment/attachment.entity';
import { EvaluationTemplate } from '../evaluation/evaluation-template.entity';
import { ProjectCollaboration } from '../project-collaboration/project-collaboration.entity';
import { ProjectNote } from '../project-note/project-note.entity';
import { Score } from '../stimulus-score/stimulus-score.entity';
import { ProjectStatus } from './project.constants';
import { ProjectCompany } from './projectCompany.entity';

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: ProjectStatus.OPEN })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @OneToOne(() => EvaluationTemplate, (evaluationTemplate) => evaluationTemplate.project, { nullable: true })
  evaluationTemplate: EvaluationTemplate;

  @Column({ default: true })
  @IsOptional()
  @IsBoolean()
  ongoing: boolean;

  @Column({ nullable: false, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  budget: number;

  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  archived: boolean;

  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  deleted: boolean;

  @Column({ type: 'timestamp', nullable: true, update: false })
  @CreateDateColumn()
  created: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsDateString()
  expectedStartDate: Date;

  @OneToOne(() => Project, { nullable: true })
  @JoinColumn()
  continuationOfProject: Project;

  @OneToMany((_type) => Project, (project) => project.parentProject, { nullable: true })
  subProjects: Project[];

  @ManyToOne((_type) => Project, (project) => project.subProjects, { nullable: true })
  parentProject: Project;

  @Column({ nullable: true })
  parentProjectTreeId: number; // this is the id from Global.projectTree

  @Column({ nullable: true })
  @IsOptional()
  @IsDateString()
  expectedEndDate: Date;

  @Column({ nullable: true })
  @IsOptional()
  @IsDateString()
  startDate: Date;

  @Column({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate: Date;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true, length: 'MAX' })
  description: string;

  @Column({ nullable: true, type: 'decimal', precision: 16, scale: 0 })
  contract: number;

  @Column({ nullable: true })
  keywords: string;

  @Column({ nullable: true })
  @Index({ unique: true, where: 'internalId IS NOT NULL' })
  internalId: string;

  @Column({ nullable: true })
  scoreClientId: string;

  scoreClient: Score;

  @OneToMany((_type) => ProjectCompany, (projectCompany) => projectCompany.project, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  projectCompany: ProjectCompany[];

  @OneToMany((_type) => ProjectNote, (projectNote) => projectNote.project, { eager: false })
  notes: ProjectNote[];

  @OneToMany((_type) => ProjectCollaboration, (projectCollaboration) => projectCollaboration.project, { eager: false })
  collaborations: ProjectCollaboration[];
  @OneToMany((_type) => Attachment, (attachment) => attachment.project, { eager: false })
  attachments: Attachment[];

  @Column({ type: 'rowversion', update: false })
  rowversion: Buffer;

  @Column('simple-array', { nullable: true })
  selectionCriteria: string[];

  @Column({ nullable: true, length: '3' })
  @IsOptional()
  @Length(3, 3)
  @Matches('^[a-zA-Z]{3}$')
  currency?: string;
}
