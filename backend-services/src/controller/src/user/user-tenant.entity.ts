import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  UpdateDateColumn,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity()
@Unique(['user', 'tenant'])
export class UserTenant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne((_type) => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne((_type) => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @Column({ nullable: true })
  isDefault: boolean;

  @Column({ nullable: true })
  approved: boolean;

  @Column({ nullable: true })
  invitationExpires: Date;

  @ManyToMany((_type) => Role, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  roles: Role[];

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;
}

export enum UserManagementList {
  PENDING = 'pending',
  APPROVED = 'accepted',
}
