import { ProfileApi } from './clientConstant';
import { IBodyResponse, IUser } from 'src/interfaces/common.interface';
import { postMethodApi } from './api';

export interface ISetUserInfoResponseData {
  avatar: string;
  cover_image: string;
  link: string;
  city: string;
  country: string;
}
import { postMethodWithFormDataApi } from './api';
import { MyFormData } from 'src/common/type/type';

export const changeInfoAfterSignupApi = async (data: MyFormData): Promise<IBodyResponse<any>> => {
  return postMethodWithFormDataApi(ProfileApi.CHANGE_PROFILE_AFTER_SIGNUP, data);
};

export const getUserInfoApi = async (data: { user_id: string }): Promise<IBodyResponse<IUser>> => {
  return postMethodApi(ProfileApi.GET_USER_INFO, data);
};

export const setUserInfoApi = async (
  data: MyFormData
): Promise<IBodyResponse<ISetUserInfoResponseData>> => {
  return postMethodWithFormDataApi(ProfileApi.SET_USER_INFO, data);
};
