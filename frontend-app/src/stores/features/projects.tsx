import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const EMPTY = '';

export interface ProjectsState {
  // For project list filters
  searchByTitle: string;
  searchByStatuses: string[];
  searchArchived: boolean;
  searchNotArchived: boolean;
  searchStartDate: string;
  searchEndDate: string;
  searchAccessType: string;

  // For edit/create new project
  projectId?: string;
  projectTitle: string;
  projectDescription: string;
  projectStartDate: Date | undefined;
  projectEndDate: Date | undefined;
  projectContract: number | undefined;
  projectBudget: number | undefined;
  projectParentId: number | undefined;
  projectKeywords: string;
  projectSelectionCriteria: string[];

  // For project details
  selectedProjectId: string;
  hasNewEvaluation: boolean;
}

const initialState: ProjectsState = {
  searchByTitle: EMPTY,
  searchByStatuses: ['New', 'Open', 'INREVIEW', 'INPROGRESS', 'Completed'],
  searchArchived: false,
  searchNotArchived: false,
  searchStartDate: EMPTY,
  searchEndDate: EMPTY,
  searchAccessType: EMPTY,

  projectTitle: EMPTY,
  projectDescription: EMPTY,
  projectStartDate: undefined,
  projectEndDate: undefined,
  projectParentId: undefined,
  projectKeywords: EMPTY,
  projectContract: undefined,
  projectBudget: undefined,
  projectSelectionCriteria: [],

  selectedProjectId: EMPTY,
  hasNewEvaluation: false,
};

export const ProjectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setTrueHasNewEvaluation: (state) => {
      state.hasNewEvaluation = true;
    },
    setFalseHasNewEvaluation: (state) => {
      state.hasNewEvaluation = false;
    },
    setParentProjectId: (state, action: PayloadAction<number | undefined>) => {
      state.projectParentId = action.payload && isNaN(action.payload) ? undefined : action.payload;
    },
    setSearchByTitle: (state, action: PayloadAction<string>) => {
      state.searchByTitle = action.payload;
    },
    setSearchByStatuses: (state, action: PayloadAction<string[]>) => {
      state.searchByStatuses = action.payload;
    },
    setArchived: (state, action: PayloadAction<boolean>) => {
      state.searchArchived = action.payload;
    },
    setNotArchived: (state, action: PayloadAction<boolean>) => {
      state.searchNotArchived = action.payload;
    },
    setSearchStartDate: (state, action: PayloadAction<string>) => {
      state.searchStartDate = action.payload;
    },
    setSearchEndDate: (state, action: PayloadAction<string>) => {
      state.searchEndDate = action.payload;
    },
    setSearchAccessType: (state, action: PayloadAction<string>) => {
      state.searchAccessType = action.payload;
    },
    setProjectTitle: (state, action: PayloadAction<string>) => {
      state.projectTitle = action.payload;
    },
    setProjectDescription: (state, action: PayloadAction<string>) => {
      state.projectDescription = action.payload;
    },
    setProjectStartDate: (state, action: PayloadAction<Date>) => {
      state.projectStartDate = action.payload;
    },
    setProjectEndDate: (state, action: PayloadAction<Date>) => {
      state.projectEndDate = action.payload;
    },
    setProjectKeywords: (state, action: PayloadAction<string>) => {
      state.projectKeywords = action.payload;
    },
    setProjectContract: (state, action: PayloadAction<number | undefined>) => {
      state.projectContract = action.payload;
    },
    setProjectBudget: (state, action: PayloadAction<number | undefined>) => {
      state.projectBudget = action.payload;
    },
    setProjectSelectionCriteria: (state, action: PayloadAction<string[]>) => {
      state.projectSelectionCriteria = action.payload;
    },
    resetProjectFormState: (state) => {
      state.projectTitle = EMPTY;
      state.projectDescription = EMPTY;
      state.projectStartDate = undefined;
      state.projectEndDate = undefined;
      state.projectKeywords = EMPTY;
      state.projectParentId = undefined;
      state.projectContract = undefined;
      state.projectBudget = undefined;
      state.projectSelectionCriteria = [];
    },
    setSelectedProjectId: (state, action: PayloadAction<string>) => {
      state.selectedProjectId = action.payload;
    },
    resetFilter: () => {
      return initialState;
    },
  },
});

export const {
  setSearchByTitle,
  setSearchByStatuses,
  setArchived,
  setNotArchived,
  setSearchStartDate,
  setSearchEndDate,
  setSearchAccessType,
  setProjectTitle,
  setProjectDescription,
  setProjectStartDate,
  setProjectEndDate,
  setProjectKeywords,
  setProjectContract,
  setProjectBudget,
  setProjectSelectionCriteria,
  resetProjectFormState,
  setSelectedProjectId,
  setParentProjectId,
  setTrueHasNewEvaluation,
  setFalseHasNewEvaluation,
  resetFilter,
} = ProjectsSlice.actions;

export default ProjectsSlice.reducer;
