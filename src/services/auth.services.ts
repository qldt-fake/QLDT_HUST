import {
  IChangePasswordBody,
  ICheckVerifyCodeBody,
  IEmailScreenForm,
  ILoginData,
  ISignUpData,
  IResetPasswordBody
} from 'src/interfaces/auth.interface';
import { postMethodApi } from './api';
import { AuthAPi } from './clientConstant';
import { IBodyResponse, IUser, IGetVerifyCodeData } from 'src/interfaces/common.interface';
import { ExistedEmail } from 'src/common/enum/commom';

export interface ILoginResponseData extends IUser {
  id: string;
  ho: string;
  ten: string;
  username: string;
  token: string;
  active: string;
  role: string;
  class_list: string[];
  avatar: string;
}

export interface ISignUpResponseData {
  verify_code: string;
}
export interface IGetVerifyCodeDataResponse {
  code: number;
  message: string;
}
export interface IChangePasswordResponseData {
  token: string;
}

export interface ICheckEmailDataResponse {
  existed: ExistedEmail;
}

export const loginApi = async (data: ILoginData): Promise<any> => {
  return postMethodApi(AuthAPi.LOGIN, data);
};

export const signUpApi = async (data: ISignUpData): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(AuthAPi.SIGNUP, data);
};

export const logoutApi = async (): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(AuthAPi.LOGOUT);
};

export const getVerifyCodeApi = async (data: {
  email: string;
  password?: string;
}): Promise<IGetVerifyCodeData> => {
  return postMethodApi(AuthAPi.GETVERIFYTOKEN, data);
};

export const checkVerifyCodeApi = async (data: ICheckVerifyCodeBody): Promise<any> => {
  return postMethodApi(AuthAPi.CHECKVERIFYTOKEN, data);
};

export const changPasswordApi = async (data: IChangePasswordBody): Promise<any> => {
  return postMethodApi(AuthAPi.CHANGEPASSWORD, data);
};

export const resetPasswordApi = async (
  data: IResetPasswordBody
): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(AuthAPi.RESETPASSWORD, data);
};

export const checkEmailApi = async (
  data: IEmailScreenForm
): Promise<IBodyResponse<ICheckEmailDataResponse, any>> => {
  return postMethodApi(AuthAPi.CHECK_EMAIL, data);
};