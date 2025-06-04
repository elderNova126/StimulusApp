import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../company/company.entity';
import { DataTraceMeta, DataTraceSource } from '../core/datatrace.types';
import { Tenant } from 'src/tenant/tenant.entity';

@Entity()
export class Industry extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @JoinColumn()
  id: string;

  @Column({ nullable: true, length: '119' })
  title: string;

  @Column({ nullable: true, length: 'MAX' })
  description: string;

  @Column({ nullable: true, length: '6' })
  code: string;

  @ManyToMany((_type) => Company, (company) => company.industries, { eager: false })
  company: Company;

  @ManyToMany((_type) => Tenant, (tenant) => tenant.industries, { eager: false })
  tenant: Tenant[];

  @Column({ nullable: true })
  @Index({ unique: true, where: 'internalId IS NOT NULL' })
  internalId: string;

  @Column('rowversion')
  rowversion: Buffer;

  @Column({ nullable: true })
  dataTraceSource: DataTraceSource;

  @Column('simple-json', { nullable: true })
  dataTraceMeta: DataTraceMeta;
}
