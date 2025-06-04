import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Event } from '../event/event.entity';
import { UserProfile } from '../user-profile/user-profile.entity';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ default: false })
  read: boolean;

  @ManyToOne((_type) => UserProfile, (userProfile) => userProfile.notifications, { eager: true })
  userProfile: UserProfile;

  @ManyToOne((_type) => Event, (event) => event.notifications, { eager: true })
  event: Event;
}
