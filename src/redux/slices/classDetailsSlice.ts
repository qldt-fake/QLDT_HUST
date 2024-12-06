import { RootState } from 'src/redux';
import { createSlice } from '@reduxjs/toolkit';

// Slice để lưu trữ thông tin lớp học
const classDetailsSlice = createSlice({
  name: 'classDetails',
  initialState: {
    classDetail: null,
  },
  reducers: {
    setClassDetails(state, action) {
      state.classDetail = action.payload; // Cập nhật thông tin lớp học
    },
    clearClassDetails(state) {
      state.classDetail = null; // Xóa thông tin lớp học khi cần thiết
    },
  },
});

// Export các action và reducer
export const { setClassDetails, clearClassDetails } = classDetailsSlice.actions;
export const selectClassDetails = (state: RootState) => state.classDetails.classDetail;
export default classDetailsSlice.reducer;
