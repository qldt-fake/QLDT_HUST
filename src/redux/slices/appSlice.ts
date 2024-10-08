import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '..';

interface IAppState {
  message: string;
}

const initialState: IAppState = {
  message: ''
};

const appSlice = createSlice({
  name: 'app',
  initialState,

  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    deleteMessage: state => ({ ...state, message: '' })
  }
});
export const selectApp = (state: RootState) => state.app;
export const { setMessage, deleteMessage } = appSlice.actions;
export default appSlice.reducer;
