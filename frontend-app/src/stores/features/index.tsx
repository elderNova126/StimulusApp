import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FilterInterval {
  from?: number;
  to?: number;
}

export interface Industry {
  id: string;
  code: string;
  title: string;
  label?: string;
  value?: string;
}

export interface GeoFilters {
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  addressStreet?: string;
  radius?: number | string;
}

export interface DiscoveryState {
  currentLocationIsCheck: boolean;
  stimulusScore: FilterInterval;
  industries: Industry[];
  locationsFilter: GeoFilters;
  location: string;
  typeOfLegalEntity: string;
  mapLocation: any;
  relationships: string[];
  status: string[];
  diverseOwnership: string[];
  minorityOwnership: string[];
  revenue: FilterInterval;
  query: string;
  leadership: FilterInterval;
  employees: FilterInterval;
  employeesGrowth: FilterInterval;
  revenueGrowth: FilterInterval;
  assets: FilterInterval;
  assetsPctOfRevenue: FilterInterval;
  employeesFrom?: number;
  employeesTo?: number;
  revenuePerEmployee: FilterInterval;
  boardTotal: FilterInterval;
  leadershipTeamTotal: FilterInterval;
  netProfit: FilterInterval;
  netProfitPct: FilterInterval;
  liabilities: FilterInterval;
  liabilitiesPctOfRevenue: FilterInterval;
  customers: FilterInterval;
  netPromoterScore: FilterInterval;
  twitterFollowers: FilterInterval;
  linkedInFollowers: FilterInterval;
  facebookFollowers: FilterInterval;
  type: string[];
  filterSearch: string;
  listName: string;
  count: number;
  indexList: number;
  savedSearch: boolean;
  closeSearch: boolean;
  relationshipLength: FilterInterval;
  projectsCount?: FilterInterval;
  teamCount?: FilterInterval;
  amountSpent?: FilterInterval;
  degreeOfSeparation: string;

  variables: {
    query?: string;
    employeesFrom?: number;
    employeesTo?: number;
    scoreValueFrom?: number | undefined;
    revenuePerEmployeeFrom?: number | undefined;
    revenuePerEmployeeTo?: number | undefined;
    revenueFrom?: number | undefined;
    revenueTo?: number | undefined;
    scoreValueTo?: number | undefined;
    industries?: string[];
    relationships?: string[];
    location?: string;
    typeOfLegalEntity?: string;
    companyStatus?: string;
    companyType?: string;
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
    revenueGrowthFrom?: number;
    revenueGrowthTo?: number;
    assetsFrom?: number;
    assetsTo?: number;
    assetsPctOfRevenueFrom?: number;
    assetsPctOfRevenueTo?: number;
    diverseOwnership?: string[];
    minorityOwnership?: string[];
    relationshipLengthFrom?: number;
    relationshipLengthTo?: number;
    projectsCountFrom?: number;
    projectsCountTo?: number;
    teamCountFrom?: number;
    teamCountTo?: number;
    amountSpentFrom?: number;
    amountSpentTo?: number;
    degreeOfSeparation?: string;
  };
}

export interface MinorityOwnership {
  id: string;
  minorityOwnershipDetail: string;
  displayName: string;
}

const initialState: DiscoveryState = {
  currentLocationIsCheck: false,
  savedSearch: false,
  closeSearch: false,
  query: '',
  filterSearch: 'legalBusinessName',
  listName: 'all',
  count: 0,
  indexList: 0,
  diverseOwnership: [],
  minorityOwnership: [],
  locationsFilter: { radius: 0 },
  location: '',
  typeOfLegalEntity: '',
  variables: {},
  stimulusScore: {},
  revenue: {},
  leadership: {},
  employees: {},
  employeesGrowth: {},
  revenueGrowth: {},
  assets: {},
  assetsPctOfRevenue: {},
  revenuePerEmployee: {},
  boardTotal: {},
  leadershipTeamTotal: {},
  netProfit: {},
  netProfitPct: {},
  liabilities: {},
  liabilitiesPctOfRevenue: {},
  customers: {},
  netPromoterScore: {},
  twitterFollowers: {},
  linkedInFollowers: {},
  facebookFollowers: {},

  industries: [],
  relationships: [],
  status: [],
  type: [],
  mapLocation: {},
  relationshipLength: {},
  projectsCount: {},
  teamCount: {},
  amountSpent: {},
  degreeOfSeparation: '',
};

export const DiscoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    setCurrentLocationIsCheck: (state: any, action: PayloadAction<boolean>) => {
      state.currentLocationIsCheck = action.payload;
    },
    setLocationFilter: (state: any, action: PayloadAction<GeoFilters>) => {
      state.locationsFilter.latitude = action.payload.latitude;
      state.locationsFilter.longitude = action.payload.longitude;
      state.locationsFilter.country = action.payload.country;
      state.locationsFilter.state = action.payload.state;
      state.locationsFilter.city = action.payload.city;
      state.locationsFilter.postalCode = action.payload.postalCode;
      state.locationsFilter.addressStreet = action.payload.addressStreet;
      state.locationsFilter.radius = action.payload.radius ? parseFloat(action.payload.radius as string) : 0;
    },
    removeLocationFilter: (state: any) => {
      state.locationsFilter = {};
    },
    setindexList: (state: any, action: PayloadAction<number>) => {
      state.indexList = action.payload;
    },
    removeIndexList: (state: any) => {
      state.indexList = 0;
    },
    setListName: (state: any, action: PayloadAction<string>) => {
      state.listName = action.payload;
    },
    setReduxCount: (state: any, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    removeReduxCount: (state: any) => {
      state.count = 0;
    },
    removeListName: (state: any) => {
      state.listName = '';
    },
    setBoardTotalFrom: (state: any, action: PayloadAction<number>) => {
      state.boardTotal.from = action.payload;
    },
    setBoardTotalTo: (state: any, action: PayloadAction<number>) => {
      state.boardTotal.to = action.payload;
    },
    setLeadershipTeamTotalFrom: (state: any, action: PayloadAction<number>) => {
      state.leadershipTeamTotal.from = action.payload;
    },
    setLeadershipTeamTotalTo: (state: any, action: PayloadAction<number>) => {
      state.leadershipTeamTotal.to = action.payload;
    },
    setNetProfitFrom: (state: any, action: PayloadAction<number>) => {
      state.netProfit.from = action.payload;
    },
    setNetProfitTo: (state: any, action: PayloadAction<number>) => {
      state.netProfit.to = action.payload;
    },
    setNetProfitPctFrom: (state: any, action: PayloadAction<number>) => {
      state.netProfitPct.from = action.payload;
    },
    setNetProfitPctTo: (state: any, action: PayloadAction<number>) => {
      state.netProfitPct.to = action.payload;
    },
    setLiabilitiesFrom: (state: any, action: PayloadAction<number>) => {
      state.liabilities.from = action.payload;
    },
    setLiabilitiesTo: (state: any, action: PayloadAction<number>) => {
      state.liabilities.to = action.payload;
    },
    setLiabilitiesPctOfRevenueFrom: (state: any, action: PayloadAction<number>) => {
      state.liabilitiesPctOfRevenue.from = action.payload;
    },
    setLiabilitiesPctOfRevenueTo: (state: any, action: PayloadAction<number>) => {
      state.liabilitiesPctOfRevenue.to = action.payload;
    },
    setCustomersFrom: (state: any, action: PayloadAction<number>) => {
      state.customers.from = action.payload;
    },
    setCustomersTo: (state: any, action: PayloadAction<number>) => {
      state.customers.to = action.payload;
    },
    setNetPromoterScoreFrom: (state: any, action: PayloadAction<number>) => {
      state.netPromoterScore.from = action.payload;
    },
    setNetPromoterScoreTo: (state: any, action: PayloadAction<number>) => {
      state.netPromoterScore.to = action.payload;
    },
    setTwitterFollowersFrom: (state: any, action: PayloadAction<number>) => {
      state.twitterFollowers.from = action.payload;
    },
    setTwitterFollowersTo: (state: any, action: PayloadAction<number>) => {
      state.twitterFollowers.to = action.payload;
    },
    setLinkedInFollowersFrom: (state: any, action: PayloadAction<number>) => {
      state.linkedInFollowers.from = action.payload;
    },
    setLinkedInFollowersTo: (state: any, action: PayloadAction<number>) => {
      state.linkedInFollowers.to = action.payload;
    },
    setFacebookFollowersFrom: (state: any, action: PayloadAction<number>) => {
      state.facebookFollowers.from = action.payload;
    },
    setFacebookFollowersTo: (state: any, action: PayloadAction<number>) => {
      state.facebookFollowers.to = action.payload;
    },
    setEmployeesFrom: (state: any, action: PayloadAction<number | undefined>) => {
      state.employees.from = action.payload;
    },
    setEmployeesTo: (state: any, action: PayloadAction<number>) => {
      state.employees.to = action.payload;
    },
    setEmployeesGrowthFrom: (state: any, action: PayloadAction<number | undefined>) => {
      state.employeesGrowth.from = action.payload;
    },
    setEmployeesGrowthTo: (state: any, action: PayloadAction<number>) => {
      state.employeesGrowth.to = action.payload;
    },
    setRevenueGrowthFrom: (state: any, action: PayloadAction<number>) => {
      state.revenueGrowth.from = action.payload;
    },
    setRevenueGrowthTo: (state: any, action: PayloadAction<number>) => {
      state.revenueGrowth.to = action.payload;
    },
    setAssetsFrom: (state: any, action: PayloadAction<number>) => {
      state.assets.from = action.payload;
    },
    setAssetsTo: (state: any, action: PayloadAction<number>) => {
      state.assets.to = action.payload;
    },
    setAssetsPctOfRevenueFrom: (state: any, action: PayloadAction<number>) => {
      state.assetsPctOfRevenue.from = action.payload;
    },
    setAssetsPctOfRevenueTo: (state: any, action: PayloadAction<number>) => {
      state.assetsPctOfRevenue.to = action.payload;
    },
    setRevenuePerEmployeeFrom: (state: any, action: PayloadAction<number>) => {
      state.revenuePerEmployee.from = action.payload;
    },
    setRevenuePerEmployeeTo: (state: any, action: PayloadAction<number>) => {
      state.revenuePerEmployee.to = action.payload;
    },
    setStimulusScoreFrom: (state: any, action: PayloadAction<number>) => {
      state.stimulusScore.from = action.payload;
    },
    setStimulusScoreTo: (state: any, action: PayloadAction<number>) => {
      state.stimulusScore.to = action.payload;
    },
    setIndustries: (state: any, action: PayloadAction<{ id: string; code: string; title: string }[]>) => {
      state.industries = action.payload;
    },
    setLocation: (state: any, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setMapLocation: (state: any, action: PayloadAction<any>) => {
      state.mapLocation = action.payload;
    },
    setTypeOfLegalEntity: (state: any, action: PayloadAction<string>) => {
      state.typeOfLegalEntity = action.payload;
    },
    setRelationships: (state: any, action: PayloadAction<string[]>) => {
      state.relationships = action.payload;
    },
    setStatus: (state: any, action: PayloadAction<string[]>) => {
      state.status = action.payload;
    },
    setDiverseOwnership: (state: any, action: PayloadAction<string[]>) => {
      state.diverseOwnership = action.payload;
    },
    setMinorityOwnership: (state: any, action: PayloadAction<string[]>) => {
      state.minorityOwnership = action.payload;
    },
    setRevenueFrom: (state: any, action: PayloadAction<number>) => {
      state.revenue.from = action.payload;
    },
    setRevenueTo: (state: any, action: PayloadAction<number>) => {
      state.revenue.to = action.payload;
    },
    setQuery: (state: any, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setType: (state: any, action: PayloadAction<string[]>) => {
      state.type = action.payload;
    },
    setRelationshipLengthFrom: (state: any, action: PayloadAction<number | undefined>) => {
      state.relationshipLength.from = action.payload;
    },
    setRelationshipLengthTo: (state: any, action: PayloadAction<number | undefined>) => {
      state.relationshipLength.to = action.payload;
    },
    setProjectsCountFrom: (state: any, action: PayloadAction<number | undefined>) => {
      state.projectsCount.from = action.payload;
    },
    setProjectsCountTo: (state: any, action: PayloadAction<number | undefined>) => {
      state.projectsCount.to = action.payload;
    },
    setTeamCountFrom: (state: any, action: PayloadAction<number | undefined>) => {
      state.teamCount.from = action.payload;
    },
    setTeamCountTo: (state: any, action: PayloadAction<number | undefined>) => {
      state.teamCount.to = action.payload;
    },
    setAmountSpentFrom: (state: any, action: PayloadAction<number | undefined>) => {
      state.amountSpent.from = action.payload;
    },
    setAmountSpentTo: (state: any, action: PayloadAction<number | undefined>) => {
      state.amountSpent.to = action.payload;
    },
    setDegreeOfSeparation: (state: any, action: PayloadAction<string>) => {
      state.degreeOfSeparation = action.payload;
    },
    applyFilters: (state: any) => {
      const industriesToFind: string[] = state.industries.map((industry: any) =>
        industry.code ? industry.code : industry.id
      );

      const diverseOwnership =
        state.diverseOwnership.length === 0
          ? undefined
          : state.diverseOwnership.map((diverseOwnership: any) => diverseOwnership);

      const minorityOwnership =
        state.minorityOwnership.length === 0
          ? undefined
          : state.minorityOwnership.map((minorityOwnership: any) => minorityOwnership);

      state.variables = {
        query: state.query,
        filterSearch: state.filterSearch,
        scoreValueFrom: state.stimulusScore.from,
        scoreValueTo: state.stimulusScore.to,
        industries: industriesToFind.length > 0 ? industriesToFind : undefined,
        diverseOwnership,
        minorityOwnership,
        relationships: state.relationships.length > 0 ? state.relationships : undefined,
        typeOfLegalEntity: state.typeOfLegalEntity,
        location: state.location,
        companyType: state.type.join(),
        employeesFrom: state.employees.from,
        employeesTo: state.employees.to,
        revenuePerEmployeeFrom: state.revenuePerEmployee.from,
        revenuePerEmployeeTo: state.revenuePerEmployee.to,
        companyStatus: state.status.join(),
        boardTotalFrom: state.boardTotal.from,
        boardTotalTo: state.boardTotal.to,
        leadershipTeamTotalFrom: state.leadershipTeamTotal.from,
        leadershipTeamTotalTo: state.leadershipTeamTotal.to,
        netProfitFrom: state.netProfit.from,
        netProfitTo: state.netProfit.to,
        netProfitPctFrom: state.netProfitPct.from,
        netProfitPctTo: state.netProfitPct.to,
        liabilitiesFrom: state.liabilities.from,
        liabilitiesTo: state.liabilities.to,
        customersFrom: state.customers.from,
        customersTo: state.customers.to,
        netPromoterScoreFrom: state.netPromoterScore.from,
        netPromoterScoreTo: state.netPromoterScore.to,
        twitterFollowersFrom: state.twitterFollowers.from,
        twitterFollowersTo: state.twitterFollowers.to,
        linkedInFollowersFrom: state.linkedInFollowers.from,
        linkedInFollowersTo: state.linkedInFollowers.to,
        facebookFollowersFrom: state.facebookFollowers.from,
        facebookFollowersTo: state.facebookFollowers.to,
        revenueFrom: state.revenue.from,
        revenueTo: state.revenue.to,
        liabilitiesPctOfRevenueFrom: state.liabilitiesPctOfRevenue.from,
        liabilitiesPctOfRevenueTo: state.liabilitiesPctOfRevenue.to,
        employeesGrowthFrom: state.employeesGrowth.from,
        employeesGrowthTo: state.employeesGrowth.to,
        revenueGrowthFrom: state.revenueGrowth.from,
        revenueGrowthTo: state.revenueGrowth.to,
        assetsFrom: state.assets.from,
        assetsTo: state.assets.to,
        assetsPctOfRevenueFrom: state.assetsPctOfRevenue.from,
        assetsPctOfRevenueTo: state.assetsPctOfRevenue.to,
        radius: state.locationsFilter.radius,
        latitude: state.locationsFilter.radius ? state.locationsFilter.latitude : undefined,
        longitude: state.locationsFilter.radius ? state.locationsFilter.longitude : undefined,
        country: state.locationsFilter.country,
        state: state.locationsFilter.state,
        city: state.locationsFilter.city,
        postalCode: state.locationsFilter.postalCode,
        addressStreet: state.locationsFilter.addressStreet,

        relationshipLengthFrom: state.relationshipLength.from,
        relationshipLengthTo: state.relationshipLength.to,

        projectsCountFrom: state.projectsCount.from,
        projectsCountTo: state.projectsCount.to,
        teamCountFrom: state.teamCount.from,
        teamCountTo: state.teamCount.to,
        amountSpentFrom: state.amountSpent.from,
        amountSpentTo: state.amountSpent.to,
        degreeOfSeparation: state.degreeOfSeparation,
      };
    },
    resetFilter: () => {
      return initialState;
    },
    setFilterSearch: (state: any, action: PayloadAction<string>) => {
      state.filterSearch = action.payload;
    },
    setSavedSearch: (state: any, action: PayloadAction<boolean>) => {
      state.savedSearch = action.payload;
    },
    setCloseSearch: (state: any, action: PayloadAction<boolean>) => {
      state.closeSearch = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setReduxCount,
  removeReduxCount,
  setindexList,
  removeIndexList,
  setListName,
  removeListName,
  setStimulusScoreFrom,
  setStimulusScoreTo,
  setIndustries,
  setLocation,
  setRelationships,
  setStatus,
  applyFilters,
  resetFilter,
  setRevenueFrom,
  setRevenueTo,
  setQuery,
  setDiverseOwnership,
  setMinorityOwnership,
  setBoardTotalFrom,
  setBoardTotalTo,
  setLeadershipTeamTotalFrom,
  setLeadershipTeamTotalTo,
  setNetProfitFrom,
  setNetProfitTo,
  setNetProfitPctFrom,
  setNetProfitPctTo,
  setLiabilitiesFrom,
  setLiabilitiesTo,
  setLiabilitiesPctOfRevenueFrom,
  setLiabilitiesPctOfRevenueTo,
  setCustomersFrom,
  setCustomersTo,
  setNetPromoterScoreFrom,
  setNetPromoterScoreTo,
  setTwitterFollowersFrom,
  setTwitterFollowersTo,
  setLinkedInFollowersFrom,
  setLinkedInFollowersTo,
  setFacebookFollowersFrom,
  setFacebookFollowersTo,
  setEmployeesFrom,
  setEmployeesTo,
  setRevenuePerEmployeeFrom,
  setRevenuePerEmployeeTo,
  setEmployeesGrowthFrom,
  setEmployeesGrowthTo,
  setRevenueGrowthFrom,
  setRevenueGrowthTo,
  setAssetsFrom,
  setAssetsTo,
  setAssetsPctOfRevenueFrom,
  setAssetsPctOfRevenueTo,
  setType,
  setMapLocation,
  setFilterSearch,
  setSavedSearch,
  setCloseSearch,
  setTypeOfLegalEntity,
  setLocationFilter,
  removeLocationFilter,
  setCurrentLocationIsCheck,
  setRelationshipLengthFrom,
  setRelationshipLengthTo,
  setProjectsCountFrom,
  setProjectsCountTo,
  setTeamCountFrom,
  setTeamCountTo,
  setAmountSpentFrom,
  setAmountSpentTo,
  setDegreeOfSeparation,
} = DiscoverySlice.actions;

export default DiscoverySlice.reducer;
