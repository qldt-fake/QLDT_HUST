import {
  IBodyResponse,
  ICommonListQuery,
  IListBodyResponse
} from 'src/interfaces/common.interface';
import { postMethodApi } from './api';
import { BlockApi } from './clientConstant';

export interface IBlockUserData {
  id: string;
  name: string;
  avatar: string;
}

export const getListBlockApi = async (
  data: ICommonListQuery
): Promise<IListBodyResponse<IBlockUserData>> => {
  return postMethodApi(BlockApi.GET_LIST_BLOCKS, data);
};

export const setBlockApi = async (data: { user_id: string }): Promise<IBodyResponse<any>> => {
  return postMethodApi(BlockApi.SET_BLOCK, data);
};

export const unBlockApi = async (data: { user_id: string }): Promise<IBodyResponse<any>> => {
  return postMethodApi(BlockApi.UN_BLOCK, data);
};
