import { EventCategoryType } from './event-code.enum';
import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Notification } from '../notification/notification.entity';

interface EventMeta {
  id?: string;
  userId?: string;
  companyId?: string;
  projectId?: number;
  listId?: number;
  listName?: string;
  userInvited?: string;
  departmentId?: string;
  companyName?: string;
  projectName?: string;
  departmentName?: string;
  userName?: string;
  actionType?: string;
  status?: string;
  type?: string;
  setting?: string;
  settingValue?: boolean;
  answers?: string;
  updates?: {
    id: string;
    from: string;
    to: string;
  }[];
}

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ nullable: true })
  entityType: EventCategoryType;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  entityId: string;

  @Column({ nullable: true, type: 'text' })
  body: string;

  @Column()
  code: string;

  @Column()
  level: string;

  @Column('simple-json', { nullable: true })
  meta: EventMeta;

  @OneToMany((_type) => Notification, (notification) => notification.event, { eager: false })
  notifications: Notification[];
}
