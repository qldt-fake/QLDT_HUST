import { postMethodApi } from 'src/services/api';
import { NotificationApi } from 'src/services/clientConstant';

export interface ISendNotificationBody {
  token: string;
  message: string;
  to_user: number;
  type: 'ABSENCE' | 'ACCEPT_ABSENCE_REQUEST' | 'REJECT_ABSENCE_REQUEST' | 'ASSIGNMENT_GRADE';
}

export interface IGetUnreadNotificationBody {
  token: string;
}

export interface IMarkNotificationAsReadBody {
  token: string;
  notification_ids: number[];
}

export interface IGetNotificationsBody {
  token: string;
  index: number;
  count: number;
}

export interface INotificationResponse {
  id: number;
  type: string;
  status: string;
  from_user: number;
  message: string;
  recipient_id: number;
  sent_time: string;
}

export interface IBodyResponse<T> {
  code: number;
  message: string;
  data: T;
}
export const sendNotificationApi = async (
  data: ISendNotificationBody
): Promise<IBodyResponse<any>> => {
  return postMethodApi(NotificationApi.SEND_NOTIFICATIONS, data);
};

export const getUnreadNotificationApi = async (
  data: IGetUnreadNotificationBody
): Promise<IBodyResponse<INotificationResponse[]>> => {
  return postMethodApi(NotificationApi.GET_UNREAD_NOTIFICATION_COUNT, data);
};

export const markNotificationAsReadApi = async (
  data: IMarkNotificationAsReadBody
): Promise<IBodyResponse<any>> => {
  return postMethodApi(NotificationApi.MARK_NOTIFICATION_AS_READ, data);
};

export const getNotificationsApi = async (
  data: IGetNotificationsBody
): Promise<IBodyResponse<INotificationResponse[]>> => {
  return postMethodApi(NotificationApi.GET_NOTIFICATIONS, data);
};
