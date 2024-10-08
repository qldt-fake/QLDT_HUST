import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { IErrorData } from 'src/interfaces/common.interface';
import {
  IGetPushSettingResponse,
  ISetPushSettings,
  getPushSettingsApi,
  setPushSettingsApi
} from 'src/services/setting.service';

interface ISettingState {
  loading: boolean;
  pushSetting: IGetPushSettingResponse | null;
  error: IErrorData | IErrorData[] | string | null;
}

const initialState: ISettingState = {
  loading: false,
  error: null,
  pushSetting: null
};

export const getPushSetting = createAsyncThunk(
  'setting/getPushSetting',
  // eslint-disable-next-line no-empty-pattern
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await getPushSettingsApi();
      if (res.success) {
        return res.data;
      } else {
        return rejectWithValue(res.message);
      }
    } catch (err) {
      return rejectWithValue('Rất tiếc, có lỗi xảy ra.Vui lòng thử lại');
    }
  }
);

export const setPushSetting = createAsyncThunk(
  'setting/setPushSetting',
  async (data: ISetPushSettings, { rejectWithValue }) => {
    try {
      const res = await setPushSettingsApi(data);
      if (res.success) {
        return data;
      } else {
        return rejectWithValue(res.message);
      }
    } catch (err) {
      return rejectWithValue('Rất tiếc, có lỗi xảy ra.Vui lòng thử lại');
    }
  }
);

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getPushSetting.pending, state => {
      state.loading = true;
    });
    builder.addCase(getPushSetting.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
    });
    builder.addCase(getPushSetting.fulfilled, (state, action) => {
      state.loading = false;
      state.pushSetting = action.payload;
    });
    builder.addCase(setPushSetting.rejected, state => {
      state.loading = false;
    });
    builder.addCase(setPushSetting.fulfilled, (state, action) => {
      state.loading = false;
      state.pushSetting = action.payload as IGetPushSettingResponse;
    });
    builder.addCase(setPushSetting.pending, state => {
      state.loading = true;
    });
  }
});

export default settingSlice.reducer;

export const selectSetting = (state: RootState) => state.setting;
