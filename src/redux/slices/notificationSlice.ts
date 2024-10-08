import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { IErrorData } from 'src/interfaces/common.interface';
import {
  IGetNotification,
  INotificationItem,
  getNotificationApi
} from 'src/services/notification.service';

interface INotificationState {
  loading: boolean;
  notification: INotificationItem[];
  error: IErrorData | IErrorData[] | string | null;
  last_update: string | null;
  badge: string | null;
  isNextFetch: boolean;
}

const initialState: INotificationState = {
  loading: false,
  error: null,
  notification: [],
  last_update: null,
  badge: null,
  isNextFetch: true
};

export const getNextNotifications = createAsyncThunk(
  'notification/getNextNotifications',
  async (data: IGetNotification, { rejectWithValue }) => {
    try {
      const res = await getNotificationApi(data);
      if (res.success) {
        return res;
      } else {
        return rejectWithValue(res.message);
      }
    } catch (err) {
      return rejectWithValue('Rất tiếc, có lỗi xảy ra.Vui lòng thử lại');
    }
  }
);

export const getNotifications = createAsyncThunk(
  'notification/getNotifications',
  async (data: IGetNotification, { rejectWithValue }) => {
    try {
      const res = await getNotificationApi(data);
      if (res.success) {
        return res;
      } else {
        return rejectWithValue(res.message);
      }
    } catch (err) {
      return rejectWithValue('Rất tiếc, có lỗi xảy ra.Vui lòng thử lại');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getNotifications.pending, state => {
      state.loading = true;
    });
    builder.addCase(getNotifications.rejected, (state, action) => {
      state.error = action.payload as string;
      state.loading = false;
      state.isNextFetch = false;
    });
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.notification = action.payload.data;
      state.badge = action.payload.badge;
      state.last_update = action.payload.last_update;
      if (!action.payload.data?.length) {
        state.isNextFetch = false;
      } else {
        state.isNextFetch = true;
      }
      state.loading = false;
    });
    builder.addCase(getNextNotifications.rejected, state => {
      state.loading = false;
      state.isNextFetch = false;
    });
    builder.addCase(getNextNotifications.fulfilled, (state, action) => {
      state.notification = [...state.notification, ...action.payload.data];
      state.badge = action.payload.badge;
      state.last_update = action.payload.last_update;
      if (action.payload.data?.length === 0) {
        state.isNextFetch = false;
      } else {
        state.isNextFetch = true;
      }
      state.loading = false;
    });
    builder.addCase(getNextNotifications.pending, state => {
      state.loading = true;
    });
  }
});

export default notificationSlice.reducer;

export const selectNotification = (state: RootState) => state.notification;
