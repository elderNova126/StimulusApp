export enum ReportsTypes {
  INTERNAL_COMPANIES = 'ReportSection7585cd4090673f20d910',
  TOTAL_SPENT = 'ReportSection68abce39af1a473a9407',
  PROEJCTS = 'ReportSection166cfb628591c6b7ced5',
}

export enum FilterReports {
  CURRENT = 'current',
  PREVIOUS = 'previous',
  MONTH = 'month',
  QUARTER = 'quarter',
}

export interface VectorDBCompany {
  company_id: string;
  legal_business_name: string;
  description: string;
  naics_description: string;
  diverse_ownership: string[];
  minority_ownership_detail: string[];
  locations: string[];
  score: number;
  vectors: number[];
}

export interface SimilarityVectorResponse {
  company_id: string;
  column1: number;
  column2: number;
  column3: number;
}
