import { IsEnum } from 'class-validator';
import { DiverseOwnershipValues, ErrorCodes } from 'src/company/company.constants';
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

@Entity({ name: 'diverseOwnership' })
export class DiverseOwnership extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @JoinColumn()
  id: string;

  // enum string values
  @Index({ where: "diverseOwnership IS NOT NULL AND diverseOwnership <> ''" })
  @Column({ nullable: true, type: 'nvarchar' })
  @IsEnum(DiverseOwnershipValues, {
    each: true,
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be from this list ' + Object.values(DiverseOwnershipValues),
    },
  })
  diverseOwnership?: DiverseOwnershipValues;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @ManyToMany((_type) => Company, (company) => company.diverseOwnership)
  company: Company;
}
