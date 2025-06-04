import { DataTraceMeta, DataTraceSource } from 'src/core/datatrace.types';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../company/company.entity';

@Entity()
export class Insurance extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true, type: 'decimal', precision: 16, scale: 3 })
  coverageLimit: number;

  @Column({ nullable: true })
  coverageStart: Date;

  @Column({ nullable: true })
  coverageEnd: Date;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column('rowversion')
  rowversion: Buffer;

  @Column({ nullable: true })
  @Index({ unique: true, where: 'internalId IS NOT NULL' })
  internalId: string;

  @ManyToOne((_type) => Company, (company) => company.insuranceCoverage, { eager: true })
  company: Company;

  @Column({ nullable: true })
  insurer: string;

  @Column({ nullable: true })
  policyNumber: string;

  @Column({ nullable: true })
  dataTraceSource: DataTraceSource;

  @Column('simple-json', { nullable: true })
  dataTraceMeta: DataTraceMeta;
}
