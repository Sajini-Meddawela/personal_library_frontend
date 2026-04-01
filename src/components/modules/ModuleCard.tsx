import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Edit2, Trash2, FileText, CheckCircle, Clock, BookOpen, User, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { moduleService } from '../../services/moduleService';
import toast from 'react-hot-toast';
import { Module } from '../../types';
import EditModuleModal from './EditModuleModal';

interface ModuleCardProps {
  module: Module;
  onUpdate: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onUpdate }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${module.name}"? This will delete all files inside.`)) {
      try {
        await moduleService.delete(module.id);
        toast.success('Module deleted successfully');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete module');
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setIsEditModalOpen(true);
  };

  const fileCount = module.files?.length || 0;

  return (
    <>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="relative cursor-pointer group"
        onClick={() => navigate(`/module/${module.id}`)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Colored top bar */}
          <div className="h-2" style={{ background: module.color }} />
          
          <div className="p-5">
            {/* Header with icon and menu */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  isHovered ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {isHovered ? (
                    <FolderOpen size={24} className="text-primary-600 dark:text-primary-400" />
                  ) : (
                    <BookOpen size={24} className="text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1">
                    {module.name}
                  </h3>
                  {module.code && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{module.code}</p>
                  )}
                </div>
              </div>
              
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10">
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Edit2 size={14} /> Edit Module
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Trash2 size={14} /> Delete Module
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Lecturer info */}
            {module.lecturer && (
              <div className="flex items-center gap-1 mb-3 text-sm text-gray-600 dark:text-gray-300">
                <User size={14} />
                <span className="line-clamp-1">{module.lecturer}</span>
              </div>
            )}
            
            {/* Description */}
            {module.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {module.description}
              </p>
            )}
            
            {/* Footer stats */}
            <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <FileText size={12} />
                <span>{fileCount} {fileCount === 1 ? 'file' : 'files'}</span>
              </div>
              <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                module.status === 'COMPLETED' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}>
                {module.status === 'COMPLETED' ? <CheckCircle size={12} /> : <Clock size={12} />}
                <span>{module.status === 'COMPLETED' ? 'Completed' : 'In Progress'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hover effect overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-primary-600/5 rounded-xl pointer-events-none" />
        )}
      </motion.div>

      {/* Edit Module Modal */}
      <EditModuleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={onUpdate}
        module={module}
      />
    </>
  );
};

export default ModuleCard;