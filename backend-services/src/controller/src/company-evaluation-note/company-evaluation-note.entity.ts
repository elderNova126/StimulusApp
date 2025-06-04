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
import { CompanyEvaluation } from '../evaluation/company-evaluation.entity';

@Entity()
export class CompanyEvaluationNote extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((_type) => CompanyEvaluationNote, (note) => note.parentNote)
  replies: CompanyEvaluationNote[];

  @ManyToOne((_type) => CompanyEvaluationNote, (note) => note.replies, { nullable: true })
  @JoinColumn()
  parentNote: CompanyEvaluationNote;

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

  @ManyToOne((_type) => CompanyEvaluation, (companyEvaluation) => companyEvaluation.notes, { eager: true })
  companyEvaluation: CompanyEvaluation;
}
