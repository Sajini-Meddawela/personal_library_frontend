import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { fileService } from '../../services/fileService';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  onSuccess: () => void;
}

const categories: { value: string; label: string }[] = [
  { value: 'LECTURE_MATERIAL', label: '📚 Lecture Materials' },
  { value: 'ASSIGNMENT', label: '📝 Assignments' },
  { value: 'VIDEO', label: '🎥 Videos' },
  { value: 'REFERENCE_PAPER', label: '📄 Reference Papers' },
  { value: 'EBOOK', label: '📖 eBooks' },
  { value: 'NOTES', label: '📓 Notes' },
  { value: 'OTHER', label: '📎 Others' },
];

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, moduleId, onSuccess }) => {
  const [selectedCategory, setSelectedCategory] = useState('LECTURE_MATERIAL');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('moduleId', moduleId);
      formData.append('category', selectedCategory);
      formData.append('description', description);
      if (tags) formData.append('tags', tags);

      try {
        await fileService.upload(formData);
        successCount++;
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      } catch (error) {
        failCount++;
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} file(s) uploaded successfully`);
      onSuccess();
      // Reset form
      setSelectedFiles([]);
      setDescription('');
      setTags('');
      setUploadProgress(0);
      onClose();
    }
    if (failCount > 0) {
      toast.error(`${failCount} file(s) failed to upload`);
    }
    
    setUploading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Files" size="lg">
      <div className="space-y-5">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-3 text-gray-400" size={40} />
          {isDragActive ? (
            <p className="text-primary-600 dark:text-primary-400">Drop files here...</p>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Supports: PDF, MP4, Images, Documents (Max 100MB)
              </p>
            </>
          )}
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-white">
              Selected Files ({selectedFiles.length})
            </label>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <File size={16} className="text-gray-500" />
                    <span className="text-sm truncate dark:text-white">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            placeholder="Add a description for these files..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">Tags (Optional, comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            placeholder="e.g., exam, important, review"
          />
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload {selectedFiles.length} File(s)
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default FileUploadModal;