import { Tenant } from 'src/tenant/tenant.entity';
import { User } from 'src/user/user.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum SharedListStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  DELETED = 'deleted',
}

@Entity({ name: 'shared_lists' })
export class SharedList extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne((_type) => User, (user) => user.id, { eager: true })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column()
  listId: number;

  @ManyToOne((_type) => Tenant, (tenant) => tenant.id, { eager: true })
  @JoinColumn()
  tenant: Tenant;

  @Column()
  status: SharedListStatus;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ type: 'timestamp', nullable: true })
  created: Date;
}
