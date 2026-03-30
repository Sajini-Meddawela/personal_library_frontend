import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit2, Trash2, BookOpen, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { semesterService } from '../../services/semesterService';
import toast from 'react-hot-toast';
import { Semester } from '../../types';

interface SemesterCardProps {
  semester: Semester;
  onUpdate: () => void;
}

const SemesterCard: React.FC<SemesterCardProps> = ({ semester, onUpdate }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      try {
        await semesterService.delete(semester.id);
        toast.success('Semester deleted successfully');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete semester');
      }
    }
  };

  const stats = semester.stats || { moduleCount: 0, fileCount: 0 };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden cursor-pointer"
      onClick={() => navigate(`/semester/${semester.id}`)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold dark:text-white mb-1">{semester.name}</h3>
            {semester.startDate && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(semester.startDate), 'MMM yyyy')}
                {semester.endDate && ` - ${format(new Date(semester.endDate), 'MMM yyyy')}`}
              </p>
            )}
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreVertical size={18} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle edit
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        {semester.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {semester.description}
          </p>
        )}
        
        <div className="flex items-center gap-4 pt-4 border-t dark:border-gray-700">
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
    </motion.div>
  );
};

export default SemesterCard;