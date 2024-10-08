import { type AxiosResponse } from 'axios';
import { HttpStatus, OrderDirection } from 'src/common/constants';
import { ReponseCode } from 'src/common/enum/reponseCode';

export interface IErrorData {
  message: string;
  error: string;
  statuCode: HttpStatus;
}

export interface IBodyResponse<T> extends AxiosResponse {
  success: boolean;
  code: ReponseCode;
  message: string;
  data: T;
  error?: IErrorData | IErrorData[] | string;
}

export interface IListBodyResponse<T> extends AxiosResponse {
  success: boolean;
  code: ReponseCode;
  message: string;
  data: T[];
  error?: IErrorData | IErrorData[] | string;
}

export interface ICommonListQuery {
  index?: number;
  count?: number;
}

export interface IUser {
  id: string;
  username: string;
  avatar: string;
  active: string;
  coins: string;
  email: string;
  description: string;
  cover_image: string;
  link: string;
  address: string;
  city: string;
  country: string;
  listing: string;
  is_friend: string;
  online: string;
  created: Date;
}

export interface ICommonGetListQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  orderDirection?: OrderDirection;
  order?: OrderDirection;
  perPage?: number;
}

export interface IGetListResponse<T> {
  items: T[];
  totalItems: number;
}

export interface IVideo {
  videoUri: string;
  thumnail: string;
}

export interface IListItem {
  title: string;
  subtitle?: string;
  iconName?: string;
  onPress?: () => any;
}
