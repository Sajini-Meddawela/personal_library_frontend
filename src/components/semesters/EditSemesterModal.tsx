import React from 'react';
import { useForm } from 'react-hook-form';
import { semesterService } from '../../services/semesterService';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import { FolderOpen, Trash2 } from 'lucide-react';
import { Semester } from '../../types';

interface EditSemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  semester: Semester;
}

interface FormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

const EditSemesterModal: React.FC<EditSemesterModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  semester 
}) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      name: semester.name,
      description: semester.description || '',
      startDate: semester.startDate ? semester.startDate.split('T')[0] : '',
      endDate: semester.endDate ? semester.endDate.split('T')[0] : '',
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      await semesterService.update(semester.id, data);
      toast.success('Folder updated successfully');
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update folder');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${semester.name}"? This will delete all modules and files inside.`)) {
      try {
        await semesterService.delete(semester.id);
        toast.success('Folder deleted successfully');
        onSuccess();
        onClose();
      } catch (error) {
        toast.error('Failed to delete folder');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Folder" size="md">
      {/* Folder Icon */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
          <FolderOpen size={40} className="text-primary-600" />
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Folder Name */}
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

        {/* Description */}
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

        {/* Dates */}
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

        {/* Stats Section */}
        {semester.stats && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mt-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Folder Statistics</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Modules:</span>
              <span className="font-semibold dark:text-white">{semester.stats.moduleCount}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">Files:</span>
              <span className="font-semibold dark:text-white">{semester.stats.fileCount}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 pt-4 sticky bottom-0 bg-white dark:bg-gray-800 pb-2">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 
              rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete Folder
          </button>
          <div className="flex gap-3">
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
                  <FolderOpen size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditSemesterModal;