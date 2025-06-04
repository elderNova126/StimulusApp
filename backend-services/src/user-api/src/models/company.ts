import { createUnionType, Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';
import { Certification, CertificationResultUnion } from './certification';
import { CompanyNotesResponseUnion } from './company-note';
import { Contact, ContactResponseUnion } from './contact';
import { ContingencyResponseUnion } from './contingency';
import { DataPoint } from './dataPoint';
import { Industry } from './industry';
import { InsuranceResponseUnion } from './insurance';
import { Location, LocationResponseUnion } from './location';
import { ProductResponseUnion } from './product';
import { ProjectsResponseUnion } from './project';
import { StimulusScoreResponseUnion } from './stimulusScore';
import { TenantCompanyRelation } from './tenantCompanyRelation';

export const DiverseOwnerships = [
  'Minority',
  'Women',
  'Veteran',
  'LGBTQ+',
  'LGBTQ',
  'Disabled',
  'Disadvantaged',
  'B-Corp',
  'Native American',
];

@ObjectType()
class GArticleSource {
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  url: string;
}
@ObjectType()
class GArticle {
  @Field({ nullable: true })
  title: string;
  @Field({ nullable: true })
  description: string;
  @Field({ nullable: true })
  url: string;
  @Field({ nullable: true })
  image: string;
  @Field({ nullable: true })
  publishedAt: string;
  @Field(() => GArticleSource, { nullable: true })
  source: GArticleSource;
}

@ObjectType()
export class CompanyProjectsOverview {
  @Field({ nullable: true })
  globalSpent: number;
  @Field({ nullable: true })
  totalProjects: number;
  @Field({ nullable: true })
  accountProjects: number;
  @Field({ nullable: true })
  accountSpent: number;
  @Field({ nullable: true })
  accountEvaluations: number;
  @Field({ nullable: true })
  totalEvaluations: number;
}
@ObjectType()
export class CompanyTags {
  @Field(() => [String], { nullable: true })
  tags?: string[];
}
@ObjectType()
export class CompanyDiverseOwnership {
  @Field(() => [String], { nullable: true })
  diverseOwnership?: string[];
}

@ObjectType()
export class CompanyMinorityOwnership {
  @Field(() => [String], { nullable: true })
  minorityOwnership?: string[];
}

@ObjectType()
export class MinorityOwnership {
  @Field()
  id: string;
  @Field()
  minorityOwnershipDetail: string;
  @Field()
  displayName: string;
}

@ObjectType()
export class MinorityOwnershipResponse {
  @Field(() => [MinorityOwnership], { nullable: true })
  minorityOwnership?: MinorityOwnership[];
}

@ObjectType()
export class CompanySubset {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  legalBusinessName: string;
  @Field({ nullable: true })
  doingBusinessAs: string;
}
@ObjectType()
export class CompanySubsetResponse {
  @Field(() => [CompanySubset], { nullable: true })
  results: CompanySubset[];
}

@ObjectType()
export class CompanyByTaxId {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  legalBusinessName: string;
  @Field({ nullable: true })
  doingBusinessAs: string;
  @Field({ nullable: true })
  taxIdNo: string;
}
@ObjectType()
export class CompanyByTaxIdResponse {
  @Field(() => [CompanyByTaxId], { nullable: true })
  results: CompanyByTaxId[];
}

@ObjectType()
export class Company {
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  created: string;
  @Field({ nullable: true })
  updated: string;
  @Field({ nullable: true })
  description: string;
  @Field(() => Company, { nullable: true })
  parentCompany: Company;
  @Field({ nullable: true })
  legalBusinessName: string;
  @Field({ nullable: true })
  doingBusinessAs: string;
  @Field({ nullable: true })
  jurisdictionOfIncorporation: string;
  @Field({ nullable: true })
  typeOfLegalEntity: string;
  @Field({ nullable: true })
  creditScoreBusinessNo: string;
  @Field({ nullable: true })
  taxIdNo: string;
  @Field({ nullable: true })
  yearFounded: number;
  @Field({ nullable: true })
  financialsDataYear: number;
  @Field({ nullable: true })
  revenue: number;
  @Field({ nullable: true })
  revenueGrowthCAGR: number;
  @Field({ nullable: true })
  netProfit: number;
  @Field({ nullable: true })
  netProfitGrowthCAGR: number;
  @Field({ nullable: true })
  netProfitPct: number;
  @Field({ nullable: true })
  totalAssets: number;
  @Field({ nullable: true })
  totalLiabilities: number;
  @Field({ nullable: true })
  customerDataYear: number;
  @Field({ nullable: true })
  customers: number;
  @Field({ nullable: true })
  customersGrowthCAGR: number;
  @Field({ nullable: true })
  peopleDataYear: number;
  @Field({ nullable: true })
  employeesTotal: number;
  @Field({ nullable: true })
  employeesDiverse: number;
  @Field({ nullable: true })
  employeesTotalGrowthCAGR: number;
  @Field({ nullable: true })
  revenuePerEmployee: number;
  @Field({ nullable: true })
  leadershipTeamTotal: number;
  @Field({ nullable: true })
  leadershipTeamDiverse: number;
  @Field({ nullable: true })
  boardTotal: number;
  @Field({ nullable: true })
  boardDiverse: number;
  @Field({ nullable: true })
  brandDataYear: number;
  @Field({ nullable: true })
  netPromoterScore?: number;
  @Field(() => ContactResponseUnion, { nullable: true })
  contacts?: typeof ContactResponseUnion;
  @Field(() => [Contact], { nullable: true })
  contactsByIndex?: Contact[];
  @Field(() => LocationResponseUnion, { nullable: true })
  locations?: typeof LocationResponseUnion;
  @Field(() => [Location], { nullable: true })
  locationsByIndex?: Location[];
  @Field(() => ProductResponseUnion, { nullable: true })
  products?: typeof ProductResponseUnion;
  @Field(() => CertificationResultUnion, { nullable: true })
  certifications?: typeof CertificationResultUnion;
  @Field(() => [Certification], { nullable: true })
  certificationsByIndex?: Certification[];
  @Field(() => InsuranceResponseUnion, { nullable: true })
  insuranceCoverage?: typeof InsuranceResponseUnion;
  @Field(() => CompanyNotesResponseUnion, { nullable: true })
  notes?: typeof CompanyNotesResponseUnion;
  @Field(() => ContingencyResponseUnion, { nullable: true })
  contingencies?: typeof ContingencyResponseUnion;
  @Field(() => StimulusScoreResponseUnion, { nullable: true })
  stimulusScore?: typeof StimulusScoreResponseUnion;
  @Field(() => [DataPoint], { nullable: true })
  dataPoints?: DataPoint[];
  @Field({ nullable: true })
  evaluations?: number;
  @Field(() => [Industry], { nullable: true })
  industries?: Industry[];
  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];
  @Field(() => TenantCompanyRelation, { nullable: true })
  tenantCompanyRelation: TenantCompanyRelation;
  @Field(() => ProjectsResponseUnion, { nullable: true })
  projects: typeof ProjectsResponseUnion;
  @Field({ nullable: true })
  page: number;
  @Field({ nullable: true })
  limit: number;

  // Return a list of all diverse certification for this company
  @Field(() => [String], { nullable: true })
  diverseOwnership?: string[];
  @Field(() => [String], { nullable: true })
  minorityOwnership?: string[];
  @Field({ nullable: true })
  smallBusiness: boolean;
  @Field({ nullable: true })
  ownershipDescription?: string;
  @Field({ nullable: true })
  diverseOwnershipPct?: number;
  @Field({ nullable: true })
  website?: string;
  @Field({ nullable: true })
  webDomain?: string;
  @Field({ nullable: true })
  emailDomain?: string;
  @Field({ nullable: true })
  linkedin?: string;
  @Field({ nullable: true })
  linkedInFollowers?: number;
  @Field({ nullable: true })
  linkedInFollowersGrowthCAGR?: number;
  @Field({ nullable: true })
  facebook?: string;
  @Field({ nullable: true })
  facebookFollowers?: number;
  @Field({ nullable: true })
  facebookFollowersGrowthCAGR?: number;
  @Field({ nullable: true })
  twitter?: string;
  @Field({ nullable: true })
  twitterFollowers?: number;
  @Field({ nullable: true })
  twitterFollowersGrowthCAGR?: number;
  @Field({ nullable: true })
  currency?: string;
  @Field({ nullable: true })
  assetsRevenueRatio?: number;
  @Field({ nullable: true })
  liabilitiesRevenueRatio?: number;
  @Field({ nullable: true })
  customersDataYear?: number;
  @Field(() => [GArticle], { nullable: true })
  news?: GArticle[];

  @Field({ nullable: true })
  projectsOverview: CompanyProjectsOverview;
  @Field({ nullable: true })
  logo?: string;
  @Field({ nullable: true })
  otherBusinessNames?: string;
  @Field({ nullable: true })
  previousBusinessNames?: string;
  @Field(() => [CompanyNames], { nullable: true })
  names?: CompanyNames[];
  @Field({ nullable: true })
  shortDescription?: string;
  @Field({ nullable: true })
  operatingStatus?: string;
  @Field({ nullable: true })
  fiscalYearEnd?: number;
  @Field({ nullable: true })
  leaderDiverse?: string;
  @Field({ nullable: true })
  parentCompanyTaxId: string;
}
@ObjectType()
export class CompanyNames {
  @Field({ nullable: true })
  id: number;
  @Field({ nullable: true })
  type: string;
  @Field({ nullable: true })
  name: string;
}

@ObjectType()
export class InternalCompaniesData {
  @Field({ nullable: true })
  name: string;
  @Field({ nullable: true })
  Companies: number;
}

@ObjectType()
export class InternalCompaniesDashboardResponse {
  @Field(() => [InternalCompaniesData], { nullable: true })
  results: InternalCompaniesData[];
  @Field({ nullable: true })
  count: number;
  @Field({ nullable: true })
  checkPrevYear: number;
  @Field({ nullable: true })
  hasData: boolean;
  @Field({ nullable: true })
  prevYear: number;
  @Field({ nullable: true })
  currentYear: number;
}

@ObjectType()
export class Tag {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  tag: string;
  @Field({ nullable: true })
  created: Date;
}

@ObjectType()
export class CompaniesResponse {
  @Field(() => [Company], { nullable: true })
  results: Company[];
  @Field({ nullable: true })
  count: number;
}

@ObjectType()
export class CountCompaniesResponse {
  @Field({ nullable: true })
  count: number;
}

export const CountCompaniesResponseUnion = createUnionType({
  name: 'CountCompaniesResponseUnion',
  types: () => [CountCompaniesResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return CountCompaniesResponse;
  },
});

export const CompaniesResponseUnion = createUnionType({
  name: 'CompaniesResponseUnion',
  types: () => [CompaniesResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return CompaniesResponse;
  },
});

export const CompanyUnion = createUnionType({
  name: 'CompanyResponse',
  types: () => [Company, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Company;
  },
});
