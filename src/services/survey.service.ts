import axiosInstance from './axiosInstance';
import { baseUrl, SurveyApi } from './clientConstant';
import { IBodyResponse } from 'src/interfaces/common.interface';
import { postMethodApi } from './api';
import {
  ISurveyPayload,
  ISubSurveyPayload,
  ISubmitSurveyPayload
} from 'src/interfaces/survey.interface';

export const createSurveyApi = async (payload: ISurveyPayload) : Promise<IBodyResponse<any, any> | null>  => {
  const formData = new FormData();

  // Add basic fields
  formData.append('token', payload.token as string);
  formData.append('classId', payload.classId as string);
  formData.append('title', payload.title as string);
  formData.append('deadline', payload.deadline as string);
  formData.append('description', payload.description as string);

  // Add file if present
  if (payload.file) {
    formData.append('file', payload.file as any);
  }

  console.log('formData', formData, 
   
  );
  try {
    return await axiosInstance.post(SurveyApi.CREATE_SURVEY, formData, 
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

const editSurveyApi = async (payload: ISurveyPayload) : Promise<IBodyResponse<any, any> | null> => {
  const formData = new FormData();

  // Add basic fields
  formData.append('token', payload.token as string);
  formData.append('classId', payload.classId as string);
  formData.append('title', payload.title as string);
  formData.append('deadline', payload.deadline as string);
  formData.append('description', payload.description as string);

  // Add file if present
  if (payload.file) {
    formData.append('file', payload.file);
  }

  console.log('formData', formData);
  try {
    return await axiosInstance.post('/edit_survey', formData, 
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

export const getSurveyListApi = async (
  data: ISubSurveyPayload
): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(SurveyApi.GET_ALL_SURVEYS, data);
};

export const deleteSurveyApi = async (
  data: ISubSurveyPayload
): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(SurveyApi.DELETE_SURVEY, data);
};

export const getSubmissionApi = async (
  data: ISubSurveyPayload
): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(SurveyApi.GET_SUBMISSION, data);
};

export const submitSurveyApi = async (
  payload: ISubmitSurveyPayload
): Promise<IBodyResponse<any, any> | null> => {
  const formData = new FormData();
  formData.append('token', payload.token as string);
  formData.append('assignmentId', payload.assignmentId as string);
  formData.append('textResponse', payload.textResponse as string);

  if (payload.file) {
    formData.append('file', payload.file);
  }

  console.log('formData', formData);

  try {
    return await axiosInstance.post(SurveyApi.SUBMIT_SURVEY , formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const getSurveyStudentAssignmentsApi = async (
  data: ISubSurveyPayload
): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(SurveyApi.GET_STUDENT_ASSIGNMENTS, data);
}
