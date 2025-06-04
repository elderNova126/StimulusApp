import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity()
export class TenantCompany extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  departmentName: string;

  @Column({ nullable: true })
  ein: string;

  @Column()
  duns: string;

  @OneToOne((_type) => Tenant)
  @JoinColumn()
  tenant: Tenant;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;
}
