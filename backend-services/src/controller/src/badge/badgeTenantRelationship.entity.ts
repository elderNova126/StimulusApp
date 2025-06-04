import { TenantCompanyRelationship } from 'src/tenant-company-relationship/tenant-company-relationship.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Badge } from './badge.entity';

@Entity('badge_tenant_company_relationship')
export class BadgeTenantRelationship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Badge, (badge) => badge.badgeTenantCompanyRelationships)
  badge: Badge;

  @Column({ nullable: true })
  badgeId: string;

  @Column({ type: 'timestamp', nullable: true })
  badgeDate: Date;

  @ManyToOne(() => TenantCompanyRelationship, (tenantCompanyRelationship) => tenantCompanyRelationship.badges)
  tenantCompanyRelationship: TenantCompanyRelationship;

  @Column({ nullable: true })
  tenantCompanyRelationshipId: string;
}
