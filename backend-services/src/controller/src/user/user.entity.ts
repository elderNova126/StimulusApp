import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  @Index({ unique: true, where: 'externalAuthSystemId IS NOT NULL' })
  externalAuthSystemId: string;

  @Column({ default: false })
  globalAdmin: boolean;

  // TODO could use simple-json type here
  // https://github.com/typeorm/typeorm/blob/master/docs/entities.md#simple-json-column-type
  @Column({ nullable: true })
  settings: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;
}
