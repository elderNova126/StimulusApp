import { IsEnum } from 'class-validator';
import { CompanyAttachmentTypes, ErrorCodes } from 'src/company/company.constants';
import { Company } from 'src/company/company.entity';
import { Tenant } from 'src/tenant/tenant.entity';
import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

@Entity()
export class CompanyAttachment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true })
  originalFilename: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: false, default: false })
  isPrivate: boolean;

  @Column({ type: 'timestamp', nullable: true, update: false })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true, update: false })
  @UpdateDateColumn()
  updated: Date;

  @Column({ nullable: true, type: 'nvarchar' })
  @IsEnum(CompanyAttachmentTypes, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be from this list ' + Object.values(CompanyAttachmentTypes),
    },
  })
  type: CompanyAttachmentTypes;

  @ManyToOne((_type) => Company, (company) => company.companyAttachments, { eager: true, nullable: false })
  company: Company;

  @ManyToOne((_type) => Tenant, (tenant) => tenant.companyAttachments, { eager: true, nullable: true })
  tenant: Tenant;
}
