import { configureStore } from '@reduxjs/toolkit';
import discoveryReducer from './features';
import companyReducer from './features/company';
import generalDataReducer from './features/generalData';
import projectsReducer from './features/projects';

export const store = configureStore({
  reducer: {
    generalData: generalDataReducer,
    discovery: discoveryReducer,
    projects: projectsReducer,
    company: companyReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
