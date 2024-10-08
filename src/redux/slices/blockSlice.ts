import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  time: 1
};

export const blockSlice = createSlice({
  name: 'block',
  initialState,
  reducers: {
    blockComponent: state => {
      state.time = state.time + 1;
    }
  }
});

// Action creators are generated for each case reducer function
export const { blockComponent } = blockSlice.actions;

export default blockSlice.reducer;
