import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { TenantCompany } from './tenant-company.entity';
import { Account } from './account.entity';
import { TenantCompanyRelationship } from '../tenant-company-relationship/tenant-company-relationship.entity';
import { Badge } from 'src/badge/badge.entity';
import { Industry } from 'src/industry/industry.entity';
import { Contact } from 'src/contact/contact.entity';
import { CompanyAttachment } from 'src/company-attachment/company-attachment.entity';

export enum ProvisionStatus {
  PROVISIONED = 'provisioned',
  IN_PROGRESS = 'in_progress',
  QUEUED = 'queued',
}

export const joinTenantIndustryTable = {
  name: 'tenant_industry',
  joinColumn: {
    name: 'tenantId',
    referencedColumnName: 'id',
  },
  inverseJoinColumn: {
    name: 'industryId',
    referencedColumnName: 'id',
  },
};
@Entity()
export class Tenant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  provisionStatus: ProvisionStatus;

  @OneToOne((_type) => TenantCompany, (tenantCompany) => tenantCompany.tenant) // specify inverse side as a second parameter
  tenantCompany: TenantCompany;

  @OneToOne((_type) => Account, (account) => account.tenant)
  account: Account;

  @OneToMany((_type) => TenantCompanyRelationship, (tenantCompanyRelationship) => tenantCompanyRelationship.tenant)
  tenantCompanyRelationships: TenantCompanyRelationship[];

  @OneToMany((_type) => Badge, (badge) => badge.tenant)
  badges: Badge[];

  @OneToMany((_type) => Contact, (contact) => contact.tenant)
  contacts: Contact[];

  @ManyToMany((_type) => Industry, (industry) => industry.tenant, { eager: false })
  @JoinTable(joinTenantIndustryTable)
  industries: Industry[];

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;

  @OneToMany((_type) => CompanyAttachment, (companyAttachments) => companyAttachments.tenant, { eager: false })
  companyAttachments: CompanyAttachment[];
}
