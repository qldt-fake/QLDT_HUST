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
import { CODE_OK, LOCKED, USER_NOT_FOUND } from 'src/common/constants/responseCode';
import { NavigationProp, useNavigation } from '@react-navigation/native';


export interface IAccount {
  avatar: string;
  name: string;
  // email: string;
  role: string;
  class_list: string[]
}

export type MapAccount = Record<string, IAccount>;
interface IAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  isAccountLocked: boolean;
  error: IErrorData | IErrorData[] | string | null;
  user: IUser | null;
  accounts: MapAccount;
}

const initialState: IAuthState = {
  isLoading: false,
  isAuthenticated: true,
  isAccountLocked: false,
  error: null,
  user: null,
  accounts: {}
};

export const login = createAsyncThunk(
  'auth/login',
  async (data: ILoginData, { rejectWithValue }) => {
    try {
      const res = await loginApi(data);
      console.log(res);

      if (!res) {
        return rejectWithValue(res);
      }
      if (res.code !== CODE_OK ) {
        if (res.code === LOCKED) {
          return rejectWithValue(
            {
              message: "Tài khoản chưa verify",
              error_code: LOCKED
            }
          );
        }
        return rejectWithValue({ message: res.message });
      }
      const { ...remainData } = res;
      if (remainData.data.name && remainData.data.token) await saveTokenIntoKeychain(remainData.data.name, remainData.data.token);
      return { ...remainData, email: data.email };
    } catch (err) {
      console.log("login Api error = ", err);
      return rejectWithValue({ message: 'Máy chủ lỗi' });
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
      const payload = action.payload as IBodyResponse<ILoginResponseData,any>;
      state.isAuthenticated = false;
      state.error = payload?.message;
      state.isLoading = false;
      state.isAccountLocked = true;
      const payload2 = action.payload as { message: string, error_code: number, }
      state.error = payload2.message;
      state.isAccountLocked = payload2?.error_code === LOCKED
    });

    build.addCase(login.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.data as IUser
      state.isLoading = false;
      state.isAccountLocked = false;
      state.accounts[action.payload.id] = {
        avatar: action.payload.data.avatar,
        name: action.payload.data.user_name,
        role: action.payload.data.role,
        class_list: action.payload.data.class_list
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
      const { name, ...remainPayload } = action.payload as ISetUserInfoResponseData & {
        name: string;
      };
      if (name) {
        state.user = { ...state.user, ...remainPayload, name: name } as IUser;
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

    setAuthentication: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setname: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.name = action.payload;
      }
    },
    deleteAccount: (state, action: PayloadAction<string>) => {
      const accounts = state.accounts;
      delete accounts[action.payload];
      state.accounts = accounts;
    },
    resetAccountLocked: (state) => {
      state.isAccountLocked = false;
    },
  }
});
export const selectAuth = (state: RootState) => state.auth;
export const {
  deleteErrorMessage,
  reset,
  modifyAccountAtivity,
  setAuthentication,
  deleteAccount,
  setname,
  resetAccountLocked
} = authSlice.actions;
export default authSlice.reducer;
