import {configureStore} from '@reduxjs/toolkit';
import {combineReducers} from 'redux';
import userSlice from './reducers/userSlice';

const reducers = combineReducers({
  user :userSlice,
});

export const store = configureStore({
  reducer: reducers,
});

export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
