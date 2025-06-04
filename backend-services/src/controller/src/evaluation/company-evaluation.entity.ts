import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectCompany } from '../project/projectCompany.entity';
import { CompanyEvaluationNote } from '../company-evaluation-note/company-evaluation-note.entity';
import { ErrorCodes } from 'src/company/company.constants';
import { Max } from 'class-validator';

@Entity()
export class CompanyEvaluation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;

  @Column({ nullable: true })
  createdBy: string;

  @ManyToOne(() => ProjectCompany, (projectCompany) => projectCompany.evaluations, {
    nullable: false,
    eager: false,
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  projectCompany: ProjectCompany;

  @Column({ default: 0, type: 'int' })
  @Max(2000000000, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a value smaller or equal to 2 billion',
    },
  })
  budgetSpend: number;

  @Column({ default: false })
  submitted: boolean;

  @Column({ nullable: true, length: 'MAX' })
  description: string;
  @OneToMany((_type) => CompanyEvaluationNote, (companyEvaluationNote) => companyEvaluationNote.companyEvaluation, {
    eager: false,
  })
  notes: CompanyEvaluationNote[];

  @Column({ type: 'decimal', precision: 9, scale: 3, default: 1000 })
  scoreValue: number;

  @Column({ default: 0 })
  quality: number;
  @Column({ default: 0 })
  reliability: number;
  @Column({ default: 0 })
  features: number;
  @Column({ default: 0 })
  cost: number;
  @Column({ default: 0 })
  relationship: number;
  @Column({ default: 0 })
  financial: number;
  @Column({ default: 0 })
  diversity: number;
  @Column({ default: 0 })
  innovation: number;
  @Column({ default: 0 })
  flexibility: number;
  @Column({ default: 0 })
  brand: number;
}
