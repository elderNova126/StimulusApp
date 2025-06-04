import { DataTraceSource, DataTraceMeta } from 'src/core/datatrace.types';
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../company/company.entity';

@Entity()
export class DataPoint extends BaseEntity {
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
  dataTimeStamp: Date;

  @Column({ nullable: true })
  dataSerialId: string;

  @Column({ nullable: true })
  dataId: string;

  @Column({ nullable: true, length: 'MAX' })
  dataValue: string;

  @Column({ nullable: true })
  dataTraceSource: DataTraceSource;

  @Column('simple-json', { nullable: true })
  dataTraceMeta: DataTraceMeta;

  @Column('rowversion')
  rowversion: Buffer;

  @Column({ nullable: true })
  @Index({ unique: true, where: 'internalId IS NOT NULL' })
  internalId: string;

  @ManyToOne((_type) => Company, { eager: true })
  company: Company;

  @Column({ nullable: true })
  element: string;
}
