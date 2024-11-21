import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import appSlice from './appSlice';
import notificationReducer from './notificationSlice';
import settingReducer from './settingSlice';
import blockSlice from './blockSlice';
import loadingSlice from './loadingSlice';

const rootReducer = combineReducers({
  app: appSlice,
  auth: authReducer,
  profile: profileReducer,
  notification: notificationReducer,
  setting: settingReducer,
  block: blockSlice,
  loading: loadingSlice
});

export default rootReducer;
