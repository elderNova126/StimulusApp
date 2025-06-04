import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class CompanyList extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array', { nullable: true })
  companies: string[];

  @Column({ nullable: true })
  createdBy: string;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;

  @Column({ nullable: true })
  name: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column('rowversion')
  rowversion: Buffer;
}
