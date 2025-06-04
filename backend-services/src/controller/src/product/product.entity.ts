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
export class Product extends BaseEntity {
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

  @Column({ nullable: true, length: 'MAX' })
  description: string;

  @Column('rowversion')
  rowversion: Buffer;

  @Column({ nullable: true })
  @Index({ unique: true, where: 'internalId IS NOT NULL' })
  internalId: string;

  @ManyToOne((_type) => Company, (company) => company.products, { eager: false })
  company: Company;

  @Column({ nullable: true })
  dataTraceSource: DataTraceSource;

  @Column('simple-json', { nullable: true })
  dataTraceMeta: DataTraceMeta;
}
