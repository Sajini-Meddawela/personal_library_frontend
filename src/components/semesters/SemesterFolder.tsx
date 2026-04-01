import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreVertical, 
  Edit2, 
  Trash2, 
  FolderOpen, 
  Folder,
  FileText,
  BookOpen,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { semesterService } from '../../services/semesterService';
import toast from 'react-hot-toast';
import { Semester } from '../../types';
import EditSemesterModal from './EditSemesterModal';

interface SemesterFolderProps {
  semester: Semester;
  onUpdate: () => void;
  viewMode: 'grid' | 'list';
}

const SemesterFolder: React.FC<SemesterFolderProps> = ({ semester, onUpdate, viewMode }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${semester.name}" folder? This will delete all modules and files inside.`)) {
      try {
        await semesterService.delete(semester.id);
        toast.success('Folder deleted successfully');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete folder');
      }
    }
  };

  const stats = semester.stats || { moduleCount: 0, fileCount: 0 };

  // List View
  if (viewMode === 'list') {
    return (
      <>
        <motion.div
          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
          className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg 
            border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 
            cursor-pointer transition-all"
          onClick={() => navigate(`/semester/${semester.id}`)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="text-primary-500">
              {React.createElement(isHovered ? FolderOpen : Folder, { size: 32, className: "transition-all" })}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold dark:text-white group-hover:text-primary-600 transition-colors">
                {semester.name}
              </h3>
              {semester.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                  {semester.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <BookOpen size={14} />
                <span>{stats.moduleCount} modules</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText size={14} />
                <span>{stats.fileCount} files</span>
              </div>
              {semester.startDate && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{format(new Date(semester.startDate), 'MMM yyyy')}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MoreVertical size={18} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditModalOpen(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit2 size={16} /> Edit Folder
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Trash2 size={16} /> Delete Folder
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <EditSemesterModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={onUpdate}
          semester={semester}
        />
      </>
    );
  }

  // Grid View - Folder Card Style
  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="relative group cursor-pointer"
        onClick={() => navigate(`/semester/${semester.id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Folder Header - Like a folder tab */}
          <div className="relative h-32 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20">
            <div className="absolute top-0 left-6 w-16 h-8 bg-primary-200 dark:bg-primary-800 rounded-t-lg transform -translate-y-1/2"></div>
            <div className="absolute top-4 left-8">
              {React.createElement(isHovered ? FolderOpen : Folder, { 
                size: 48, 
                className: "text-primary-600 dark:text-primary-400 drop-shadow-sm transition-all duration-300" 
              })}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 
                hover:bg-white dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical size={16} />
            </button>
          </div>
          
          {/* Folder Content */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1">
                  {semester.name}
                </h3>
                {semester.startDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {format(new Date(semester.startDate), 'MMM yyyy')}
                    {semester.endDate && ` - ${format(new Date(semester.endDate), 'MMM yyyy')}`}
                  </p>
                )}
              </div>
            </div>
            
            {semester.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                {semester.description}
              </p>
            )}
            
            {/* Folder Stats */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <BookOpen size={12} />
                  <span>{stats.moduleCount}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <FileText size={12} />
                  <span>{stats.fileCount}</span>
                </div>
              </div>
              <div className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1">
                Open <ChevronRight size={12} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Context Menu */}
        {showMenu && (
          <div className="absolute top-24 right-4 z-20" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 w-48">
              <button
                onClick={() => {
                  setIsEditModalOpen(true);
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit2 size={14} /> Edit Folder
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Trash2 size={14} /> Delete Folder
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <EditSemesterModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={onUpdate}
        semester={semester}
      />
    </>
  );
};

export default SemesterFolder;