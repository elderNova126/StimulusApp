import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class SavedSearchArgs {
  @Field({ nullable: true })
  id?: number;
  @Field({ nullable: true })
  created?: Date;
  @Field({ nullable: true })
  updated?: Date;
  @Field({ nullable: true })
  userId?: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  public?: boolean;

  // search config
  @Field({ nullable: true })
  query?: string;
  @Field({ nullable: true })
  scoreValueFrom?: number;
  @Field({ nullable: true })
  scoreValueTo?: number;
  @Field({ nullable: true })
  jurisdictionOfIncorporation?: string;
  @Field({ nullable: true })
  typeOfLegalEntity?: string;
  @Field(() => [String], { nullable: true })
  industries?: string[];
  @Field(() => [String], { nullable: true })
  diverseOwnership?: string[];
  @Field(() => [String], { nullable: true })
  tags?: string[];
  @Field({ nullable: true })
  revenueFrom?: number;
  @Field({ nullable: true })
  revenueTo?: number;
  @Field({ nullable: true })
  employeesFrom?: number;
  @Field({ nullable: true })
  employeesTo?: number;
  @Field({ nullable: true })
  companyType?: string;
  @Field({ nullable: true })
  companyStatus?: string;
  @Field({ nullable: true })
  revenuePerEmployeeFrom?: number;
  @Field({ nullable: true })
  revenuePerEmployeeTo?: number;
  @Field({ nullable: true })
  revenueGrowthFrom?: number;
  @Field({ nullable: true })
  revenueGrowthTo?: number;
  @Field(() => [String], { nullable: true })
  relationships?: string[];
  @Field({ nullable: true })
  location?: string;
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
  liabilitiesPctOfRevenueFrom?: number;
  @Field({ nullable: true })
  liabilitiesPctOfRevenueTo?: number;
  @Field({ nullable: true })
  employeesGrowthFrom?: number;
  @Field({ nullable: true })
  employeesGrowthTo?: number;
  @Field({ nullable: true })
  assetsFrom?: number;
  @Field({ nullable: true })
  assetsTo?: number;
  @Field({ nullable: true })
  assetsPctOfRevenueFrom?: number;
  @Field({ nullable: true })
  assetsPctOfRevenueTo?: number;
  @Field({ nullable: true })
  radius?: number;
  @Field({ nullable: true })
  country?: string;
  @Field({ nullable: true })
  region?: string;
  @Field({ nullable: true })
  city?: string;
  @Field({ nullable: true })
  postalCode?: string;
  @Field({ nullable: true })
  latitude?: number;
  @Field({ nullable: true })
  longitude?: number;
  @Field({ nullable: true })
  currentLocationIsSet?: boolean;
}
