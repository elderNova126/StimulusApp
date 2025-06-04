import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../company/company.entity';

@Entity()
export class Score extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('datetime', { nullable: true })
  @CreateDateColumn()
  timestamp: Date;

  @Column({ nullable: true, type: 'decimal', precision: 9, scale: 3 })
  brandValue: number;

  @Column({ nullable: true, type: 'decimal', precision: 9, scale: 3 })
  employeeValue: number;

  @Column({ nullable: true, type: 'decimal', precision: 9, scale: 3 })
  customerValue: number;

  @Column({ nullable: true, type: 'decimal', precision: 9, scale: 3 })
  longevityValue: number;

  @Column({ type: 'decimal', precision: 9, scale: 3, default: 1000 })
  scoreValue: number;

  @Column({ default: 1000 })
  quality: number;
  @Column({ default: 1000 })
  reliability: number;
  @Column({ default: 1000 })
  features: number;
  @Column({ default: 1000 })
  cost: number;
  @Column({ default: 1000 })
  relationship: number;
  @Column({ default: 1000 })
  financial: number;
  @Column({ default: 1000 })
  diversity: number;
  @Column({ default: 1000 })
  innovation: number;
  @Column({ default: 1000 })
  flexibility: number;
  @Column({ default: 1000 })
  brand: number;

  @Column('rowversion')
  rowversion: Buffer;

  @ManyToOne((_type) => Company, (company) => company.score, { eager: true })
  company: Company;
}
