import axios from 'axios';
import { baseUrl, SurveyApi } from './clientConstant';
import { IBodyResponse } from 'src/interfaces/common.interface';
import { postMethodApi } from './api';

interface FileData {
  uri: string;
  name: string;
  type: string;
}

interface CreateSurveyPayload {
  token: string;
  classId: string;
  title: string;
  deadline: string;
  file?: FileData;
  description?: string;
}

export const createSurveyApi = async (payload: CreateSurveyPayload) => {
  const formData = new FormData();

  // Add basic fields
  formData.append('token', payload.token);
  formData.append('classId', payload.classId);
  formData.append('title', payload.title);
  formData.append('deadline', payload.deadline);
  formData.append('description', payload.description || '');

  // Add file if present
  if (payload.file) {
    formData.append('file', payload.file);
  }

  console.log('formData', formData);
  try {
    const response = await axios.post(`${baseUrl}/create_survey`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('response', response.data);
    return response.data;
  }
  catch (error) {
    console.error("Loi tai", error);
    return null;
  }

};

const editSurveyApi = async (payload: CreateSurveyPayload) => {
  const formData = new FormData();

  // Add basic fields
  formData.append('token', payload.token);
  formData.append('classId', payload.classId);
  formData.append('title', payload.title);
  formData.append('deadline', payload.deadline);
  formData.append('description', payload.description || '');

  // Add file if present
  if (payload.file) {
    formData.append('file', payload.file);
  }

  console.log('formData', formData);
  try {
    const response = await axios.post(`${baseUrl}/edit_survey`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('response', response.data);
    return response.data;
  }
  catch (error) {
    console.error("Loi tai", error);
    return null;
  }

}


export const getSurveyListApi = async (data: any): Promise<IBodyResponse<any,any>> => {
  return postMethodApi(SurveyApi.GET_ALL_SURVEYS, data);
}

export const deleteSurveyApi = async (data: any): Promise<IBodyResponse<any,any>> => {
  return postMethodApi(SurveyApi.DELETE_SURVEY, data);
}
