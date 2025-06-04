import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyName } from '../../components/Company/company.types';
interface Mutation {
  id: string;
  gql: void;
}
interface IndustryCodeItem {
  id: string;
  code: string;
  title: string;
  label: string;
  value: string;
}
export interface Tag {
  id?: string;
  tag: string;
  created?: string;
}
interface Location {
  addressStreet: string;
  addressStreet2: string;
  addressStreet3: string;
  postalCode: string;
  country: string;
  city: string;
  phone: string;
  fax: string;
  state: string;
  description: string;
  zip: string;
  latitude: string;
  longitude: string;
}
export interface CompanyUpdateState {
  loading: boolean;
  mutations: Mutation[];
  showError: boolean;

  id: string;
  edit: boolean;
  description: string;
  legalBusinessName: string;

  // PROFILE
  taxIdNo: string;
  website: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  doingBusinessAs: string;
  previousBusinessNames: string[];
  otherBusinessNames: string[];
  names: CompanyName[];
  industries: IndustryCodeItem[];
  jurisdictionOfIncorporation: string;
  operatingStatus: string;
  locations:
    | {
        addressStreet: string;
        addressStreet2: string;
        addressStreet3: string;
        postalCode: string;
        country: string;
        city: string;
        phone: string;
        fax: string;
        state: string;
        description: string;
        zip: string;
        latitude: string;
        longitude: string;
      }[]
    | null;
  mapLocation: Location | null;
  yearFounded: number | null;
  typeOfLegalEntity: string;
  industryClassificationCode: string;
  creditScoreBusinessNo: string | null;
  webDomain: string;
  emailDomain: string;
  linkedInFollowers: number;
  facebookFollowers: number;
  twitterFollowers: number;
  currency: string;
  parentCompanyId: string;
  tags: Tag[];
  diverseOwnership: string[];
  minorityOwnership: string[];
  isSmallBusiness: boolean;
  ownershipDescription: string;
  parentCompanyTaxId: string;
  // FINANCIAL
  revenue: number | null;
  revenueCAGR: number | null;
  netProfit: number | null;
  netProfitCAGR: number | null;
  totalAssets: number | null;
  assetsRatio: number | null;
  liabilitiesRatio: number | null;
  totalLiabilities: number | null;

  // PEOPLE
  boardTotal: number | null;
  boardDiverse: number | null;
  leadershipTeamTotal: number | null;
  employeesDiverse: number | null;
  employeesTotal: number | null;

  // CUSTOMERS
  customers: number | null;
  customersGrowthCAGR: number | null;
  netPromoterScore: number | null;
  tenantCompanyRelation: {
    internalName: string;
    internalId: string;
  };
}

const initialState: CompanyUpdateState = {
  loading: false,
  id: '',
  mutations: [],
  showError: false,
  edit: false,
  description: '',
  legalBusinessName: '',

  // PROFILE
  taxIdNo: '',
  website: '',
  facebook: '',
  twitter: '',
  linkedin: '',
  doingBusinessAs: '',
  previousBusinessNames: [],
  otherBusinessNames: [],
  names: [],
  industries: [],
  jurisdictionOfIncorporation: '',
  operatingStatus: '',
  yearFounded: null,
  typeOfLegalEntity: '',
  industryClassificationCode: '',
  locations: [],
  mapLocation: null,
  creditScoreBusinessNo: '',
  webDomain: '',
  emailDomain: '',
  linkedInFollowers: 0,
  facebookFollowers: 0,
  twitterFollowers: 0,
  currency: '',
  parentCompanyId: '',
  tags: [],
  diverseOwnership: [],
  minorityOwnership: [],
  isSmallBusiness: false,
  ownershipDescription: '',
  parentCompanyTaxId: '',
  // FINANCIAL
  revenue: null,
  revenueCAGR: null,
  netProfit: null,
  netProfitCAGR: null,
  totalAssets: null,
  assetsRatio: null,
  liabilitiesRatio: null,
  totalLiabilities: null,

  // PEOPLE
  boardTotal: null,
  boardDiverse: null,
  leadershipTeamTotal: null,
  employeesDiverse: null,
  employeesTotal: null,

  // CUSTOMERS
  customers: null,
  customersGrowthCAGR: null,
  netPromoterScore: null,
  tenantCompanyRelation: {
    internalName: '',
    internalId: '',
  },
};

export const CompanySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    addOrUpdateMutation: (state, action: PayloadAction<Mutation>) => {
      const mutation = action.payload;
      state.mutations = [...state.mutations.filter((m: any) => mutation?.id !== m.id), mutation];
    },
    removeMutation: (state, action: PayloadAction<Mutation>) => {
      const mutation = action.payload;
      state.mutations = state.mutations.filter((m: any) => m.id !== mutation?.id);
    },
    clearMutations: (state, action: PayloadAction<any>) => {
      state.mutations = [];
    },
    setShowError: (state, action: PayloadAction<boolean>) => {
      state.showError = action.payload;
    },
    initCompany: (state: any, action: any) => {
      state.description = action.payload?.description;
      state.legalBusinessName = action.payload?.legalBusinessName;
      state.taxIdNo = action.payload?.taxIdNo;
      state.website = action.payload?.website;
      state.facebook = action.payload?.facebook;
      state.twitter = action.payload?.twitter;
      state.linkedin = action.payload?.linkedin;
      state.doingBusinessAs = action.payload?.doingBusinessAs;
      state.previousBusinessNames = action.payload?.previousBusinessNames;
      state.otherBusinessNames = action.payload?.otherBusinessNames;
      state.names = action.payload?.names;
      state.industry = action.payload?.industry;
      state.jurisdictionOfIncorporation = action.payload?.jurisdictionOfIncorporation;
      state.yearFounded = action.payload?.yearFounded;
      state.typeOfLegalEntity = action.payload?.typeOfLegalEntity;
      state.industryClassificationCode = action.payload?.industryClassificationCode;
      state.creditScoreBusinessNo = action.payload?.creditScoreBusinessNo;
      state.webDomain = action.payload?.webDomain;
      state.emailDomain = action.payload?.emailDomain;
      state.linkedInFollowers = action.payload?.linkedInFollowers;
      state.facebookFollowers = action.payload?.facebookFollowers;
      state.twitterFollowers = action.payload?.twitterFollowers;
      state.currency = action.payload?.currency;
      state.parentCompanyId = action.payload?.parentCompany?.taxIdNo;
      state.tags = action.payload?.tags;
      state.diverseOwnership = action.payload?.diverseOwnership;
      state.minorityOwnership = action.payload?.minorityOwnership;
      state.isSmallBusiness = action.payload?.isSmallBusiness;
      state.ownershipDescription = action.payload?.ownershipDescription;
      state.revenue = action.payload?.revenue;
      state.parentCompanyTaxId = action.payload?.parentCompanyTaxId;
      state.revenueCAGR = action.payload?.revenueCAGR;
      state.netProfit = action.payload?.netProfit;
      state.netProfitCAGR = action.payload?.netProfitCAGR;
      state.totalAssets = action.payload?.totalAssets;
      state.assetsRatio = action.payload?.assetsRatio;
      state.liabilitiesRatio = action.payload?.liabilitiesRatio;
      state.boardTotal = action.payload?.boardTotal;
      state.boardDiverse = action.payload?.boardDiverse;
      state.leadershipTeamTotal = action.payload?.leadershipTeamTotal;
      state.employeesDiverse = action.payload?.employeesDiverse;
      state.employeesTotal = action.payload?.employeesTotal;
      state.customers = action.payload?.customers;
      state.netPromoterScore = action.payload?.netPromoterScore * 100;
      state.customersGrowthCAGR = action.payload?.customersGrowthCAGR;
      state.industries = action.payload?.industries;
      state.tenantCompanyRelation = action.payload?.tenantCompanyRelation;
      state.operatingStatus = action.payload?.operatingStatus;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCompanyEdit: (state, action: PayloadAction<boolean>) => {
      state.edit = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setLegalBusinessName: (state, action: PayloadAction<string>) => {
      state.legalBusinessName = action.payload;
    },
    setTaxIdNo: (state, action: PayloadAction<string>) => {
      state.taxIdNo = action.payload;
    },
    setParentCompanyTaxId: (state, action: PayloadAction<string>) => {
      state.parentCompanyTaxId = action.payload;
    },
    setWebsite: (state, action: PayloadAction<string>) => {
      state.website = action.payload;
    },

    setFacebook: (state, action: PayloadAction<string>) => {
      state.facebook = action.payload;
    },
    setTwitter: (state, action: PayloadAction<string>) => {
      state.twitter = action.payload;
    },
    setLinkedIn: (state, action: PayloadAction<string>) => {
      state.linkedin = action.payload;
    },
    setDoingBusinessAs: (state, action: PayloadAction<string>) => {
      state.doingBusinessAs = action.payload;
    },
    setPreviusBusinessName: (state, action: PayloadAction<string[]>) => {
      state.previousBusinessNames = action.payload;
    },
    setOtherBusinessNames: (state, action: PayloadAction<string[]>) => {
      state.otherBusinessNames = action.payload;
    },
    setIndustries: (state, action: PayloadAction<IndustryCodeItem[]>) => {
      state.industries = action.payload;
    },
    setJurisdictionOfIncorporation: (state, action: PayloadAction<string>) => {
      state.jurisdictionOfIncorporation = action.payload;
    },
    setOperatingStatus: (state, action: PayloadAction<string>) => {
      state.operatingStatus = action.payload;
    },
    setLocations: (state, action: PayloadAction<any>) => {
      state.locations = action.payload;
    },
    setMapLocation: (state, action: PayloadAction<any>) => {
      state.mapLocation = action.payload;
    },
    setYearFounded: (state, action: PayloadAction<number>) => {
      if (!isNaN(Number(action.payload))) {
        state.yearFounded = action.payload ? action.payload : null;
      } else {
        state.yearFounded = null;
      }
    },
    setTypeOfLegalEntity: (state, action: PayloadAction<string>) => {
      state.typeOfLegalEntity = action.payload;
    },
    setIndustryClassificationCode: (state, action: PayloadAction<string>) => {
      state.industryClassificationCode = action.payload;
    },
    setCreditScoreBusinessNo: (state, action: PayloadAction<string>) => {
      state.creditScoreBusinessNo = action.payload;
    },
    setWebDomain: (state, action: PayloadAction<string>) => {
      state.webDomain = action.payload;
    },
    setEmailDomain: (state, action: PayloadAction<string>) => {
      state.emailDomain = action.payload;
    },
    setLinkedInFollowers: (state, action: PayloadAction<number>) => {
      state.linkedInFollowers = action.payload;
    },
    setFacebookFollowers: (state, action: PayloadAction<number>) => {
      state.facebookFollowers = action.payload;
    },
    setTwitterFollowers: (state, action: PayloadAction<number>) => {
      state.twitterFollowers = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setParentCompanyId: (state, action: PayloadAction<string>) => {
      state.parentCompanyId = action.payload;
    },
    setTags: (state, action: PayloadAction<Tag[]>) => {
      state.tags = action.payload;
    },
    setDiverseOwnership: (state, action: PayloadAction<string[]>) => {
      state.diverseOwnership = action.payload;
    },
    setMinorityOwnership: (state, action: PayloadAction<string[]>) => {
      state.minorityOwnership = action.payload;
    },
    setIsSmallBusiness: (state, action: PayloadAction<boolean>) => {
      state.isSmallBusiness = action.payload;
    },
    setOwnershipDescription: (state, action: PayloadAction<string>) => {
      state.ownershipDescription = action.payload;
    },
    setRevenue: (state, action: PayloadAction<number>) => {
      state.revenue = action.payload;
    },
    setRevenueCAGR: (state, action: PayloadAction<number>) => {
      state.revenueCAGR = action.payload;
    },
    setNetProfit: (state, action: PayloadAction<number>) => {
      state.netProfit = action.payload;
    },
    setNetProfitCAGR: (state, action: PayloadAction<number>) => {
      state.netProfitCAGR = action.payload;
    },
    setTotalAssets: (state, action: PayloadAction<number>) => {
      state.totalAssets = action.payload;
    },
    setAssetsRatio: (state, action: PayloadAction<number>) => {
      state.assetsRatio = action.payload;
    },
    setTotalLiabilities: (state, action: PayloadAction<number>) => {
      state.totalLiabilities = action.payload;
    },
    setLiabilitiesRatio: (state, action: PayloadAction<number>) => {
      state.liabilitiesRatio = action.payload;
    },
    setBoardTotal: (state, action: PayloadAction<number>) => {
      state.boardTotal = action.payload;
    },
    setBoardDiverse: (state, action: PayloadAction<number>) => {
      state.boardDiverse = action.payload;
    },
    setLeadershipTeamTotal: (state, action: PayloadAction<number>) => {
      state.leadershipTeamTotal = action.payload;
    },
    setEmployeesDiverse: (state, action: PayloadAction<number>) => {
      const value = isNaN(action.payload) || action.payload < 0 ? 0 : action.payload > 100 ? 100 : action.payload;
      state.employeesDiverse = value;
    },
    setEmployeesTotal: (state, action: PayloadAction<number>) => {
      state.employeesTotal = action.payload;
    },
    setCustomers: (state, action: PayloadAction<number>) => {
      state.customers = action.payload;
    },
    setCustomersGrowthCAGR: (state, action: PayloadAction<number>) => {
      state.customersGrowthCAGR = action.payload;
    },
    setNetPromoterScore: (state, action: PayloadAction<number>) => {
      state.netPromoterScore = action.payload;
    },
    setCompany: (state, action: PayloadAction<any>) => {
      state = action.payload;
    },
    setInternalId: (state, action: PayloadAction<string>) => {
      state.tenantCompanyRelation.internalId = action.payload;
    },
    setInternalName: (state, action: PayloadAction<string>) => {
      state.tenantCompanyRelation.internalName = action.payload;
    },
  },
});

export const {
  addOrUpdateMutation,
  removeMutation,
  clearMutations,
  setShowError,
  setCompanyEdit,
  setDescription,
  setLegalBusinessName,
  setTaxIdNo,
  setWebsite,
  setFacebook,
  setTwitter,
  setLinkedIn,
  setDoingBusinessAs,
  setPreviusBusinessName,
  setIndustries,
  setJurisdictionOfIncorporation,
  setOperatingStatus,
  setYearFounded,
  setTypeOfLegalEntity,
  setIndustryClassificationCode,
  setCreditScoreBusinessNo,
  setOtherBusinessNames,
  setWebDomain,
  setEmailDomain,
  setLinkedInFollowers,
  setFacebookFollowers,
  setTwitterFollowers,
  setCurrency,
  setParentCompanyId,
  setTags,
  setDiverseOwnership,
  setMinorityOwnership,
  setIsSmallBusiness,
  setOwnershipDescription,
  setRevenue,
  setRevenueCAGR,
  setNetProfit,
  setNetProfitCAGR,
  setTotalAssets,
  setAssetsRatio,
  setTotalLiabilities,
  setLiabilitiesRatio,
  setBoardTotal,
  setBoardDiverse,
  setLeadershipTeamTotal,
  setEmployeesDiverse,
  setEmployeesTotal,
  setCustomers,
  setCustomersGrowthCAGR,
  initCompany,
  setLoading,
  setLocations,
  setCompany,
  setInternalId,
  setInternalName,
  setParentCompanyTaxId,
  setNetPromoterScore,
} = CompanySlice.actions;

export default CompanySlice.reducer;
