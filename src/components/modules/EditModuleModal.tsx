import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { moduleService } from '../../services/moduleService';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import { Edit2, BookOpen } from 'lucide-react';
import { Module } from '../../types';

interface EditModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  module: Module;
}

interface FormData {
  name: string;
  code: string;
  lecturer: string;
  description: string;
  color: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

const colorOptions = [
  { value: '#3B82F6', label: 'Blue', class: 'bg-blue-500' },
  { value: '#10B981', label: 'Green', class: 'bg-green-500' },
  { value: '#F59E0B', label: 'Orange', class: 'bg-orange-500' },
  { value: '#EF4444', label: 'Red', class: 'bg-red-500' },
  { value: '#8B5CF6', label: 'Purple', class: 'bg-purple-500' },
  { value: '#EC4899', label: 'Pink', class: 'bg-pink-500' },
  { value: '#06B6D4', label: 'Cyan', class: 'bg-cyan-500' },
  { value: '#14B8A6', label: 'Teal', class: 'bg-teal-500' },
];

const EditModuleModal: React.FC<EditModuleModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  module 
}) => {
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    defaultValues: {
      name: module.name,
      code: module.code || '',
      lecturer: module.lecturer || '',
      description: module.description || '',
      color: module.color || '#3B82F6',
      status: module.status
    }
  });

  const selectedColor = watch('color');

  const handleColorSelect = (colorValue: string) => {
    setValue('color', colorValue, { shouldValidate: true });
  };

  // Reset form when module changes
  useEffect(() => {
    if (isOpen && module) {
      reset({
        name: module.name,
        code: module.code || '',
        lecturer: module.lecturer || '',
        description: module.description || '',
        color: module.color || '#3B82F6',
        status: module.status
      });
    }
  }, [module, isOpen, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await moduleService.update(module.id, data);
      toast.success('Module updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update module');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Module">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Color Preview */}
        <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className={`w-12 h-12 rounded-lg ${colorOptions.find(c => c.value === selectedColor)?.class}`} />
          <div className="flex-1">
            <p className="text-sm font-medium dark:text-white">Module Color</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">This color will appear on the module card</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">Module Name *</label>
          <input
            {...register('name', { required: 'Module name is required' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500
              focus:border-transparent"
            placeholder="e.g., Programming Fundamentals"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Module Code</label>
            <input
              {...register('code')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., CS101"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Lecturer</label>
            <input
              {...register('lecturer')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              placeholder="Professor name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            placeholder="Module description, topics covered, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">Color</label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map(color => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleColorSelect(color.value)}
                className={`w-8 h-8 rounded-full ${color.class} transition-all ${
                  selectedColor === color.value 
                    ? 'ring-2 ring-offset-2 ring-primary-600 scale-110' 
                    : 'hover:scale-105'
                }`}
                title={color.label}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">Status</label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Edit2 size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditModuleModal;