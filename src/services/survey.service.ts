import axiosInstance from './axiosInstance';
import { baseUrl, SurveyApi } from './clientConstant';
import { IBodyResponse } from 'src/interfaces/common.interface';
import { postMethodApi } from './api';
import {
  ISurveyPayload,
  ISubSurveyPayload,
  ISubmitServeyPayload
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
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  try {
    const response = await axiosInstance.post(SurveyApi.CREATE_SURVEY, formData);
    console.log("Response", response);
    return response;
  } catch (error) {
    console.error('Error:', error);
    return error;
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
    const response = await axiosInstance.post('/edit_survey', formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    console.log("Response", response);
    return response;
  } catch (error) {
    console.error('Error:', error);
    return error;
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
  payload: ISubmitServeyPayload
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
    const response = await axiosInstance.post(SurveyApi.SUBMIT_SURVEY , formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log("Response", response);
    return response;
  } catch (error) {
    console.error('Error:', error);
    return error;
  }
};
