import api from './api';
import { Module } from '../types';

export const moduleService = {
  getBySemester: async (semesterId: string): Promise<Module[]> => {
    const response = await api.get(`/modules/semester/${semesterId}`);
    return response.data;
  },
  
  getById: async (id: string): Promise<Module> => {
    const response = await api.get(`/modules/${id}`);
    return response.data;
  },
  
  create: async (semesterId: string, data: Partial<Module>): Promise<Module> => {
    const response = await api.post(`/modules/semester/${semesterId}`, data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Module>): Promise<Module> => {
    const response = await api.put(`/modules/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    const response = await api.delete(`/modules/${id}`);
    return response.data;
  },
};