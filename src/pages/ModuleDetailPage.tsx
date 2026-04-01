import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, User, Tag, FolderOpen } from 'lucide-react';
import { moduleService } from '../services/moduleService';
import CategoryFileManager from '../components/files/CategoryFileManager';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Breadcrumb from '../components/layout/Breadcrumb';

const ModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  
  const { data: module, isLoading, refetch } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => moduleService.getById(moduleId!),
    enabled: !!moduleId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!module) return <div>Module not found</div>;

  return (
    <div className="space-y-6">
      <Breadcrumb />
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/semesters')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-4"
      >
        <ArrowLeft size={20} /> Back to Semesters
      </button>
      
      {/* Module Header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <BookOpen size={48} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold dark:text-white">{module.name}</h1>
              {module.code && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1">
                  <Tag size={16} />
                  <span>{module.code}</span>
                </div>
              )}
              {module.lecturer && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1">
                  <User size={16} />
                  <span>Lecturer: {module.lecturer}</span>
                </div>
              )}
              {module.description && (
                <p className="text-gray-600 dark:text-gray-300 mt-3">{module.description}</p>
              )}
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${
            module.status === 'COMPLETED' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
          }`}>
            {module.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
          </div>
        </div>
      </div>
      
      {/* Category-based File Manager */}
      <CategoryFileManager moduleId={moduleId!} onUpdate={refetch} />
    </div>
  );
};

export default ModuleDetailPage;