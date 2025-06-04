import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: UserRole.ADMIN })
  name: UserRole;

  @Column({ default: false })
  internal: boolean;

  @Column({ nullable: true })
  description: string;
}
