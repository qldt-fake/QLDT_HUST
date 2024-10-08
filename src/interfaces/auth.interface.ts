import { Gender } from 'src/common/enum/commom';

export interface ILoginData {
  email: string;
  password: string;
  uuid?: string;
}

export interface ISignUpData {
  email: string;
  password: string;
  name: string;
  dob: Date;
  phone: string;
  gender: Gender;
  uuid?: string;
}

export interface ICheckVerifyCodeBody {
  code_verify: string;
  email: string;
}

export interface IChangePasswordBody {
  password: string;
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
