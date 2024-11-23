import { IBodyResponse } from 'src/interfaces/common.interface';
import axios from 'axios';
import { baseUrl, MaterialApi } from './clientConstant';
import { postMethodApi } from './api';

import { IMaterialPayload, ISubMaterialPayload } from 'src/interfaces/material.interface';

export const createMaterialApi = async (
  payload: IMaterialPayload
): Promise<IBodyResponse<any, any> | null> => {
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

export const editMaterialApi = async (
  payload: IMaterialPayload
): Promise<IBodyResponse<any, any> | null> => {
  const formData = new FormData();

  // Add basic fields
  formData.append('token', payload.token as string);
  formData.append('classId', payload.classId as string);
  formData.append('title', payload.title as string);
  formData.append('description', payload.description as string);
  formData.append('materialId', payload.materialId as string);

  // Add file if present
  if (payload.file) {
    formData.append('file', payload.file as any);
    formData.append('materialType', payload.file.type.toUpperCase() as string);
  }

  console.log('formData', formData);
  try {
    const response = await axios.post(`${baseUrl}${MaterialApi.EDIT_MATERIAL}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.error('Error update material:', error);
    return null;
  }
};

export const deleteMaterialApi = async (
  payload: ISubMaterialPayload
): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(MaterialApi.DELETE_MATERIAL, payload);
};

export const getMaterialListApi = async (
  payload: ISubMaterialPayload
): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(MaterialApi.GET_MATERIAL_LIST, payload);
};

export const getMaterialInfoApi = async (
  payload: ISubMaterialPayload
): Promise<IBodyResponse<any, any>> => {
  return postMethodApi(MaterialApi.GET_MATERIAL_INFO, payload);
};
