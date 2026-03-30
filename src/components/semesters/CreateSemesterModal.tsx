import React from 'react';
import { useForm } from 'react-hook-form';
import { semesterService } from '../../services/semesterService';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import { FolderPlus } from 'lucide-react';

interface CreateSemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

const CreateSemesterModal: React.FC<CreateSemesterModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      await semesterService.create(data);
      toast.success('New folder created successfully');
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to create folder');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Folder" size="md">
      {/* Optional: Add responsive styling for small screens */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
          <FolderPlus size={40} className="text-primary-600" />
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">Folder Name *</label>
          <input
            {...register('name', { required: 'Folder name is required' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500
              focus:border-transparent"
            placeholder="e.g., Semester 1 - 2024"
            autoFocus
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-white">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500
              focus:border-transparent"
            placeholder="Add a description for this folder..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Start Date</label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">End Date</label>
            <input
              type="date"
              {...register('endDate')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white dark:bg-gray-800 pb-2">
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
                Creating...
              </>
            ) : (
              <>
                <FolderPlus size={16} />
                Create Folder
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSemesterModal;