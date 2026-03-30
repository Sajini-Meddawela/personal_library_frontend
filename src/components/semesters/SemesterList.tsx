import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderPlus, LayoutGrid, LayoutList } from 'lucide-react';
import { semesterService } from '../../services/semesterService';
import SemesterFolder from './SemesterFolder';
import CreateSemesterModal from './CreateSemesterModal';
import LoadingSpinner from '../common/LoadingSpinner';

const SemesterList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const { data: semesters, isLoading, error, refetch } = useQuery({
    queryKey: ['semesters'],
    queryFn: semesterService.getAll,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading semesters</div>;

  return (
    <div className="space-y-6">
      {/* Header with Library-like Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">My Academic Library</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {semesters?.length || 0} {semesters?.length === 1 ? 'folder' : 'folders'} • 
            {semesters?.reduce((acc, sem) => acc + (sem.stats?.moduleCount || 0), 0)} modules
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }`}
            >
              <LayoutList size={18} />
            </button>
          </div>
          
          {/* New Folder Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg 
              hover:bg-primary-700 transition-all hover:shadow-md"
          >
            <FolderPlus size={18} />
            <span className="hidden sm:inline">New Folder</span>
          </button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-lg">
        <span className="text-gray-900 dark:text-white font-medium">My Library</span>
        <span>/</span>
        <span className="text-primary-600">All Semesters</span>
      </div>

      {/* Folder Grid/List View */}
      <AnimatePresence>
        {semesters?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 mb-4 text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  <path d="M2 10h20" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-2">Your library is empty</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Create your first semester folder to start organizing</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus size={18} /> Create New Semester
              </button>
            </div>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            : "space-y-2"
          }>
            {semesters?.map((semester, index) => (
              <motion.div
                key={semester.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <SemesterFolder 
                  semester={semester} 
                  onUpdate={refetch}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <CreateSemesterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
};

export default SemesterList;