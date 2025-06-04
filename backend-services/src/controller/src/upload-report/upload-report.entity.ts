import { Min, ValidationError } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UploadReportErrors } from './upload-report-errors.entity';

export enum ReportErrorCode {
  INGEST_FILE = 'INGEST_FILE',
  INGEST_COMPANY = 'INGEST_COMPANY',
  INGEST_CONTACT = 'INGEST_CONTACT',
  INGEST_LOCATION = 'INGEST_LOCATION',
  INGEST_CONTINGENCY = 'INGEST_CONTINGENCY',
  INGEST_INSURANCE = 'INGEST_INSURANCE',
  INGEST_CERTIFICATION = 'INGEST_CERTIFICATION',
  INGEST_PRODUCT = 'INGEST_PRODUCT',
  INGEST_PROJECT = 'INGEST_PROJECT',
  INGEST_DATAPOINT = 'INGEST_DATAPOINT',
}

export interface ValidationContext {
  target?: object;
  property: string;
  value?: any;
  children?: ValidationError[];
  errorCode?: string;
  message?: string;
}

@Entity()
export class UploadReport extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;

  @Column({ nullable: true, default: 'INITIALIZED' })
  status: string;

  @Column({ nullable: true })
  fileName: string;

  @OneToOne((_type) => UploadReportErrors, (errors) => errors.errors, { eager: false, onDelete: 'SET NULL' })
  @JoinColumn()
  errors: Promise<UploadReportErrors>;

  @Column({ nullable: false, default: 0 })
  @Min(0, {
    context: {
      message: 'must be a number equal or above 0',
    },
  })
  errorsCount: number;

  @Column({ nullable: false })
  userId: string;

  @Column('simple-array', { nullable: true })
  affectedCompanies: string[];
}
