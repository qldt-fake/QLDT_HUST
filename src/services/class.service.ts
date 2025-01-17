import { string } from 'yup';
import { classStatus, classType } from './../common/enum/commom';
import { postMethodApi } from './api';
import { ClassApi } from './clientConstant';
import { IBodyResponse } from 'src/interfaces/common.interface';
export interface IClassItem {
  token?: string;
  class_id?: string;
  role?: string;
  account_id?: string;
  class_type?: classType | string;
  class_name?: string;
  start_date?: Date | string | null;
  end_date?: Date | string | null;
  max_student_amount?: number;
  status?: classStatus | string;
}
export const createClassApi = async (data: IClassItem): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(ClassApi.CREATE_CLASS, data);
};

export const updateClassApi = async (data: IClassItem): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(ClassApi.EDIT_CLASS, data);
};

export const deleteClassApi = async (data: IClassItem): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(ClassApi.DELETE_CLASS, data);
};

export const getClassApi = async (data: any): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(ClassApi.GET_CLASS, data);
};

export const getClassListApi = async (data: any): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(ClassApi.GET_CLASS_LIST, data);
};

export const registerClassApi = async (data: any): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(ClassApi.REGISTER_CLASS, data);
};

export const getBasicClassInfoApi = async (data: any): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(ClassApi.GET_BASIC_CLASS_INFO, data);
};

export const getClassOpen = async (data: any): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(ClassApi.GET_CLASS_OPEN, data);
};
export const searchClassOpen = async (data: any): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(ClassApi.FILTER_CLASS_OPEN, data);
};

export const searchAccount = async (data: any): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(ClassApi.SEARCH_ACCOUNT, data);
};
export const addStudentToClass = async (data: any): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(ClassApi.ADD_STUDENT_TO_CLASS, data);
};
export const getUserInfor = async (data: any): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(ClassApi.GET_USER_INFOR, data);
  
};




