import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ReportType {
  STANDARD = 'STANDARD',
  CUSTOM = 'CUSTOM',
}

@Entity()
export class Report extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  type: ReportType;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: false })
  workspaceId: string;

  @Column({ nullable: false })
  reportId: string;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;
}
