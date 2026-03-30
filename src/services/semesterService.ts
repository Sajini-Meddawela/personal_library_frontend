import api from './api';
import { Semester } from '../types';

export const semesterService = {
  getAll: async (): Promise<Semester[]> => {
    const response = await api.get('/semesters');
    return response.data;
  },
  
  getById: async (id: string): Promise<Semester> => {
    const response = await api.get(`/semesters/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Semester>): Promise<Semester> => {
    const response = await api.post('/semesters', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Semester>): Promise<Semester> => {
    const response = await api.put(`/semesters/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/semesters/${id}`);
  },
  
  reorder: async (semesterIds: string[]): Promise<void> => {
    await api.patch('/semesters/reorder', { semesterIds });
  },
};