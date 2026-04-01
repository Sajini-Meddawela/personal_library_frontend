import api from './api';
import { File } from '../types';

export const fileService = {
  getByModule: async (moduleId: string): Promise<File[]> => {
    const response = await api.get(`/files/module/${moduleId}`);
    return response.data;
  },
  
  upload: async (formData: FormData): Promise<File> => {
    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/files/${id}`);
  },
  
  updateMetadata: async (id: string, data: Partial<File>): Promise<File> => {
    const response = await api.put(`/files/${id}/metadata`, data);
    return response.data;
  },
  
  search: async (params: { q?: string; type?: string; category?: string; moduleId?: string }): Promise<File[]> => {
    const response = await api.get('/files/search', { params });
    return response.data;
  },
  
  getFavorites: async (): Promise<File[]> => {
    const response = await api.get('/files/favorites');
    return response.data;
  },
};