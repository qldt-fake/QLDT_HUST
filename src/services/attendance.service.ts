import { StatusAttendance } from 'src/common/enum/commom';
import { postMethodApi } from './api';
import { AttendanceApi, ClassApi } from './clientConstant';
import { IBodyResponse } from 'src/interfaces/common.interface';

interface IAttendanceRequest {
  token: string;
  class_id: string;
  date: string;
  attendance_list: string[];
}

interface IPageableRequest {
  token: string;
  class_id: string;
  date: string;
  pageable_request: {
    page: string;
    page_size: string;
  };
}
interface IAttendanceStatusUpdate {
  token: string;
  status: StatusAttendance;
  attendance_id: string;
}

interface IClassAttendanceRequest {
  token: string;
  class_id: string;
}

export const takeAttendanceApi = async (data: IAttendanceRequest): Promise<any> => {
  return postMethodApi(AttendanceApi.TAKE_ATTENDANCE, data);
};
export const getAttendanceListApi = async (data: IClassAttendanceRequest): Promise<any> => {
  return postMethodApi(AttendanceApi.GET_ATTENDANCE_LIST);
};
export const getAttendanceRecordApi = async (data: IPageableRequest): Promise<any> => {
  return postMethodApi(AttendanceApi.GET_ATTENDANCE_RECORD);
};
export const setAttendanceStatusApi = async (data: IAttendanceStatusUpdate): Promise<any> => {
  return postMethodApi(AttendanceApi.SET_ATTENDANCE_STATUS);
};
