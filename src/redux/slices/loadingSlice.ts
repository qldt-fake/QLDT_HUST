import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoading: state => {
      state.isLoading = true;
    },
    hideLoading: state => {
      state.isLoading = false;
    }
  }
});

// Export các action
export const { showLoading, hideLoading } = loadingSlice.actions;

// Export reducer
export default loadingSlice.reducer;
