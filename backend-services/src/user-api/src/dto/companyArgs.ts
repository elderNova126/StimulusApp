import { ArgsType, Field } from '@nestjs/graphql';
import { SettingsArgs } from './tenantCompanyRelationshipArgs';

/* eslint max-classes-per-file: 0 */

@ArgsType()
export class CompanyArgs extends SettingsArgs {
  @Field({ nullable: true })
  id?: string;
  @Field({ nullable: true })
  created?: string;
  @Field({ nullable: true })
  updated?: string;
  @Field({ nullable: true })
  description?: string;
  @Field(() => [String], { nullable: true })
  tags?: string[];
  @Field({ nullable: true })
  parentCompanyId?: string;
  @Field({ nullable: true })
  legalBusinessName?: string;
  @Field(() => [String], { nullable: true })
  previousBusinessNames?: string[];
  @Field({ nullable: true })
  operatingStatus?: string;
  @Field(() => [String], { nullable: true })
  otherBusinessNames?: string[];
  @Field({ nullable: true })
  doingBusinessAs?: string;
  @Field({ nullable: true })
  jurisdictionOfIncorporation?: string;
  @Field({ nullable: true })
  typeOfLegalEntity?: string;
  @Field({ nullable: true })
  creditScoreBusinessNo?: string;
  @Field({ nullable: true })
  taxIdNo?: string;
  @Field({ nullable: true })
  yearFounded?: number;
  @Field({ nullable: true })
  financialsDataYear?: number;
  @Field({ nullable: true })
  revenue?: number;
  @Field({ nullable: true })
  revenueGrowthCAGR?: number;
  @Field({ nullable: true })
  netProfit?: number;
  @Field({ nullable: true })
  evaluations?: number;
  @Field({ nullable: true })
  netProfitGrowthCAGR?: number;
  @Field({ nullable: true })
  netProfitPct?: number;
  @Field({ nullable: true })
  totalAssets?: number;
  @Field({ nullable: true })
  customerDataYear?: number;
  @Field({ nullable: true })
  customers?: number;
  @Field({ nullable: true })
  customersGrowthCAGR?: number;
  @Field({ nullable: true })
  peopleDataYear?: number;
  @Field({ nullable: true })
  employeesTotal?: number;
  @Field({ nullable: true })
  employeesDiverse?: number;
  @Field({ nullable: true })
  leadershipTeamTotal?: number;
  @Field({ nullable: true })
  leadershipTeamDiverse?: number;
  @Field({ nullable: true })
  boardTotal?: number;
  @Field({ nullable: true })
  brandDataYear?: number;

  @Field({ nullable: true })
  netPromoterScore?: number;
  @Field({ nullable: true })
  employeesTotalGrowthCAGR?: number;
  @Field({ nullable: true })
  revenuePerEmployee?: number;
  @Field({ nullable: true })
  totalLiabilities?: number;
  @Field({ nullable: true })
  boardDiverse?: number;
  @Field({ nullable: true })
  shareholdersEquity?: number;

  @Field(() => [String], { nullable: true })
  diverseOwnership?: string[];

  @Field(() => [String], { nullable: true })
  minorityOwnership?: string[];

  @Field({ nullable: true })
  smallBusiness?: boolean;

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

  @Field({ nullable: true })
  fiscalYearEnd?: number;

  @Field({ nullable: true })
  leaderDiverse?: string;

  @Field({ nullable: true })
  internalId?: string;

  @Field({ nullable: true })
  internalName?: string;

  @Field({ nullable: true })
  parentCompanyTaxId: string;
}

@ArgsType()
export class CompanyUpdateArgs extends CompanyArgs {
  @Field(() => [String], { nullable: true })
  industryIds?: string[];
  @Field(() => [String], { nullable: true })
  newCustomIndustries?: string[];
}

@ArgsType()
export class CompanySearchArgs extends CompanyArgs {
  @Field(() => [String], { nullable: true })
  ids?: string[];
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  orderBy?: string;
  @Field({ nullable: true })
  direction?: string;
}

@ArgsType()
export class UnusedCompanySearchArgs {
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  orderBy?: string;
  @Field({ nullable: true })
  direction?: string;
  @Field({ nullable: true })
  createdFrom?: string;
  @Field({ nullable: true })
  createdTo?: string;
}

@ArgsType()
export class InternalCompaniesDashboardArgs {
  @Field({ nullable: true })
  timePeriodFilter?: string;
  @Field({ nullable: true })
  granularityFilter?: string;
}

@ArgsType()
export class CompanyDiscoveryArgs {
  @Field({ nullable: true })
  query?: string;
  @Field({ nullable: true })
  filterSearch?: string;
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  orderBy?: string;
  @Field({ nullable: true })
  direction?: string;

  // Stimulus Score Elements
  @Field({ nullable: true })
  customerValueFrom?: number;
  @Field({ nullable: true })
  customerValueTo?: number;
  @Field({ nullable: true })
  brandValueFrom?: number;
  @Field({ nullable: true })
  brandValueTo?: number;
  @Field({ nullable: true })
  employeeValueFrom?: number;
  @Field({ nullable: true })
  employeeValueTo?: number;
  @Field({ nullable: true })
  employeesGrowthFrom?: number;
  @Field({ nullable: true })
  employeesGrowthTo?: number;
  @Field({ nullable: true })
  longevityValueFrom?: number;
  @Field({ nullable: true })
  longevityValueTo?: number;

  // Additional Filters
  @Field({ nullable: true })
  scoreValueFrom?: number;
  @Field({ nullable: true })
  scoreValueTo?: number;

  @Field({ nullable: true })
  assetsPctOfRevenueFrom?: number;
  @Field({ nullable: true })
  assetsPctOfRevenueTo?: number;
  @Field({ nullable: true })
  assetsFrom?: number;
  @Field({ nullable: true })
  assetsTo?: number;

  // locations Filters
  @Field({ nullable: true })
  location?: string;
  @Field({ nullable: true })
  longitude?: number;
  @Field({ nullable: true })
  latitude?: number;
  @Field({ nullable: true })
  radius?: number;
  @Field({ nullable: true })
  country?: string;
  @Field({ nullable: true })
  state?: string;
  @Field({ nullable: true })
  city?: string;
  @Field({ nullable: true })
  postalCode?: string;
  @Field({ nullable: true })
  addressStreet?: string;

  @Field({ nullable: true })
  typeOfLegalEntity?: string;
  @Field({ nullable: true })
  industry?: string;
  @Field({ nullable: true })
  revenueFrom?: number;
  @Field({ nullable: true })
  revenueTo?: number;
  @Field({ nullable: true })
  revenueGrowthFrom?: number;
  @Field({ nullable: true })
  revenueGrowthTo?: number;
  @Field({ nullable: true })
  employeesFrom?: number;
  @Field({ nullable: true })
  employeesTo?: number;
  @Field({ nullable: true })
  companyStatus?: string;
  @Field({ nullable: true })
  companyType?: string;
  @Field(() => [String], { nullable: true })
  diverseOwnership?: string[];
  @Field(() => [String], { nullable: true })
  minorityOwnership?: string[];
  @Field(() => [String], { nullable: true })
  tags?: string[];
  @Field(() => [String], { nullable: true })
  relationships?: string[];
  @Field({ nullable: true })
  degreeOfSeparation?: string;
  @Field({ nullable: true })
  amountSpentFrom?: number;
  @Field({ nullable: true })
  amountSpentTo?: number;
  @Field({ nullable: true })
  projectsCountFrom?: number;
  @Field({ nullable: true })
  projectsCountTo?: number;
  @Field({ nullable: true })
  teamCountFrom?: number;
  @Field({ nullable: true })
  teamCountTo?: number;
  @Field({ nullable: true })
  relationshipLengthFrom?: number;
  @Field({ nullable: true })
  relationshipLengthTo?: number;
  @Field(() => [String], { nullable: true })
  industries?: string[];
  @Field({ nullable: true })
  product?: string;
  @Field({ nullable: true })
  certification?: string;
  @Field({ nullable: true })
  insurance?: string;
  @Field({ nullable: true })
  logo?: string;
  @Field(() => [String], { nullable: true })
  previousBusinessNames?: string[];
  @Field(() => [String], { nullable: true })
  otherBusinessNames?: string[];
  @Field({ nullable: true })
  shortDescription?: string;
  @Field({ nullable: true })
  revenuePerEmployeeFrom?: number;
  @Field({ nullable: true })
  revenuePerEmployeeTo?: number;
  @Field({ nullable: true })
  boardTotalFrom?: number;
  @Field({ nullable: true })
  boardTotalTo?: number;
  @Field({ nullable: true })
  leadershipTeamTotalFrom?: number;
  @Field({ nullable: true })
  leadershipTeamTotalTo?: number;
  @Field({ nullable: true })
  netProfitFrom?: number;
  @Field({ nullable: true })
  netProfitTo?: number;
  @Field({ nullable: true })
  netProfitPctFrom?: number;
  @Field({ nullable: true })
  netProfitPctTo?: number;
  @Field({ nullable: true })
  liabilitiesFrom?: number;
  @Field({ nullable: true })
  liabilitiesTo?: number;
  @Field({ nullable: true })
  liabilitiesPctOfRevenueFrom?: number;
  @Field({ nullable: true })
  liabilitiesPctOfRevenueTo?: number;
  @Field({ nullable: true })
  customersFrom?: number;
  @Field({ nullable: true })
  customersTo?: number;
  @Field({ nullable: true })
  netPromoterScoreFrom?: number;
  @Field({ nullable: true })
  netPromoterScoreTo?: number;
  @Field({ nullable: true })
  twitterFollowersFrom?: number;
  @Field({ nullable: true })
  twitterFollowersTo?: number;
  @Field({ nullable: true })
  linkedInFollowersFrom?: number;
  @Field({ nullable: true })
  linkedInFollowersTo?: number;
  @Field({ nullable: true })
  facebookFollowersFrom?: number;
  @Field({ nullable: true })
  facebookFollowersTo?: number;
  @Field({ nullable: true })
  isFavorite?: boolean;
  @Field(() => [String], { nullable: true })
  lists?: string[];
  @Field({ nullable: true })
  tenantId?: string;
}

@ArgsType()
export class CountCompaniesByListArgs {
  @Field({ nullable: true })
  listType: GeneralTypeList;
}

export enum GeneralTypeList {
  ALL = 0,
  FAVORITE = 1,
  INTERNAL = 2,
}

@ArgsType()
export class CompanyActivityLogArgs {
  @Field({ nullable: true })
  companyId: string;
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  orderBy?: string;
  @Field({ nullable: true })
  direction?: string;
}
