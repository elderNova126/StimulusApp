import { ValidationError } from 'class-validator';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { UploadReport } from './upload-report.entity';

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

interface ReportError {
  code: ReportErrorCode;
  data: {
    id: string;
    context: ValidationContext[];
    properties: string;
  };
}

@Entity()
export class UploadReportErrors extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne((_type) => UploadReport, (UploadReport) => UploadReport.errors) // specify inverse side as a second parameter
  uploadReport: UploadReport;

  @Column('simple-json', { nullable: true, select: true })
  errors: ReportError[];

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;
}
