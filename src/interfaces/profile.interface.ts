import { MyFormData } from 'src/common/type/type';

export interface IChangeInfoAfterSignup {
  data: MyFormData;
}
export interface IChangeInfoScreen {
  firstname: string;
  lastname: string;
}
export interface IUserInfo {
  username: string;
  description: string;
  avatar: File | null;
  address: string;
  city: string;
  country: string;
  cover_image: File | null;
  link: string;
}

export interface ISetUserInfoData {
  username?: string;
  description?: string;
  avatar?: File;
  address?: string;
  city?: string;
  country?: string;
  cover_image?: File;
  link?: string;
}
