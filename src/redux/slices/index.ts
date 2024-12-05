import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import appSlice from './appSlice';
import notificationReducer from './notificationSlice';
import settingReducer from './settingSlice';
import blockSlice from './blockSlice';
import loadingSlice from './loadingSlice';
import classDetailsReducer from './classDetailsSlice';
const rootReducer = combineReducers({
  app: appSlice,
  auth: authReducer,
  profile: profileReducer,
  notification: notificationReducer,
  setting: settingReducer,
  block: blockSlice,
  loading: loadingSlice,
  classDetails: classDetailsReducer
});

export default rootReducer;
