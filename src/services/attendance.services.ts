import { postMethodApi } from './api';
import { AttendanceApi } from './clientConstant';
import { StatusAttendance } from 'src/common/enum/commom';
// 1. Interface cho dữ liệu gửi khi điểm danh lớp
export interface IAttendanceRequest {
    token: string;
    class_id: string;
    date: string;
    attendance_list: string[];
  }

  export interface IPageableRequest {
    token: string;
    class_id: string;
    date: string;
    pageable_request: {
      page: string;
      page_size: string;
    };
  }
  
  // 4. Interface cho trạng thái điểm danh của một sinh viên
  export interface IAttendanceStatusUpdate {
    token: string;
    status: StatusAttendance;
    attendance_id: string;
  }
  
  export interface IClassAttendanceRequest {
    token: string;
    class_id: string;
  }

  export const takeAttendanceApi = async (): Promise<any> => {
    return postMethodApi(AttendanceApi.TAKE_ATTENDANCE);
  };
  export const getAttendanceListApi = async (): Promise<any> => {
    return postMethodApi(AttendanceApi.GET_ATTENDANCE_LIST);
};
  export const getAttendanceRecordApi = async (): Promise<any> => {
    return postMethodApi(AttendanceApi.GET_ATTENDANCE_RECORD);
  };
  export const setAttendanceStatusApi = async (): Promise<any> => {
    return postMethodApi(AttendanceApi.SET_ATTENDANCE_STATUS);
  };
  