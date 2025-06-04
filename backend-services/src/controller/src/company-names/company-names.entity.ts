import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { Company } from 'src/company/company.entity';
import { IsEnum } from 'class-validator';

export enum CompanyNameType {
  PREVIOUS = 'PREVIOUS',
  OTHER = 'OTHER',
}

@Entity({ name: 'company_names' })
export class CompanyNames extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  @Index({ unique: true, where: 'companyId IS NOT NULL' })
  companyId: string;

  @ManyToOne((_type) => Company, (company) => company.names, { nullable: false, eager: false })
  company: Company;

  @Column({ type: 'varchar', nullable: false })
  @IsEnum(CompanyNameType)
  type: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn({ update: false })
  created?: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn({ update: true })
  updated?: Date;
}
