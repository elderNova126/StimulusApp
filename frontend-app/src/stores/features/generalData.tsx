import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISharedList, ISharedListCollaborator } from '../../graphql/Models/SharedList';
export interface CustomListCount {
  id: number;
  count: number;
}

export interface GeneralState {
  TenantName?: string;
  favoriteFilters: Filter[];
  favoritesCount: number | null;
  internalsCount: number | null;
  customListsCount: CustomListCount[] | [];
  sharedLists: ISharedList[] | [];
  sharedListCollaborators: ISharedListCollaborator[];
  openModal: {
    filter: boolean;
    search: boolean;
  };
  reportPage: string;
  reportId: string;
  errorMap: boolean;
  loadingLogo: {
    company: boolean;
    user: boolean;
  };
  limit: {
    companies: number;
    projects: number;
    reports: number;
  };
  removedBadges: string[];
}

export type Filter =
  | 'SCORE'
  | 'INDUSTRY'
  | 'LOCATION'
  | 'RELATIONSHIP'
  | 'STATUS'
  | 'LEGALENTITY'
  | 'CUSTOMER'
  | 'BRAND'
  | 'BOARD'
  | 'LEADERSHIP'
  | 'EMPLOYEE-GROWTH'
  | 'EMPLOYEE'
  | 'REVENUE'
  | 'NET-PROFIT'
  | 'ASSETS'
  | 'LIABILITIES';

const initialState: GeneralState = {
  TenantName: '',
  favoriteFilters: [],
  favoritesCount: null,
  internalsCount: null,
  customListsCount: [],
  sharedLists: [],
  sharedListCollaborators: [],
  openModal: {
    filter: false,
    search: false,
  },
  reportPage: 'Internal Companies',
  reportId: 'ReportSection7585cd4090673f20d910',
  errorMap: false,
  loadingLogo: {
    company: false,
    user: false,
  },
  limit: {
    companies: 10,
    projects: 5,
    reports: 10,
  },
  removedBadges: [],
};

export const GeneralSlicer = createSlice({
  name: 'generalData',
  initialState,
  reducers: {
    setTenantName: (state: any, action: PayloadAction<string>) => {
      state.TenantName = action.payload;
    },
    resetTenantName: (state: any) => {
      state.TenantName = '';
    },
    setFavoriteFilters: (state: any, action: PayloadAction<Filter[]>) => {
      state.favoriteFilters = action.payload;
    },
    setFavoritesCount: (state: any, action: PayloadAction<number>) => {
      state.favoritesCount = action.payload;
    },
    setInternalsCount: (state: any, action: PayloadAction<number>) => {
      state.internalsCount = action.payload;
    },
    setCustomListsCount: (state: any, action: PayloadAction<CustomListCount[]>) => {
      state.customListsCount = action.payload;
    },
    setSharedLists: (state: any, action: PayloadAction<ISharedList[]>) => {
      state.sharedLists = action.payload;
    },
    setSharedListCollaborators: (state: any, action: PayloadAction<ISharedListCollaborator[]>) => {
      state.sharedListCollaborators = action.payload;
    },
    setFilterOpen: (state: any, action: PayloadAction<boolean>) => {
      state.openModal.filter = action.payload;
    },
    setOpenSearch: (state: any, action: PayloadAction<boolean>) => {
      state.openModal.search = action.payload;
    },
    setReportPage: (state: any, action: PayloadAction<string>) => {
      state.reportPage = action.payload;
    },
    setReportId: (state: any, action: PayloadAction<string>) => {
      state.reportId = action.payload;
    },
    setErrorMap: (state: any, action: PayloadAction<boolean>) => {
      state.errorMap = action.payload;
    },
    setLoadingLogoCompany: (state: any, action: PayloadAction<boolean>) => {
      state.loadingLogo.company = action.payload;
    },
    setLoadingLogoUser: (state: any, action: PayloadAction<boolean>) => {
      state.loadingLogo.user = action.payload;
    },
    setLimitCompanies: (state: any, action: PayloadAction<number>) => {
      state.limit.companies = action.payload;
    },
    setLimitProjects: (state: any, action: PayloadAction<number>) => {
      state.limit.projects = action.payload;
    },
    setLimitReports: (state: any, action: PayloadAction<number>) => {
      state.limit.reports = action.payload;
    },
    setRemovedBadges: (state: any, action: PayloadAction<string[]>) => {
      state.removedBadges = action.payload;
    },
  },
});

export const {
  setFavoritesCount,
  setInternalsCount,
  setCustomListsCount,
  setSharedLists,
  setSharedListCollaborators,
  setFilterOpen,
  setOpenSearch,
  setFavoriteFilters,
  setReportPage,
  setReportId,
  setErrorMap,
  setTenantName,
  resetTenantName,
  setLoadingLogoCompany,
  setLoadingLogoUser,
  setLimitCompanies,
  setLimitProjects,
  setLimitReports,
  setRemovedBadges,
} = GeneralSlicer.actions;

export default GeneralSlicer.reducer;
