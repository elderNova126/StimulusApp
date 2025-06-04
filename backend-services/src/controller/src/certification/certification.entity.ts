import { IsOptional, ValidateIf } from 'class-validator';
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

export enum DiverseOwnership {
  WBE = 'WBE',
  MBE = 'MBE',
  MWBE = 'MWBE',
  VOB = 'VOB',
  DSBE = 'DSBE',
  BCORP = 'BCORP',
  DBE = 'DBE',
  LGBTBE = 'LGBTBE',
}
@Entity()
export class Certification extends BaseEntity {
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

  @Column({ nullable: true, type: 'date' })
  @IsOptional()
  @ValidateIf((val) => val.certificationDate === null)
  certificationDate?: Date;

  @Column({ nullable: true, type: 'date' })
  @IsOptional()
  @ValidateIf((val) => val.expirationDate === null)
  expirationDate?: Date;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column('rowversion')
  rowversion: Buffer;

  @Column({ nullable: true })
  @Index({ unique: true, where: 'internalId IS NOT NULL' })
  internalId: string;

  @ManyToOne((_type) => Company, (company) => company.certifications, { eager: true })
  company: Company;

  @Column({ nullable: true })
  certificationNumber: string;

  @Column({ nullable: true })
  issuedBy: string;

  @Column({ nullable: true, default: false })
  diversityOwnership: boolean;

  @Column({ nullable: true })
  dataTraceSource: DataTraceSource;

  @Column('simple-json', { nullable: true })
  dataTraceMeta: DataTraceMeta;
}
