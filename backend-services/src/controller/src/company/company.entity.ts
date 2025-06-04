import { Transform } from 'class-transformer';
import { IsEnum, IsFQDN, IsNumber, IsOptional, IsUrl, Length, Matches, Max, Min, ValidateIf } from 'class-validator';
import { DiverseOwnership } from 'src/diverse-ownership/DiverseOwnership.entity';
import { Tag } from 'src/tag/tag.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Certification } from '../certification/certification.entity';
import { Contact } from '../contact/contact.entity';
import { Contingency } from '../contingency/contingency.entity';
import { DataPoint } from '../data-point/data-point.entity';
import { Industry } from '../industry/industry.entity';
import { Insurance } from '../insurance/insurance.entity';
import { Location } from '../location/location.entity';
import { MinorityOwnershipDetail } from '../minority-ownershipDetail/minorityOwnershipDetail.entity';
import { Product } from '../product/product.entity';
import { Score } from '../stimulus-score/stimulus-score.entity';
import { TenantCompanyRelationship } from '../tenant-company-relationship/tenant-company-relationship.entity';
import { ErrorCodes, LeaderDiverse, LegalEntityType, OperatingStatus } from './company.constants';
import { CompanyNames } from 'src/company-names/company-names.entity';
import { CompanyAttachment } from 'src/company-attachment/company-attachment.entity';
@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @JoinColumn()
  id: string;

  @Column({ type: 'uuid' })
  @Index({ unique: true, where: 'stimulusId IS NOT NULL' })
  stimulusId: string;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;

  @Column({ nullable: true, length: 'MAX' })
  description: string;

  @Column({ nullable: true })
  shortDescription: string;

  @Column({ nullable: true })
  logo: string;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn()
  parentCompany: Company;

  @OneToMany((_type) => TenantCompanyRelationship, (tenantCompanyRelationship) => tenantCompanyRelationship.company, {
    cascade: true,
  })
  tenantCompanyRelationships: TenantCompanyRelationship[];

  @OneToMany((_type) => CompanyAttachment, (companyAttachments) => companyAttachments.company, { eager: false })
  companyAttachments: CompanyAttachment[];

  // Properties for reporting the information to the UI service
  // These values will have the tenant information of the company
  tenantCompanyRelation?: TenantCompanyRelationship;

  @Column({ nullable: true })
  @Index({ unique: true, where: 'legalBusinessName IS NOT NULL' })
  legalBusinessName: string;

  @Column({ nullable: true })
  doingBusinessAs: string;

  // @Column({ nullable: true })
  // previousBusinessNames: string;
  //
  // @Column({ nullable: true })
  // otherBusinessNames: string;

  @OneToMany((_type) => CompanyNames, (companyNames) => companyNames.company, {
    cascade: true,
  })
  names: CompanyNames[];

  @Column({ nullable: true })
  jurisdictionOfIncorporation: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsEnum(LegalEntityType, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be from this list ' + Object.values(LegalEntityType),
    },
  })
  typeOfLegalEntity: LegalEntityType;

  @Column({ nullable: true })
  creditScoreBusinessNo: string;

  @Column({ nullable: true })
  @Index({ unique: false, where: 'parentCompanyTaxId IS NOT NULL' })
  @IsOptional()
  parentCompanyTaxId: string;

  @Column({ nullable: true })
  @Index({ unique: true, where: 'taxIdNo IS NOT NULL' })
  @IsOptional()
  @Matches(RegExp('^[A-Za-z]{2}:'), {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must start with 2-letter country code, followed by colon',
    },
  })
  taxIdNo: string;

  @Column({ nullable: true })
  @IsOptional()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a valid year, above 0',
    },
  })
  @Max(9999, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a valid year, above 1900',
    },
  })
  yearFounded: number;

  @Column({ nullable: true })
  @IsOptional()
  @Min(1900, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a valid year, above 1900',
    },
  })
  @Max(9999, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a valid year, above 1900',
    },
  })
  financialsDataYear: number;

  @Column({ nullable: true, type: 'float' })
  revenue: number;

  @Column({ nullable: true, type: 'float' })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  @Max(1, {
    context: {
      errorCode: ErrorCodes.MAX_LIMIT_EXCEEDED,
      message: 'must be below 1',
    },
  })
  revenueGrowthCAGR: number;

  @Column({ nullable: true, type: 'float' })
  netProfit: number;

  @Column({ nullable: true, type: 'decimal', precision: 18, scale: 6 })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  @Max(1, {
    context: {
      errorCode: ErrorCodes.MAX_LIMIT_EXCEEDED,
      message: 'must be below 1',
    },
  })
  netProfitGrowthCAGR: number;

  @Column({ nullable: true, type: 'float' })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  @Max(1, {
    context: {
      errorCode: ErrorCodes.MAX_LIMIT_EXCEEDED,
      message: 'must be below 1',
    },
  })
  netProfitPct: number;

  @Column({ nullable: true, type: 'decimal', precision: 18, scale: 6 })
  totalAssets: number;

  @Column({ nullable: true })
  @IsOptional()
  @Min(1900, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a valid year, above 1900',
    },
  })
  @Max(9999, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a valid year, above 1900',
    },
  })
  customerDataYear: number;

  @Column({ nullable: true, type: 'float' })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  customers: number;

  @Column({ nullable: true, type: 'decimal', precision: 18, scale: 6 })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  @Max(1, {
    context: {
      errorCode: ErrorCodes.MAX_LIMIT_EXCEEDED,
      message: 'must be below 1',
    },
  })
  customersGrowthCAGR: number;

  @Column({ nullable: true })
  @IsOptional()
  @Min(1900, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a valid year, above 1900',
    },
  })
  @Max(9999, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a valid year, above 1900',
    },
  })
  customersDataYear?: number;

  @Column({ nullable: true })
  @IsOptional()
  @Min(1900, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a valid year, above 1900',
    },
  })
  @Max(9999, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a valid year',
    },
  })
  peopleDataYear: number;

  @Column({ nullable: true, type: 'float' })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  employeesTotal: number;

  @Column({ nullable: true, type: 'float' })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: 1003,
      message: 'must be a ',
    },
  })
  employeesDiverse: number;

  @Column({ nullable: true, type: 'float' })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  leadershipTeamTotal: number;

  @Column({ nullable: true, type: 'decimal', precision: 9, scale: 3 })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  leadershipTeamDiverse: number;

  @Column({ nullable: true, type: 'float' })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  boardTotal: number;

  @Column({ nullable: true })
  @IsOptional()
  @Min(1900, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a valid year, above 1900',
    },
  })
  @Max(9999, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a valid year, above 1900',
    },
  })
  brandDataYear: number;

  @Column({ nullable: true, type: 'decimal', precision: 9, scale: 3 })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  boardDiverse: number;

  @Column({ nullable: true, type: 'decimal', precision: 9, scale: 3 })
  shareholdersEquity: number;

  @Column('rowversion')
  rowversion: Buffer;

  // Both use in the communication with the normalizer for ingesting data
  internalId: string;
  parentCompanyInternalId: string;

  @OneToMany((_type) => Contact, (contact) => contact.company, { eager: false })
  contacts: Contact[];

  @OneToMany((_type) => Location, (location) => location.company, { eager: false })
  locations: Location;

  // Properties for reporting the information to the UI service
  // These values will have the tenant information of the company
  locationsByIndex?: Location;

  @OneToMany((_type) => Product, (product) => product.company, { eager: false })
  products: Product[];

  @OneToMany((_type) => Certification, (certification) => certification.company, { eager: false })
  certifications: Certification[];

  @OneToMany((_type) => Insurance, (insurance) => insurance.company, { eager: false })
  insuranceCoverage: Insurance[];

  @OneToMany((_type) => Contingency, (contingency) => contingency.company, { eager: false })
  contingencies: Contingency[];

  @OneToMany((_type) => DataPoint, (dataPoint) => dataPoint.company, { eager: false })
  dataPoints: DataPoint[];

  @ManyToMany((_type) => Industry, (industry) => industry.company, { eager: false })
  @JoinTable()
  industries: Industry[];

  @ManyToMany((_type) => Tag, (tag) => tag.company, { eager: false })
  @JoinTable()
  tags: Tag[];

  @OneToMany((_type) => Score, (score) => score.company, { eager: false })
  score: Score[];

  // Used to report the latestScore to the UI service.
  latestScore?: Score;

  @Column({ nullable: true, type: 'float' })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  @Max(1, {
    context: {
      errorCode: ErrorCodes.MAX_LIMIT_EXCEEDED,
      message: 'must be below 1',
    },
  })
  netPromoterScore?: number;

  @Column({ type: 'decimal', precision: 9, scale: 3, nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  @Max(1, {
    context: {
      errorCode: ErrorCodes.MAX_LIMIT_EXCEEDED,
      message: 'must be below 1',
    },
  })
  employeesTotalGrowthCAGR?: number;

  @Column({ nullable: true, type: 'float' })
  revenuePerEmployee?: number;

  @Column({ nullable: true, type: 'float' })
  totalLiabilities?: number;

  @ManyToMany((_type) => DiverseOwnership, (diverseOwnership) => diverseOwnership.company, {
    eager: false,
    cascade: true,
  })
  @JoinTable({
    name: 'diverseOwnership_company',
    joinColumn: { name: 'companyId' },
    inverseJoinColumn: { name: 'diverseOwnershipId' },
  })
  diverseOwnership: DiverseOwnership[];

  @ManyToMany((_type) => MinorityOwnershipDetail, (minorityOwnershipDetail) => minorityOwnershipDetail.company, {
    eager: false,
    cascade: true,
  })
  @JoinTable({
    name: 'minorityOwnershipDetail_company',
    joinColumn: { name: 'companyId' },
    inverseJoinColumn: { name: 'minorityOwnershipDetailId' },
  })
  minorityOwnershipDetail?: MinorityOwnershipDetail[];

  @Column({ nullable: true, length: 'MAX' })
  @IsOptional()
  ownershipDescription?: string;

  @Column({ nullable: true, type: 'bit' })
  @IsOptional()
  smallBusiness?: boolean;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  @Max(1, {
    context: {
      errorCode: ErrorCodes.MAX_LIMIT_EXCEEDED,
      message: 'must be below 1',
    },
  })
  diverseOwnershipPct?: number;

  @Column({ nullable: true })
  @IsOptional()
  @ValidateIf((val) => val.website !== '')
  @IsUrl({
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be valid url',
    },
  })
  website?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsFQDN(
    {
      require_tld: true,
    },
    {
      context: {
        errorCode: ErrorCodes.INVALID_VALUE,
        message: 'must be valid fqdn',
      },
    }
  )
  webDomain?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsFQDN(
    {
      require_tld: true,
    },
    {
      context: {
        errorCode: ErrorCodes.INVALID_VALUE,
        message: 'must be valid fqdn',
      },
    }
  )
  emailDomain?: string;

  @Column({ nullable: true })
  @IsOptional()
  @ValidateIf((val) => val.linkedin !== '')
  @IsUrl(
    {
      require_tld: true,
      require_protocol: false,
    },
    {
      context: {
        errorCode: ErrorCodes.INVALID_VALUE,
        message: 'must be valid url',
      },
    }
  )
  linkedin?: string;

  @Column({ nullable: true, type: 'float' })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  linkedInFollowers?: number;

  @Column({ nullable: true, type: 'decimal', precision: 18, scale: 6 })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  @Max(1, {
    context: {
      errorCode: ErrorCodes.MAX_LIMIT_EXCEEDED,
      message: 'must be below 1',
    },
  })
  linkedInFollowersGrowthCAGR: number;

  @Column({ nullable: true })
  @IsOptional()
  @ValidateIf((val) => val.facebook !== '')
  @IsUrl(
    {
      require_tld: true,
      require_protocol: false,
    },
    {
      context: {
        errorCode: ErrorCodes.INVALID_VALUE,
        message: 'must be valid url',
      },
    }
  )
  facebook?: string;

  @Column({ nullable: true, type: 'float' })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  facebookFollowers?: number;

  @Column({ nullable: true, type: 'decimal', precision: 18, scale: 6 })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  @Max(1, {
    context: {
      errorCode: ErrorCodes.MAX_LIMIT_EXCEEDED,
      message: 'must be below 1',
    },
  })
  facebookFollowersGrowthCAGR: number;

  @Column({ nullable: true })
  @IsOptional()
  @ValidateIf((val) => val.twitter !== '')
  @IsUrl(
    {
      require_tld: true,
      require_protocol: false,
    },
    {
      context: {
        errorCode: ErrorCodes.INVALID_VALUE,
        message: 'must be valid url',
      },
    }
  )
  twitter?: string;

  @Column({ nullable: true, type: 'float' })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  twitterFollowers?: number;

  @Column({ nullable: true, type: 'decimal', precision: 18, scale: 6 })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  @Max(1, {
    context: {
      errorCode: ErrorCodes.MAX_LIMIT_EXCEEDED,
      message: 'must be below 1',
    },
  })
  twitterFollowersGrowthCAGR: number;

  @Column({ nullable: true, length: '3' })
  @IsOptional()
  @Length(3, 3)
  @Matches(RegExp('^[a-zA-Z]{3}$'), {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be a valid currency format',
    },
  })
  currency?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  @Max(1, {
    context: {
      errorCode: ErrorCodes.MAX_LIMIT_EXCEEDED,
      message: 'must be below 1',
    },
  })
  assetsRevenueRatio?: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  @Max(1, {
    context: {
      errorCode: ErrorCodes.MAX_LIMIT_EXCEEDED,
      message: 'must be below 1',
    },
  })
  liabilitiesRevenueRatio?: number;

  @Column({ default: OperatingStatus.OPEN })
  @IsOptional()
  @IsEnum(OperatingStatus, {
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be from this list ' + Object.values(OperatingStatus),
    },
  })
  operatingStatus: OperatingStatus;

  @Column({ nullable: true, type: 'float', default: 12 })
  @IsOptional()
  @IsNumber()
  @Min(1, {
    context: {
      errorCode: ErrorCodes.NEGATIVE_VALUE,
      message: 'must be a positive value',
    },
  })
  @Max(12, {
    context: {
      errorCode: ErrorCodes.MAX_LIMIT_EXCEEDED,
      message: 'must be below 1',
    },
  })
  fiscalYearEnd?: number;

  @Column({ nullable: true, type: 'nvarchar' })
  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsEnum(LeaderDiverse, {
    each: true,
    context: {
      errorCode: ErrorCodes.INVALID_VALUE,
      message: 'must be from this list ' + Object.values(LeaderDiverse),
    },
  })
  leaderDiverse?: LeaderDiverse[];

  options: any;
}
