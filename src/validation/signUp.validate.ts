import { Gender } from 'src/common/enum/commom';
import * as yup from 'yup';
export const nameFormSchema = yup.object({
  firstname: yup.string().required(),
  lastname: yup.string().required()
});

export const emailFormSchema = yup.object({
  email: yup.string().email().required()
});

export const genderFormShema = yup.object({
  gender: yup.mixed<Gender>().oneOf(Object.values(Gender)).required()
});

export const passwordFormSchema = yup.object({
  password: yup.string().min(6).required()
});

export const otpFormSchema = yup.object({
  otpCode: yup.string().min(6, 'Vui lòng nhập đủ mã OTP').required('Vui lòng nhập mã OTP')
});
