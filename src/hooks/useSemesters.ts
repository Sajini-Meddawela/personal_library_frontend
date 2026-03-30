import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { semesterService } from '../services/semesterService';
import toast from 'react-hot-toast';

export const useSemesters = () => {
  const queryClient = useQueryClient();
  
  const { data: semesters, isLoading, error } = useQuery({
    queryKey: ['semesters'],
    queryFn: semesterService.getAll,
  });
  
  const createSemester = useMutation({
    mutationFn: semesterService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
      toast.success('Semester created successfully');
    },
    onError: () => toast.error('Failed to create semester'),
  });
  
  const updateSemester = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      semesterService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
      toast.success('Semester updated successfully');
    },
    onError: () => toast.error('Failed to update semester'),
  });
  
  const deleteSemester = useMutation({
    mutationFn: semesterService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
      toast.success('Semester deleted successfully');
    },
    onError: () => toast.error('Failed to delete semester'),
  });
  
  return {
    semesters,
    isLoading,
    error,
    createSemester: createSemester.mutate,
    updateSemester: updateSemester.mutate,
    deleteSemester: deleteSemester.mutate,
  };
};