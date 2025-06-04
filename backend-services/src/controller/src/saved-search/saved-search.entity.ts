import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

interface SearchConfig {
  query?: string;
  scoreValueFrom?: number;
  scoreValueTo?: number;
  jurisdictionOfIncorporation?: string;
  typeOfLegalEntity?: string;
  industries?: string[];
  tags?: string[];
  diverseOwnership?: string[];
  revenueFrom?: number;
  revenueTo?: number;
  employeesFrom?: number;
  employeesTo?: number;
  companyType?: string;
  companyStatus?: string;
  revenuePerEmployeeFrom?: number;
  revenuePerEmployeeTo?: number;
  revenueGrowthFrom?: number;
  revenueGrowthTo?: number;
  relationships?: string[];
  location?: string;
  boardTotalFrom?: number;
  boardTotalTo?: number;
  leadershipTeamTotalFrom?: number;
  leadershipTeamTotalTo?: number;
  netProfitFrom?: number;
  netProfitTo?: number;
  netProfitPctFrom?: number;
  netProfitPctTo?: number;
  liabilitiesFrom?: number;
  liabilitiesTo?: number;
  customersFrom?: number;
  customersTo?: number;
  netPromoterScoreFrom?: number;
  netPromoterScoreTo?: number;
  twitterFollowersFrom?: number;
  twitterFollowersTo?: number;
  linkedInFollowersFrom?: number;
  linkedInFollowersTo?: number;
  facebookFollowersFrom?: number;
  facebookFollowersTo?: number;
  liabilitiesPctOfRevenueFrom?: number;
  liabilitiesPctOfRevenueTo?: number;
  employeesGrowthFrom?: number;
  employeesGrowthTo?: number;
  assetsFrom?: number;
  assetsTo?: number;
  assetsPctOfRevenueFrom?: number;
  assetsPctOfRevenueTo?: number;
  radius?: number;
  country?: string;
  region?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

@Entity()
export class SavedSearch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: string;

  @Column({ type: 'timestamp', nullable: true })
  @CreateDateColumn()
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  @UpdateDateColumn()
  updated: Date;

  @Column('simple-json', { nullable: true })
  config: SearchConfig;

  @Column()
  public: boolean;

  @Column('rowversion')
  rowversion: Buffer;
}
