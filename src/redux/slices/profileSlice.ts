import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { changeInfoAfterSignupApi } from 'src/services/profile.services';
import { IUserInfo } from 'src/interfaces/profile.interface';
import { IErrorData } from 'src/interfaces/common.interface';
import { MyFormData } from 'src/common/type/type';

interface IProfileState {
  loading: boolean;
  error: IErrorData | IErrorData[] | string | null;
  info: IUserInfo | null;
}

const initialState: IProfileState = {
  loading: false,
  error: null,
  info: null
};

export const changeInfoAfterSignup = createAsyncThunk(
  'profile/change_info_after_signup',
  async (data: MyFormData, { rejectWithValue }) => {
    try {
      const result = await changeInfoAfterSignupApi(data);
      return result;
    } catch (error) {
      return rejectWithValue({ message: 'sever availability' });
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLink: (state, action) => {
      state = { ...state, info: action.payload };
    }
  },
  extraReducers: builder => {
    builder.addCase(changeInfoAfterSignup.fulfilled, (state, action) => {
      const updatedInfo = action.payload.data;
      state.info = {
        ...state.info,
        username: updatedInfo.username,
        avatar: updatedInfo.avatar
      } as IUserInfo;
    });
  }
});

export const { setLink } = profileSlice.actions;

export default profileSlice.reducer;

export const selectProfile = (state: RootState) => state.profile;
