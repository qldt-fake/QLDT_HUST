import {
  IGetSavedSearch,
  IDeleteSavedSearch,
  ISearch,
  ISearchResult,
  IGetSearchUser
} from 'src/interfaces/search.interface';
import { postMethodApi } from './api';
import { SearchApi } from './clientConstant';
import { IBodyResponse, IListBodyResponse } from 'src/interfaces/common.interface';
export interface ISearchUserItem {
  id: string;
  username: string;
  avatar: string;
  created: string;
  same_friend: string;
}
export const getSaveSearchApi = async (data: IGetSavedSearch): Promise<IBodyResponse<any>> => {
  return postMethodApi(SearchApi.GET_SAVE_SEARCH, data);
};

export const deleteSavedSearchApi = async (data: IDeleteSavedSearch): Promise<any> => {
  return postMethodApi(SearchApi.DEL_SAVE_SEARCH, data);
};

export const searchApi = async (data: ISearch): Promise<IListBodyResponse<ISearchResult>> => {
  return postMethodApi(SearchApi.SEARCH, data);
};

export const searchUserAPi = async (
  data: IGetSearchUser
): Promise<IListBodyResponse<ISearchUserItem>> => {
  return postMethodApi(SearchApi.SEARCH_USER, data);
};
