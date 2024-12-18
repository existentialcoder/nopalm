import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import { combineReducers } from 'redux';

import appReducer from './slices/app';

import packageReducer from './slices/packages'

import projectReducer from './slices/project'

const rootReducer = combineReducers({
  app: appReducer,
  package: packageReducer,
  project: projectReducer
});

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
