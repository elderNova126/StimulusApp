import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../project/project.entity';

@Entity()
export class ProjectNote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((_type) => ProjectNote, (note) => note.parentNote)
  replies: ProjectNote[];

  @ManyToOne((_type) => ProjectNote, (note) => note.replies, { nullable: true })
  @JoinColumn()
  parentNote: ProjectNote;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true, type: 'text' })
  body: string;

  @Column({ nullable: true })
  visibility: string;

  @Column({ nullable: true, type: 'text' })
  attachments: string;

  @Column('rowversion')
  rowversion: Buffer;

  @ManyToOne((_type) => Project, (project) => project.notes, { eager: true })
  project: Project;
}
