import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILoginData } from 'src/interfaces/auth.interface';
import { IBodyResponse, IErrorData, IUser } from 'src/interfaces/common.interface';
import { ILoginResponseData, loginApi, logoutApi } from 'src/services/auth.services';
import { RootState } from '..';
import { saveTokenIntoKeychain } from 'src/utils/kechain';
import { resetGenericPassword } from 'react-native-keychain';
import { AccountStatus } from 'src/common/enum/commom';
import {
  getUserInfoApi,
  ISetUserInfoResponseData,
  setUserInfoApi
} from 'src/services/profile.services';
import { MyFormData } from 'src/common/type/type';
import { date } from 'yup';

export interface IAccount {
  avatar: string;
  username: string;
  email: string;
}

export interface IAccount {
  avatar: string;
  username: string;
  email: string;
}

export type MapAccount = Record<string, IAccount>;
interface IAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: IErrorData | IErrorData[] | string | null;
  user: IUser | null;
  accounts: MapAccount;
}

const initialState: IAuthState = {
  isLoading: false,
  isAuthenticated: true,
  error: null,
  user: null,
  accounts: {}
};

export const login = createAsyncThunk(
  'auth/login',
  async (data: ILoginData, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      if (!res.success) {
        return rejectWithValue(res);
      }
      const { token, ...remainData } = res.data;
      await saveTokenIntoKeychain(remainData.id, token);
      return { ...remainData, email: data.email };
    } catch (err) {
      console.log(err);
      return rejectWithValue({ message: 'sever availability' });
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await logoutApi();
    await resetGenericPassword();
  } catch (err) {
    return;
  }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (data: { user_id: string }) => {
  try {
    const res = await getUserInfoApi(data);
    if (res.success) {
      return res.data;
    } else {
      return;
    }
  } catch (err) {
    return;
  }
});

export const setProfile = createAsyncThunk(
  'auth/setProfile',
  async (data: MyFormData, { rejectWithValue }) => {
    try {
      const res = await setUserInfoApi(data);
      if (!res.success) {
        return rejectWithValue(res.message);
      }
      return { ...res.data };
    } catch (err) {
      return rejectWithValue('Vui lòng kiểm tra lại kết nối internet');
    }
  }
);

export const setName = createAsyncThunk(
  'auth/setProfile',
  async (data: MyFormData, { rejectWithValue }) => {
    try {
      const res = await setUserInfoApi(data);
      if (!res.success) {
        return rejectWithValue(res.message);
      }
      return data;
    } catch (err) {
      return rejectWithValue('Vui lòng kiểm tra lại kết nối internet');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: build => {
    build.addCase(login.rejected, (state, action) => {
      const payload = action.payload as IBodyResponse<ILoginResponseData>;
      state.isAuthenticated = false;
      state.error = payload?.message;
      state.isLoading = false;
    });

    build.addCase(login.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload as IUser;
      state.isLoading = false;
      state.accounts[action.payload.id] = {
        avatar: action.payload.avatar,
        email: action.payload.email,
        username: action.payload.username
      };
      state.accounts[action.payload.id] = {
        avatar: action.payload.avatar,
        email: action.payload.email,
        username: action.payload.username
      };
    });

    build.addCase(login.pending, state => {
      state.isLoading = true;
    });

    //logout
    build.addCase(logout.fulfilled, state => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
    });

    build.addCase(logout.rejected, state => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
    });

    build.addCase(logout.pending, state => {
      state.isLoading = true;
    });

    //get profile
    build.addCase(getProfile.fulfilled, (state, action) => {
      state.user = { ...state.user, ...action.payload } as IUser;
    });

    //set profile
    build.addCase(setProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      const { username, ...remainPayload } = action.payload as ISetUserInfoResponseData & {
        username: string;
      };
      if (username) {
        state.user = { ...state.user, ...remainPayload, username: username } as IUser;
      } else {
        state.user = { ...state.user, ...remainPayload } as IUser;
      }
    });

    build.addCase(setProfile.pending, state => {
      state.isLoading = true;
    });

    build.addCase(setProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
  reducers: {
    deleteErrorMessage: state => ({ ...state, error: null }),
    reset: state => ({
      ...state,
      isAuthenticated: false,
      user: null,
      error: null,
      isLoading: false
    }),
    modifyAccountAtivity: (state, action: PayloadAction<AccountStatus>) => ({
      ...state,
      user: { ...state.user, active: action.payload } as IUser
    }),
    changeCoins: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.coins = action.payload;
      }
    },
    setAuthentication: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.username = action.payload;
      }
    },
    deleteAccount: (state, action: PayloadAction<string>) => {
      const accounts = state.accounts;
      delete accounts[action.payload];
      state.accounts = accounts;
    }
  }
});
export const selectAuth = (state: RootState) => state.auth;
export const {
  deleteErrorMessage,
  reset,
  modifyAccountAtivity,
  changeCoins,
  setAuthentication,
  deleteAccount,
  setUsername
} = authSlice.actions;
export default authSlice.reducer;
