import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, FolderOpen, BookOpen, FileText, Calendar, Plus } from 'lucide-react';
import { semesterService } from '../services/semesterService';
import ModuleCard from '../components/modules/ModuleCard';
import CreateModuleModal from '../components/modules/CreateModuleModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { format } from 'date-fns';

const SemesterDetailPage: React.FC = () => {
  const { semesterId } = useParams<{ semesterId: string }>();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const { data: semester, isLoading, error, refetch } = useQuery({
    queryKey: ['semester', semesterId],
    queryFn: () => semesterService.getById(semesterId!),
    enabled: !!semesterId,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error || !semester) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading semester</p>
        <button
          onClick={() => navigate('/semesters')}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Back to Library
        </button>
      </div>
    );
  }

  const modules = semester.modules || [];
  const stats = semester.stats || { moduleCount: 0, fileCount: 0 };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/semesters')}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 
          dark:hover:text-primary-400 transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        <span>Back to Library</span>
      </button>

      {/* Folder Header - Like opening a folder in file explorer */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 
        rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <FolderOpen size={48} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold dark:text-white">{semester.name}</h1>
              {semester.description && (
                <p className="text-gray-600 dark:text-gray-300 mt-1">{semester.description}</p>
              )}
              <div className="flex items-center gap-4 mt-3">
                {semester.startDate && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    <span>
                      {format(new Date(semester.startDate), 'MMM dd, yyyy')}
                      {semester.endDate && ` - ${format(new Date(semester.endDate), 'MMM dd, yyyy')}`}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <BookOpen size={14} />
                  <span>{stats.moduleCount} Modules</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <FileText size={14} />
                  <span>{stats.fileCount} Files</span>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg 
              hover:bg-primary-700 transition-all hover:shadow-md"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Module</span>
          </button>
        </div>
      </div>

      {/* Modules Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold dark:text-white">Modules in this folder</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {modules.length} {modules.length === 1 ? 'module' : 'modules'}
          </p>
        </div>

        {modules.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 mb-4 text-gray-400">
                <BookOpen size={64} strokeWidth={1} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-2">No modules yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                Create your first module to start organizing materials
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg 
                  hover:bg-primary-700 transition-colors"
              >
                <Plus size={18} />
                Create Module
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => (
              <ModuleCard 
                key={module.id} 
                module={module} 
                onUpdate={refetch}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Module Modal */}
      <CreateModuleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          refetch();
          setIsCreateModalOpen(false);
        }}
        semesterId={semesterId!}
      />
    </div>
  );
};

export default SemesterDetailPage;