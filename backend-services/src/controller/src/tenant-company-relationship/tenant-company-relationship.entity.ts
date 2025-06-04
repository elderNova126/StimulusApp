import { IsOptional } from 'class-validator';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { BadgeTenantRelationship } from 'src/badge/badgeTenantRelationship.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../company/company.entity';
import { Tenant } from '../tenant/tenant.entity';

export enum SupplierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export const SupplierStatusMapping: Record<controller.SupplierStatus, SupplierStatus> = {
  [controller.SupplierStatus.ACTIVE]: SupplierStatus.ACTIVE,
  [controller.SupplierStatus.INACTIVE]: SupplierStatus.INACTIVE,
  [controller.SupplierStatus.ARCHIVED]: SupplierStatus.ARCHIVED,
};

export enum SupplierType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export const SupplierTypeMapping: Record<controller.SupplierType, SupplierType> = {
  [controller.SupplierType.INTERNAL]: SupplierType.INTERNAL,
  [controller.SupplierType.EXTERNAL]: SupplierType.EXTERNAL,
};

@Entity()
export class TenantCompanyRelationship extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((_type) => Tenant, (tenant) => tenant.tenantCompanyRelationships, { nullable: false, eager: true })
  tenant: Tenant;

  @ManyToOne((_type) => Company, (company) => company.tenantCompanyRelationships, { nullable: false, eager: false })
  company: Company;

  @OneToMany(
    () => BadgeTenantRelationship,
    (badgeTenantRelationship) => badgeTenantRelationship.tenantCompanyRelationship
  )
  badges: BadgeTenantRelationship[];

  @Column({ nullable: true, unique: true, length: 'MAX' })
  @IsOptional()
  @Index({ unique: true, where: 'internalId IS NOT NULL' })
  internalId: string;

  @Column({ nullable: true })
  @Index({ unique: true, where: 'companyId IS NOT NULL' })
  companyId: string;

  @Column({ nullable: true })
  parentCompanyInternalId: string;

  @Column({ type: Boolean, default: false })
  isFavorite: boolean;

  @Column({ type: Boolean, default: false })
  isToCompare: boolean;

  // If the status is not set, enforce the status to active
  // TODO: check/update the payment plan
  @Column({ nullable: true, default: SupplierStatus.ACTIVE })
  status?: string;

  @Column({ nullable: true, default: SupplierType.EXTERNAL })
  type?: string;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn({ update: false })
  created?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn({ update: false })
  updated?: Date;

  @Column({ nullable: true, default: 0, type: 'bigint' })
  totalSpent?: number;

  @Column({ nullable: true, default: 0 })
  noOfProjects?: number;

  @Column({ nullable: true, default: 0 })
  noOfEvaluations?: number;

  @Column({ type: 'rowversion', update: false })
  rowversion: Buffer;

  @Column({ nullable: true })
  favoriteUpdatedAt: Date;

  @Column({ nullable: true })
  internalName: string;

  @Column({ nullable: true })
  supplierTier: number;

  static archiveThresholdMonths = 6;
}
