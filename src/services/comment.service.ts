import {
  IDeleteFeel,
  IGetListFeels,
  IFeel,
  IGetMarkComment,
  ISetMarkComment
} from 'src/interfaces/comments.interface';
import { postMethodApi } from './api';
import { CommentApi } from './clientConstant';
import { IBodyResponse } from 'src/interfaces/common.interface';
export interface ISearchUserItem {
  id: string;
  username: string;
  avatar: string;
  created: string;
  same_friend: string;
}
export const getMarkCommentApi = async (data: IGetMarkComment): Promise<IBodyResponse<any>> => {
  return postMethodApi(CommentApi.GET_MARK_COMMENT, data);
};

export const setMarkCommentApi = async (data: ISetMarkComment): Promise<any> => {
  return postMethodApi(CommentApi.SET_MARK_COMMENT, data);
};

export const setFeelApi = async (data: IFeel): Promise<any> => {
  return postMethodApi(CommentApi.FEEL, data);
};

export const getListFeelsApi = async (data: IGetListFeels): Promise<any> => {
  return postMethodApi(CommentApi.GET_LIST_FEELS, data);
};

export const deleteFeelsApi = async (data: IDeleteFeel): Promise<any> => {
  return postMethodApi(CommentApi.DELETE_FEEL, data);
};
