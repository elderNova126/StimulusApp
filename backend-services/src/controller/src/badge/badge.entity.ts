import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { BadgeTenantRelationship } from './badgeTenantRelationship.entity';

export enum BadgeStatus {
  HIDDEN = 'hidden',
  OPTIONAL = 'optional',
  MANDATORY = 'mandatory',
}

@Entity()
export class Badge extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn({ update: false })
  created?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated?: Date;

  @Column({ length: 250, unique: true })
  badgeName: string;

  @Column({ nullable: true, length: 'MAX' })
  badgeDescription: string;

  @Column({ enum: BadgeStatus, default: BadgeStatus.MANDATORY })
  badgeDateStatus: BadgeStatus;

  @Column({ nullable: true })
  badgeDateLabel: string;

  @ManyToOne((_type) => Tenant, (tenant) => tenant.badges)
  tenant: Tenant;

  @Column({ nullable: true })
  tenantId: string;

  @OneToMany(() => BadgeTenantRelationship, (badgeTenantRelationship) => badgeTenantRelationship.badge)
  badgeTenantCompanyRelationships: BadgeTenantRelationship[];
}
