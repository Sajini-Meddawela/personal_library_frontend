import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, User, Tag } from 'lucide-react';
import { moduleService } from '../services/moduleService';
import FileManager from '../components/files/FileManager';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Breadcrumb from '../components/layout/Breadcrumb';

const ModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  
  const { data: module, isLoading } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => moduleService.getById(moduleId!),
    enabled: !!moduleId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!module) return <div>Module not found</div>;

  return (
    <div>
      <Breadcrumb />
      <button
        onClick={() => navigate('/semesters')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 mb-4"
      >
        <ArrowLeft size={20} /> Back to Semesters
      </button>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold dark:text-white mb-2">{module.name}</h1>
            {module.code && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                <Tag size={16} />
                <span>{module.code}</span>
              </div>
            )}
            {module.lecturer && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <User size={16} />
                <span>Lecturer: {module.lecturer}</span>
              </div>
            )}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm ${
            module.status === 'COMPLETED' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
          }`}>
            {module.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
          </div>
        </div>
        
        {module.description && (
          <p className="text-gray-600 dark:text-gray-300">{module.description}</p>
        )}
      </div>
      
      <FileManager />
    </div>
  );
};

export default ModuleDetailPage;