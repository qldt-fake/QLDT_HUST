import { API_BASE } from "@env";
import axios from "axios";
const BASE_URL = API_BASE || 'http://157.66.24.126:8080'
export const sendFileAPI = async (payload: Record<string, any>, url: string) => {
    const formData = new FormData();
    for (const key in payload) {
      if (payload[key] !== undefined && payload[key] !== null) {
        if (key === 'file' && payload[key] instanceof File) {
          formData.append(key, payload[key]);
        } else {
          formData.append(key, payload[key]);
        }
      }
    }
    try {
      const response = await axios.post(`${BASE_URL}/${url}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error at', error);
      return null;
    }
  };