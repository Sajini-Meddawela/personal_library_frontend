import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Video, 
  FileText, 
  GraduationCap, 
  FolderOpen,
  Plus,
  X
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fileService } from '../../services/fileService';
import CategoryCard from './CategoryCard';
import FileUploadModal from './FileUploadModal';
import FileViewer from './FileViewer';
import LoadingSpinner from '../common/LoadingSpinner';
import { File } from '../../types';

interface CategoryFileManagerProps {
  moduleId: string;
  onUpdate: () => void;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  fileCategory: string;
  description: string;
}

const categories: Category[] = [
  {
    id: 'lecture-materials',
    name: 'Lecture Materials',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    fileCategory: 'LECTURE_MATERIAL',
    description: 'Slides, notes, and lecture handouts'
  },
  {
    id: 'assignments',
    name: 'Assignments',
    icon: FileText,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    fileCategory: 'ASSIGNMENT',
    description: 'Homework, projects, and lab reports'
  },
  {
    id: 'videos',
    name: 'Videos',
    icon: Video,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    fileCategory: 'VIDEO',
    description: 'Recorded lectures and tutorials'
  },
  {
    id: 'reference-papers',
    name: 'Reference Papers',
    icon: GraduationCap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    fileCategory: 'REFERENCE_PAPER',
    description: 'Research papers and articles'
  },
  {
    id: 'ebooks',
    name: 'eBooks',
    icon: BookOpen,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    fileCategory: 'EBOOK',
    description: 'Textbooks and digital books'
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: FileText,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    fileCategory: 'NOTES',
    description: 'Personal notes and summaries'
  },
  {
    id: 'others',
    name: 'Others',
    icon: FolderOpen,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    fileCategory: 'OTHER',
    description: 'Miscellaneous materials'
  }
];

const CategoryFileManager: React.FC<CategoryFileManagerProps> = ({ moduleId, onUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['files', moduleId],
    queryFn: () => fileService.getByModule(moduleId),
    enabled: !!moduleId,
  });

  // Group files by category
  const filesByCategory = React.useMemo(() => {
    if (!files) return {};
    
    const grouped: Record<string, File[]> = {};
    categories.forEach(cat => {
      grouped[cat.fileCategory] = files.filter(file => file.category === cat.fileCategory);
    });
    return grouped;
  }, [files]);

  const handleUploadSuccess = () => {
    refetch();
    onUpdate();
    setIsUploadModalOpen(false);
  };

  const handleFileClick = (file: File) => {
    setSelectedFile(file);
    setIsViewerOpen(true);
  };

  const getFilesForCategory = (category: Category): File[] => {
    return filesByCategory[category.fileCategory] || [];
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {categories.map((category) => {
          const categoryFiles = getFilesForCategory(category);
          return (
            <CategoryCard
              key={category.id}
              category={category}
              fileCount={categoryFiles.length}
              onClick={() => setSelectedCategory(category)}
            />
          );
        })}
      </div>

      {/* Selected Category View */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Category Header */}
              <div className={`${selectedCategory.bgColor} p-6 border-b dark:border-gray-700`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <selectedCategory.icon size={32} className={selectedCategory.color} />
                    <div>
                      <h2 className="text-2xl font-bold dark:text-white">{selectedCategory.name}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {selectedCategory.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setIsUploadModalOpen(true);
                        setSelectedCategory(null);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <Plus size={18} />
                      Upload
                    </button>
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Files List */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                {getFilesForCategory(selectedCategory).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 text-gray-400">
                      <selectedCategory.icon size={64} strokeWidth={1} />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">
                      No {selectedCategory.name.toLowerCase()} uploaded yet
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
                      Upload your first {selectedCategory.name.toLowerCase()} to get started
                    </p>
                    <button
                      onClick={() => {
                        setIsUploadModalOpen(true);
                        setSelectedCategory(null);
                      }}
                      className="flex items-center gap-2 mx-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <Plus size={18} />
                      Upload {selectedCategory.name}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getFilesForCategory(selectedCategory).map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleFileClick(file)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${selectedCategory.bgColor}`}>
                            <selectedCategory.icon size={20} className={selectedCategory.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium dark:text-white truncate">{file.name}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatFileSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString()}
                            </p>
                            {file.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                                {file.description}
                              </p>
                            )}
                            {file.tags && file.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {file.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded-full">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        moduleId={moduleId}
        onSuccess={handleUploadSuccess}
      />

      {/* File Viewer Modal */}
      {selectedFile && (
        <FileViewer
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedFile(null);
          }}
          file={selectedFile}
          onDelete={() => {
            refetch();
            setIsViewerOpen(false);
            setSelectedFile(null);
          }}
        />
      )}
    </div>
  );
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default CategoryFileManager;