import { DataTraceSource, DataTraceMeta } from '../core/datatrace.types';
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from 'typeorm';
import { Company } from '../company/company.entity';
import { Location } from '../location/location.entity';
import { Tenant } from 'src/tenant/tenant.entity';

@Entity()
@Check(`("type" = 'public' AND "tenantId" IS NULL) OR ("type" = 'private' AND "tenantId" IS NOT NULL)`)
export class Contact extends BaseEntity {
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
  title: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  suffix: string;

  @Column({ nullable: true })
  lastName: string;

  @Column('rowversion')
  rowversion: Buffer;

  @Column({ nullable: true })
  @Index({ unique: true, where: 'internalId IS NOT NULL' })
  internalId: string;

  @ManyToOne((_type) => Company, (company) => company.contacts, { eager: true })
  company: Company;

  @OneToOne((_type) => Location, (location) => location.contact, { eager: false })
  location: Location;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  addressStreet: string;

  @Column({ nullable: true })
  addressStreet2: string;

  @Column({ nullable: true })
  addressStreet3: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  addressPostalCode: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  emailAlt: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  phoneAlt: string;

  @Column({ nullable: true })
  fax: string;

  @Column({ nullable: true })
  faxAlt: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  ethnicity: string;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  languageAlt: string;

  @Column({ nullable: true })
  manager: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  zip: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;

  @Column({ nullable: true })
  pronouns: string;

  @Column({ nullable: true })
  dataTraceSource: DataTraceSource;

  @Column('simple-json', { nullable: true })
  dataTraceMeta: DataTraceMeta;

  @Column({
    type: 'varchar',
    default: 'public',
  })
  type: 'public' | 'private';

  @ManyToOne((_type) => Tenant, (tenant) => tenant.contacts, { eager: false })
  tenant: Tenant;

  @Column({ nullable: true })
  tenantId: string;
}
