import {
  IChangePasswordBody,
  ICheckVerifyCodeBody,
  IEmailScreenForm,
  ILoginData,
  IResetPasswordBody
} from 'src/interfaces/auth.interface';
import { postMethodApi } from './api';
import { AuthAPi } from './clientConstant';
import { IBodyResponse, IUser } from 'src/interfaces/common.interface';
import { ExistedEmail } from 'src/common/enum/commom';

export interface ILoginResponseData extends IUser {
  token: string;
}

export interface ISignUpResponseData {
  verify_code: string;
}

export interface IChangePasswordResponseData {
  token: string;
}

export interface ICheckEmailDataResponse {
  existed: ExistedEmail;
}

export const loginApi = async (data: ILoginData): Promise<IBodyResponse<ILoginResponseData>> => {
  return postMethodApi(AuthAPi.LOGIN, data);
};

export const signUpApi = async (data: ILoginData): Promise<IBodyResponse<ISignUpResponseData>> => {
  return postMethodApi(AuthAPi.SIGNUP, data);
};

export const logoutApi = async (): Promise<IBodyResponse<any>> => {
  return postMethodApi(AuthAPi.LOGOUT);
};

export const getVerifyCodeApi = async (data: {
  email: string;
}): Promise<IBodyResponse<ISignUpResponseData>> => {
  return postMethodApi(AuthAPi.GETVERIFYTOKEN, data);
};

export const checkVerifyCodeApi = async (
  data: ICheckVerifyCodeBody
): Promise<IBodyResponse<any>> => {
  return postMethodApi(AuthAPi.CHECKVERIFYTOKEN, data);
};

export const changPasswordApi = async (
  data: IChangePasswordBody
): Promise<IBodyResponse<IChangePasswordResponseData>> => {
  return postMethodApi(AuthAPi.CHANGEPASSWORD, data);
};

export const resetPasswordApi = async (data: IResetPasswordBody): Promise<IBodyResponse<any>> => {
  return postMethodApi(AuthAPi.RESETPASSWORD, data);
};

export const checkEmailApi = async (
  data: IEmailScreenForm
): Promise<IBodyResponse<ICheckEmailDataResponse>> => {
  return postMethodApi(AuthAPi.CHECK_EMAIL, data);
};
