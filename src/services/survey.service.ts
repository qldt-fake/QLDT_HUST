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
    formData.append('file', {
      uri: payload.file.uri,
      name: payload.file.name,
      type: payload.file.type
    });
  }

  const response = await axios.post(`${baseUrl}/survey/create`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

export const getSurveyListApi = async (data: any): Promise<IBodyResponse<any>> => {
  return postMethodApi(baseUrl+SurveyApi.GET_ALL_SURVEYS, data);
}
