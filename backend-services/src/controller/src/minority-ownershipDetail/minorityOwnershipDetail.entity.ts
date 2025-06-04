import { IsEnum } from 'class-validator';
import { MinorityOwnershipDetailValues, ErrorCodes } from 'src/company/company.constants';
import { Company } from 'src/company/company.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'minorityOwnershipDetail' })
export class MinorityOwnershipDetail extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @JoinColumn()
  id: string;

  @Index({ where: "minorityOwnershipDetail IS NOT NULL AND minorityOwnershipDetail <> ''" })
  @Column({ nullable: true, type: 'nvarchar' })
  @IsEnum(MinorityOwnershipDetailValues, {
    each: true,
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be from this list ' + Object.values(MinorityOwnershipDetailValues),
    },
  })
  minorityOwnershipDetail?: MinorityOwnershipDetailValues;

  @Column({ default: 'Default Display Name' })
  displayName: string;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @ManyToMany((_type) => Company, (company) => company.minorityOwnershipDetail)
  company: Company;
}
