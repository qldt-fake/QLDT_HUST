import { IAbsencePayload } from './../interfaces/absence.interface';
import axiosInstance from './axiosInstance';
import { baseUrl, SurveyApi, AbsenceApi } from './clientConstant';
import { IBodyResponse } from 'src/interfaces/common.interface';
import { postMethodApi } from './api';
import {
  ISurveyPayload,
  ISubSurveyPayload,
  ISubmitSurveyPayload
} from 'src/interfaces/survey.interface';

export const requestAbsenceApi = async (payload: any) : Promise<IBodyResponse<any, any> | null>  => {
  const formData = new FormData();
  // Add basic fields
  formData.append('token', payload.token as string);
  formData.append('classId', payload.classId as string);
  formData.append('title', payload.title as string);
  formData.append('date', payload.date as string);
  formData.append('reason', payload.reason as string);
  // Add file if present
  if (payload.file) {
    formData.append('file', payload.file as any);
  }

  console.log('formData', formData, 
  );
  try {
    return await axiosInstance.post(AbsenceApi.REQUEST_ABSENCE, formData, 
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

export const getAbsenceListApi = async (payload: any) : Promise<IBodyResponse<any, any> | null>  => {
  return postMethodApi(AbsenceApi.GET_ABSENCE_REQUESTS, payload);
};

export const reviewAbsenceApi = async (payload: any) : Promise<IBodyResponse<any, any> | null>  => {
  return postMethodApi(AbsenceApi.REVIEW_ABSENCE_REQUEST, payload);
}

export const getStudentAbsenceRequestsApi = async (payload: any) : Promise<IBodyResponse<any, any> | null>  => {
  return postMethodApi(AbsenceApi.GET_STUDENT_ABSENCE_REQUESTS, payload);
}