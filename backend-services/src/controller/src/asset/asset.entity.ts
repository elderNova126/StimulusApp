import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Asset extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @JoinColumn()
  id: string;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true })
  originalFilename: string;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'timestamp', nullable: true, update: false })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true, update: false })
  @CreateDateColumn()
  updated: Date;
}
