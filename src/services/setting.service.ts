import { IBodyResponse } from 'src/interfaces/common.interface';
import { postMethodApi } from './api';
import { SettingsApi } from './clientConstant';
import { booleanReponse } from 'src/common/enum/commom';

export interface ISetDevToken {
  devtype: string;
  devtoken: string;
}

export interface ISetPushSettings {
  like_comment: booleanReponse;
  from_friends: booleanReponse;
  requested_friend: booleanReponse;
  suggested_friend: booleanReponse;
  birthday: booleanReponse;
  video: booleanReponse;
  report: booleanReponse;
  sound_on: booleanReponse;
  notification_on: booleanReponse;
  vibrant_on: booleanReponse;
  led_on: booleanReponse;
}

export interface IGetPushSettingResponse {
  like_comment: booleanReponse;
  from_friends: booleanReponse;
  requested_friend: booleanReponse;
  suggested_friend: booleanReponse;
  birthday: booleanReponse;
  video: booleanReponse;
  report: booleanReponse;
  sound_on: booleanReponse;
  notification_on: booleanReponse;
  vibrant_on: booleanReponse;
  led_on: booleanReponse;
}

export const setDevTokenApi = (data: ISetDevToken): Promise<IBodyResponse<any>> => {
  return postMethodApi(SettingsApi.SET_DEVTOKEN, data);
};

export const setPushSettingsApi = (data: ISetPushSettings): Promise<IBodyResponse<any>> => {
  return postMethodApi(SettingsApi.SET_PUSH_SETTINGS, data);
};

export const getPushSettingsApi = async (): Promise<IBodyResponse<IGetPushSettingResponse>> => {
  return postMethodApi(SettingsApi.GET_PUSH_SETTINGS, {});
};

export const buyCoins = async (data: { code: string; coins: string }): Promise<any> => {
  return postMethodApi(SettingsApi.BUY_COINS, data);
};
