import { HttpStatus } from 'src/common/constants';
import { type IBodyResponse } from 'src/interfaces/common.interface';
import axios, {
  type AxiosRequestConfig,
  type AxiosRequestHeaders,
  type AxiosResponse
} from 'axios';
import { API_BASE } from '@env';
import dayjs from 'src/utils/dayjs';
import { getTokenFromKeychain, deleteTokenFromKeychain } from 'src/utils/kechain';

const options: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json'
  } as unknown as AxiosRequestHeaders,
  baseURL: API_BASE,
  responseType: 'json'
};

const axiosInstance = axios.create(options);

axiosInstance.interceptors.request.use(async (config: any) => {
  const token = await getTokenFromKeychain();
  Object.assign(config, {
    headers: {
      ...config.headers,
      'X-Timezone': dayjs().format('Z'),
      'X-Timezone-Name': dayjs.tz.guess(),
      Authorization: `Bearer ${token ?? ''}`
    }
  });
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (typeof response?.data === 'string') {
      response.data = JSON.parse(response.data);
    }
    response.data = {
      ...response?.data,
      success: true
    };
    return response.data;
  },
  async error => {
    if (error.code === 'ERR_NETWORK') {
      error.request.data = {
        ...(error?.request?.data || {}),
        success: false,
        isRequestError: true,
        message: error.message,
        code: HttpStatus.NETWORK_ERROR
      };
      return error.request.data;
    } else if (error.response) {
      if (typeof error?.response?.data === 'string') {
        error.response.data = JSON.parse(error.response.data);
      }
      if (error?.response?.data) {
        error.response.data = {
          ...((error?.response?.data as object) || {}),
          success: false
        };

        if (error.response.data.code == '9998') {
          await deleteTokenFromKeychain();
        }
      }

      return error.response.data as IBodyResponse<unknown>;
    } else if (error.request) {
      error.request.data = {
        ...(error?.request?.data || {}),
        success: false,
        isRequestError: true,
        message: error.message
      };
      return error.request?.data;
    }
    return {
      ...error,
      config: error?.config as AxiosRequestConfig,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      statusText: 'System error, please try again later',
      headers: error?.request?.headers || {},
      success: false,
      message: 'System error, please try again later',
      data: null,
      code: HttpStatus.INTERNAL_SERVER_ERROR
    };
  }
);

export default axiosInstance;
