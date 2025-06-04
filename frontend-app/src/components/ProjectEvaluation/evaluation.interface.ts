export interface MetricModel {
  id: number;
  category: string;
  question: string;
  exceptionalValue: number;
  metExpectationsValue: number;
  unsatisfactoryValue: number;
  keyId: string;
}

export interface ProjectCompanyModel {
  id: number;
  company: {
    legalBusinessName: string;
  };
  companyId: string;
  evaluations: CompanyEvaluationModel[];
}

export interface CompanyEvaluationModel {
  id: number;
  budgetSpend: number;
  submitted: boolean;
  quality: number;
  reliability: number;
  features: number;
  cost: number;
  relationship: number;
  financial: number;
  diversity: number;
  innovation: number;
  flexibility: number;
  brand: number;
  created: string;
  createdBy: string;
  description: string;
}
