import { BaseEntity, Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Notification } from '../notification/notification.entity';

@Entity()
export class UserProfile extends BaseEntity {
  @PrimaryColumn()
  id: string; // user-externalSystemAuthId

  @Column('simple-array')
  subscribedProjects: string[];

  @Column('simple-array')
  subscribedCompanies: string[];

  @Column('simple-array')
  subscribedProjectCompanies: string[];

  @OneToMany((_type) => Notification, (notification) => notification.userProfile, { eager: false, nullable: true })
  notifications?: Notification[];
}
