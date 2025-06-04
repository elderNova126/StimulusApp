import { Moment } from 'moment';
import { ProjectStatus } from './enums';

export interface Pagination {
  page: number;
  limit: number;
}

export interface Order {
  orderAscDirection: boolean;
}

export interface Period {
  from: Moment;
  to: Moment;
}

export interface SimpleCompany {
  id: string;
  legalBusinessName: string;
}

export interface CompanyScoresSearch {
  period?: Period;
  metric: string;
  companies: SimpleCompany[];
}

export interface SavedSearch {
  id?: string;
  name: string;
  public: boolean;
  query?: string;
  scoreValueFrom?: number;
  scoreValueTo?: number;
  industry?: string;
  jurisdictionOfIncorporation?: string;
  status?: string;
  type?: string;
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
  growthFrom?: number;
  growthTo?: number;
  assetsFrom?: number;
  assetsTo?: number;
  assetsPctOfRevenueFrom?: number;
  assetsPctOfRevenueTo?: number;
}

export interface PartialProject {
  id: number;
  status: ProjectStatus;
  ongoing?: boolean;
  archived?: boolean;
  deleted?: boolean;
  created?: string;
  createdBy?: string;
  type?: string;
  expectedStartDate?: string;
  expectedEndDate?: string;
  startDate?: string;
  endDate?: string;
  title: string;
  description?: string;
  contract: number;
  budget: number;
  targetScore?: number;
  keywords?: string;
  selectionCriteria: string[];
  projectCompany: any;
  parentProjectTreeId?: number;
  treeProjectId?: number;
  isContinuedByProject?: {
    id: number;
    title: string;
  };
  continuationOfProject?: {
    id: number;
    title: string;
  };
}
