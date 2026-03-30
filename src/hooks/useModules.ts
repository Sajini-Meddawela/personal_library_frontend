import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moduleService } from '../services/moduleService';
import toast from 'react-hot-toast';

export const useModules = (semesterId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: modules, isLoading, error } = useQuery({
    queryKey: ['modules', semesterId],
    queryFn: () => moduleService.getBySemester(semesterId!),
    enabled: !!semesterId,
  });
  
  const createModule = useMutation({
    mutationFn: ({ semesterId, data }: { semesterId: string; data: any }) =>
      moduleService.create(semesterId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', semesterId] });
      toast.success('Module created successfully');
    },
    onError: () => toast.error('Failed to create module'),
  });
  
  const updateModule = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      moduleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      toast.success('Module updated successfully');
    },
    onError: () => toast.error('Failed to update module'),
  });
  
  const deleteModule = useMutation({
    mutationFn: moduleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modules', semesterId] });
      toast.success('Module deleted successfully');
    },
    onError: () => toast.error('Failed to delete module'),
  });
  
  return {
    modules,
    isLoading,
    error,
    createModule: createModule.mutate,
    updateModule: updateModule.mutate,
    deleteModule: deleteModule.mutate,
  };
};