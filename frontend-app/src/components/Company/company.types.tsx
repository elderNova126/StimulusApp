import { Tag } from '../../stores/features/company';

export const OWNERSHIP_TAGS_EMPTY_VALUE = 'PAST_TO_EMPTY';

export interface ClassifiedCompanyByType {
  results?: ProjectCompanyType;
  count?: number;
}

export enum nameTypes {
  OTHER = 'OTHER',
  PREVIOUS = 'PREVIOUS',
}

export interface CompanyName {
  id?: number;
  type?: nameTypes;
  name?: string;
}

export interface ProjectCompanyType {
  companyId: string;
  CONSIDERED: number | null;
  QUALIFIED: number | null;
  SHORTLISTED: number | null;
  AWARDED: number | null;
  CLIENT: number | null;
}

export enum CompanyType {
  Considered = 'CONSIDERED',
  Qualified = 'QUALIFIED',
  ShortListed = 'SHORTLISTED',
  Awarded = 'AWARDED',
  Client = 'CLIENT',
}
export interface Section {
  show: boolean;
  name: string;
}
export interface Industry {
  id: string;
  title: string;
  code: string;
  description: string;
}

export interface Contact {
  id: number;
  department: string;
  email: string;
  emailAlt: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  jobTitle: string;
  addressStreet: string;
  addressStreet2: string;
  addressStreet3: string;
  fax: string;
  language: string;
  title: string;
  website: string;
  manager: string;
  linkedin: string;
  twitter: string;
  phone: string;
  phoneAlt: string;
  city: string;
  type?: string;
  tenantId?: string | null;
}

export interface Insurance {
  id: number;
  name: string;
  type: string;
  description: string;
  coverageStart: string;
  coverageEnd: string;
  coverageLimit: number;
  insurer: string;
  policyNumber: string;
  remainingDays?: number | null;
}

export interface Product {
  id: number;
  name: string;
  type: string;
  description: string;
}

export interface Certification {
  id: number;
  name: string;
  type: string;
  description: string;
  certificationDate: string;
  expirationDate: string;
  issuedBy: string;
  certificationNumber: string;
  remainingDays?: number | null;
}
export interface Contingency {
  id: number;
  name: string;
  type: string;
  description: string;
  updated: string;
  created: string;
  website: string;
}

export interface StimulusScore {
  id?: number;
  scoreValue: number;
  brandValue?: number;
  customerValue?: number;
  employeeValue?: number;
  longevityValue?: number;
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
}
export interface Location {
  id: number;
  name: string;
  type: string;
  addressStreet: string;
  addressStreet2: string;
  addressStreet3: string;
  description: string;
  phone: string;
  fax: string;
  country: string;
  postalCode: string;
  state: string;
  city: string;
  longitude: string;
  latitude: string;
  contact: {
    id: number;
    email: string;
    emailAlt: string;
  };
}
export interface GArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
}
export interface Company {
  id: string;
  parentCompany: {
    id: string;
    taxIdNo: string;
  };
  created: string;
  updated: string;
  doingBusinessAs: string;
  operatingStatus: string;
  yearFounded: number;
  customerDataYear: number;
  previousBusinessNames: string;
  otherBusinessNames: string;
  names: CompanyName[];
  brandDataYear: number;
  financialDataYear: number;
  peopleDataYear: number;
  industries: Industry[];
  taxIdNo: number;
  creditScoreBusinessNo: string;
  typeOfLegalEntity: string;
  jurisdictionOfIncorporation: string;
  legalBusinessName: string;
  description: string;
  ownershipDescription: string;
  customers: number;
  website: string;
  customersGrowthCAGR: number;
  boardTotal: number;
  boardDiverse: number;
  leadershipTeamTotal: number;
  leadershipTeamDiverse: number;
  leaderDiverse: string;
  totalLiabilities: number;
  employeesTotal: number;
  employeesTotalGrowthCAGR: number;
  revenuePerEmployee: number;
  employeesDiverse: number;
  revenue: number;
  revenueGrowthCAGR: number;
  netProfit: number;
  netProfitGrowthCAGR: number;
  totalAssets: number;
  assetsRevenueRatio: number;
  liabilitiesRevenueRatio: number;
  diverseOwnership: string[];
  minorityOwnership: string[];
  isSmallBusiness: boolean;
  tags: Tag[];
  webDomain: string;
  emailDomain: string;
  linkedin: string;
  linkedInFollowers: number;
  facebook: string;
  facebookFollowers: number;
  twitter: string;
  twitterFollowers: number;
  currency: string;
  evaluations: number;
  parentCompanyTaxId: string;
  insuranceCoverage: {
    results: Insurance[];
  };
  certifications: {
    results: Certification[];
  };
  stimulusScore: {
    results: StimulusScore[];
  };
  tenantCompanyRelation: {
    id: string;
    internalId: string;
    internalName: string;
    isFavorite: number;
    isToCompare: number;
    type: string;
    status: string;
    supplierTier: number;
  };
  contacts: {
    results: Contact[];
  };
  locations: {
    results: Location[];
  };
  locationsByIndex: Location[];
  products: {
    results: Product[];
  };
  contingencies: {
    results: Contingency[];
  };
  news: GArticle[];
  projectsOverview: {
    globalSpent: number;
    totalProjects: number;
    accountProjects: number;
    accountSpent: number;
    accountEvaluations: number;
    totalEvaluations: number;
  };
  netPromoterScore: number;
}

export const companyExample = {
  id: '1',
  parentCompany: {
    id: '1',
    taxIdNo: '1',
  },
  created: '1',
  updated: '1',
  doingBusinessAs: '1',
  operatingStatus: '1',
  yearFounded: 1,
  customerDataYear: 1,
  previousBusinessNames: '1',
  otherBusinessNames: '1',
  names: [
    {
      id: 1,
      type: nameTypes.OTHER,
      name: 'others',
    },
    {
      id: 2,
      type: nameTypes.PREVIOUS,
      name: 'Previous',
    },
  ],
  brandDataYear: 1,
  financialDataYear: 1,
  peopleDataYear: 1,
  industries: [
    {
      id: '1',
      title: '1',
      code: '1',
      description: '1',
    },
  ],
  taxIdNo: 1,
  creditScoreBusinessNo: '1',
  typeOfLegalEntity: '1',
  jurisdictionOfIncorporation: '1',
  legalBusinessName: '1',
  description: '1',
  ownershipDescription: '1',
  customers: 1,
  website: '1',
  customersGrowthCAGR: 1,
  boardTotal: 1,
  boardDiverse: 1,
  leadershipTeamTotal: 1,
  leadershipTeamDiverse: 1,
  leaderDiverse: '1',
  totalLiabilities: 1,
  employeesTotal: 1,
  employeesTotalGrowthCAGR: 1,
  revenuePerEmployee: 1,
  employeesDiverse: 1,
  revenue: 1,
  revenueGrowthCAGR: 1,
  netProfit: 1,
  netProfitGrowthCAGR: 1,
  totalAssets: 1,
  assetsRevenueRatio: 1,
  liabilitiesRevenueRatio: 1,
  diverseOwnership: ['1'],
  minorityOwnership: ['1'],
  isSmallBusiness: true,
  tags: [
    {
      id: '1',
      tag: '1',
      created: '1',
    },
  ],
  webDomain: '1',
  emailDomain: '1',
  linkedin: '1',
  linkedInFollowers: 1,
  facebook: '1',
  facebookFollowers: 1,
  twitter: '1',
  twitterFollowers: 1,
  currency: '1',
  evaluations: 1,
  parentCompanyTaxId: '',
  insuranceCoverage: {
    results: [
      {
        id: 1,
        name: '1',
        type: '1',
        description: '1',
        coverageStart: '1',
        coverageEnd: '1',
        coverageLimit: 1,
        insurer: '1',
        policyNumber: '1',
      },
    ],
  },
  certifications: {
    results: [
      {
        id: 1,
        name: '1',
        type: '1',
        description: '1',
        certificationDate: '1',
        certificationNumber: '1',
        expirationDate: '1',
        issuedBy: '1',
      },
    ],
  },
  stimulusScore: {
    results: [
      {
        id: 1,
        scoreValue: 1,
        brandValue: 1,
        customerValue: 1,
        employeeValue: 1,
        longevityValue: 1,
        quality: 1,
        reliability: 1,
        features: 1,
        cost: 1,
        relationship: 1,
        financial: 1,
        diversity: 1,
        innovation: 1,
        flexibility: 1,
        brand: 1,
      },
    ],
  },
  tenantCompanyRelation: {
    id: 1,
    internalId: '1',
    internalName: '1',
    isFavorite: 1,
    isToCompare: 1,
    type: '1',
    status: '1',
    supplierTier: 1,
  },
  contacts: {
    results: [
      {
        id: 1,
        department: '1',
        email: '1',
        emailAlt: '1',
        firstName: '1',
        middleName: '1',
        lastName: '1',
        fullName: '1',
        jobTitle: '1',
        addressStreet: '1',
        addressStreet2: '1',
        addressStreet3: '1',
        fax: '1',
        language: '1',
        title: '1',
        website: '1',
        manager: '1',
        linkedin: '1',
        twitter: '1',
        phone: '1',
        phoneAlt: '1',
        city: '1',
      },
    ],
  },
  locations: {
    results: [
      {
        id: 1,
        name: '1',
        type: '1',
        addressStreet: '1',
        addressStreet2: '1',
        addressStreet3: '1',
        description: '1',
        phone: '1',
        fax: '1',
        country: '1',
        postalCode: '1',
        state: '1',
        city: '1',
        longitude: '1',
        latitude: '1',
        contact: {
          id: 1,
          email: '1',
          emailAlt: '1',
        },
      },
    ],
  },
  projectsOverview: {
    globalSpent: 1,
    totalProjects: 1,
    accountProjects: 1,
    accountSpent: 1,
  },
};
