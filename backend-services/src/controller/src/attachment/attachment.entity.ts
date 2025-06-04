import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { Project } from '../project/project.entity';

@Entity()
export class Attachment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true })
  originalFilename: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'timestamp', nullable: true, update: false })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true, update: false })
  @UpdateDateColumn()
  updated: Date;

  @ManyToOne((_type) => Project, (project) => project.attachments, { eager: true, nullable: true })
  project: Project;
}
