import { classType } from './../common/enum/commom';
 import { postMethodApi } from './api';
import { ClassApi} from './clientConstant';
import { IBodyResponse } from 'src/interfaces/common.interface';
import { baseUrl } from './clientConstant';
  export interface IClassItem {
    token: string;
    class_id: string;
    class_type: classType;
    class_name: string;
    start_date: Date | null;
    end_date: Date | null;
    max_student_amount: number;
  }
  export const createClassApi = async (data: IClassItem): Promise<IBodyResponse<any>> => {
    return postMethodApi(API_BASE+ClassApi.CREATE_CLASS, data);
  };

  export const updateClassApi = async (data: IClassItem): Promise<IBodyResponse<any>> => {
    return postMethodApi(baseUrl+ClassApi.EDIT_CLASS, data);
  }
  
  export const deleteClassApi = async (data: IClassItem): Promise<IBodyResponse<any>> => {
    return postMethodApi(baseUrl+ClassApi.DELETE_CLASS, data);
  }

  export const getClassApi = async (data: any): Promise<IBodyResponse<any>> => {
    return postMethodApi(baseUrl+ClassApi.GET_CLASS, data);
  }

  export const getClassListApi = async (data: any): Promise<IBodyResponse<any>> => {
    return postMethodApi(baseUrl+ClassApi.GET_CLASS_LIST, data);
  }