import { Gender } from 'src/common/enum/commom';

export interface ILoginData {
  email: string;
  password: string;
  device_id?: string;
  fcm_token: string | null
}

export interface ISignUpData {
  ho:string,
  ten:string,
  email: string;
  password: string;
  // name: string;
  // dob?: Date;
  // phone?: string;
  // gender: Gender;
  uuid?: string;
  role: string;
  fcm_token: string | null
}

export interface ICheckVerifyCodeBody {
  email: string;
  verify_code: string;
}

export interface IChangePasswordBody {
  token: string;
  old_password: string;
  new_password: string;
}

export interface IResetPasswordBody {
  email: string;
  password: string;
  code: string;
}

export interface ICheckVerifyCode {
  verify_code: string;
}

export interface INameScreenForm {
  firstname: string;
  lastname: string;
}

export interface IEmailScreenForm {
  email: string;
}

export interface IGenderScreenForm {
  gender: Gender;
}

export interface IPasswordScreenForm {
  password: string;
}

export interface IVerifyOtpSceenForm {
  otpCode: string;
}
