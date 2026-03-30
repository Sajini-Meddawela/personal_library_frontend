import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import { fileService } from '../../services/fileService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  moduleId: string;
  onUploadSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ moduleId, onUploadSuccess }) => {
  const [uploading, setUploading] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState('LECTURE_MATERIAL');

  const categories = [
    { value: 'LECTURE_MATERIAL', label: '📚 Lecture Material' },
    { value: 'VIDEO', label: '🎥 Video' },
    { value: 'ASSIGNMENT', label: '📝 Assignment' },
    { value: 'REFERENCE_PAPER', label: '📄 Reference Paper' },
    { value: 'EBOOK', label: '📖 eBook' },
    { value: 'NOTES', label: '📓 Notes' },
    { value: 'OTHER', label: '📎 Other' },
  ];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('moduleId', moduleId);
        formData.append('category', selectedCategory);
        
        await fileService.upload(formData);
      }
      
      toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
      onUploadSuccess();
    } catch (error) {
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
    }
  }, [moduleId, selectedCategory, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 dark:text-white">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        {isDragActive ? (
          <p className="text-primary-600 dark:text-primary-400">Drop files here...</p>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Supports: PDF, Videos, Images, Documents (Max 100MB)
            </p>
          </>
        )}
      </div>
      
      {uploading && (
        <div className="mt-4">
          <div className="flex items-center justify-center gap-2 text-primary-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
            <span>Uploading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;