import axios from 'axios';
import { baseUrl, MaterialApi } from './clientConstant';

interface FileData {
  uri: string;
  name: string;
  type: string;
}

interface CreateMaterialPayload {
  token?: string | null;
  classId?: string | null;
  title?: string | null;
  description?: string | null;
  file?: FileData | null;
  materialType?: string | null;
}

export const createMaterialApi = async (payload: CreateMaterialPayload) => {
  const formData = new FormData();

  // Add basic fields
  formData.append('token', payload.token as string);
  formData.append('classId', payload.classId as string);
  formData.append('title', payload.title as string);
  formData.append('description', payload.description as string);
  

  // Add file if present
  if (payload.file) {
    formData.append('file', payload.file as any);
    formData.append('materialType', payload.file.type.toUpperCase() as string);
  }

  console.log('formData', formData);
  try {
    const response = await axios.post(`${baseUrl}${MaterialApi.UPLOAD_MATERIAL}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating material:', error);
    return null;
  }
};

export const deleteMaterialApi = async (payload: { token: string; material_id: string }) => {
  try {
    const response = await axios.delete(`${baseUrl}${MaterialApi.DELETE_MATERIAL}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${payload.token}`
      },
      data: {
        material_id: payload.material_id
      }
    });
    console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting material:', error);
    return null;
  }
}