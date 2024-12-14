import { postMethodApi } from 'src/services/api';
import {NotificationApi, SurveyApi} from 'src/services/clientConstant';
import {ISurveyPayload} from "src/interfaces/survey.interface";
import axiosInstance from "src/services/axiosInstance";


export interface IGetUnreadNotificationBody {
  token: string;
}

export interface IMarkNotificationAsReadBody {
  token: string;
  notification_id: number;
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
  image_url: string;
}

export interface IBodyResponse<T> {
  code: number;
  message: string;
  data: T;
}
export const sendNotificationApi = async (payload:any) : Promise<IBodyResponse<any> | null> => {
  const formData = new FormData();

  // Add basic fields
  formData.append('token', payload.token as string);
  // formData.append('title', payload.title as string);
  formData.append('message', payload.message as string);
  formData.append('toUser', payload.toUser as string);
  formData.append('type', payload.type as string);

  // Add file if present
  if (payload.image) {
    formData.append('image', payload.image);
  }

  console.log('formDataAsent', formData);
  try {
    return await axiosInstance.post(NotificationApi.SEND_NOTIFICATIONS, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
    );
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
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
