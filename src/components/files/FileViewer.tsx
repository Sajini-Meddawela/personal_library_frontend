import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Trash2, 
  Star, 
  FileText, 
  Video, 
  Image,
  File as FileIcon,
  ExternalLink
} from 'lucide-react';
import { fileService } from '../../services/fileService';
import toast from 'react-hot-toast';
import { File } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface FileViewerProps {
  isOpen: boolean;
  onClose: () => void;
  file: File;
  onDelete: () => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ isOpen, onClose, file, onDelete }) => {
  const [isFavorite, setIsFavorite] = useState(file.isFavorite);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Build the correct preview URL (inline display, no automatic download)
  const getPreviewUrl = () => {
    const baseUrl = file.cloudinaryUrl || file.optimizedUrl;
    if (!baseUrl) return null;

    // For raw files (DOC, DOCX, etc.) add fl_attachment=0 to force inline preview
    if (file.type === 'DOCUMENT') {
      const separator = baseUrl.includes('?') ? '&' : '?';
      return `${baseUrl}${separator}fl_attachment=0`;
    }

    // For images and videos, just return the URL (they display inline automatically)
    return baseUrl;
  };

  // Build download URL (forces download)
  const getDownloadUrl = () => {
    const baseUrl = file.cloudinaryUrl;
    if (!baseUrl) return null;

    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}fl_attachment=1`;
  };

  const handleToggleFavorite = async () => {
    try {
      await fileService.updateMetadata(file.id, { isFavorite: !isFavorite });
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      toast.error('Failed to update favorite status');
    }
  };

  const handleDelete = async () => {
    try {
      await fileService.delete(file.id);
      toast.success('File deleted successfully');
      onDelete();
      onClose();
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const handleDownload = () => {
    const downloadUrl = getDownloadUrl();
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    } else {
      toast.error('Download URL not available');
    }
  };

  const renderPreview = () => {
    const fileUrl = getPreviewUrl();

    if (!fileUrl) {
      return (
        <div className="text-center py-12">
          <FileIcon size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            File URL not available
          </p>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Download size={16} /> Try to Download
          </button>
        </div>
      );
    }

    // PDF Preview – Use Google Docs Viewer for reliable inline display
    if (file.type === 'PDF') {
      const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      return (
        <div className="w-full h-[60vh]">
          <iframe
            src={googleDocsUrl}
            className="w-full h-full rounded-lg"
            title={file.name}
            onError={() => setLoadError(true)}
          />
          {loadError && (
            <div className="text-center mt-4">
              <p className="text-red-500 mb-2">Failed to load PDF preview</p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Download size={16} /> Download PDF
              </button>
            </div>
          )}
        </div>
      );
    }

    // Video Preview
    if (file.type === 'VIDEO') {
      return (
        <video
          controls
          className="w-full rounded-lg max-h-[60vh]"
          autoPlay={false}
          onError={() => setLoadError(true)}
        >
          <source src={fileUrl} type={file.mimeType} />
          Your browser does not support the video tag.
        </video>
      );
    }

    // Image Preview
    if (file.type === 'IMAGE') {
      return (
        <img
          src={fileUrl}
          alt={file.name}
          className="max-w-full max-h-[60vh] rounded-lg mx-auto object-contain"
          onError={() => setLoadError(true)}
        />
      );
    }

    // Document Preview (Word, PowerPoint, Excel) – use Google Docs Viewer
    if (file.type === 'DOCUMENT') {
      const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      return (
        <div className="w-full h-[60vh]">
          <iframe
            src={googleDocsUrl}
            className="w-full h-full rounded-lg"
            title={file.name}
            onError={() => setLoadError(true)}
          />
          {loadError && (
            <div className="text-center mt-4">
              <p className="text-red-500 mb-2">Failed to load document preview</p>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Download size={16} /> Download Document
              </button>
            </div>
          )}
        </div>
      );
    }

    // Fallback for other file types
    return (
      <div className="text-center py-12">
        <FileIcon size={64} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          Preview not available for this file type
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
          File type: {file.type} • {file.mimeType}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Download size={16} /> Download File
          </button>
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ExternalLink size={16} /> Open in New Tab
            </a>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {!showDeleteConfirm ? (
        <motion.div
          key="viewer"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                  {file.type === 'PDF' && <FileText className="text-red-500" size={24} />}
                  {file.type === 'VIDEO' && <Video className="text-blue-500" size={24} />}
                  {file.type === 'IMAGE' && <Image className="text-green-500" size={24} />}
                  {file.type === 'DOCUMENT' && <FileText className="text-orange-500" size={24} />}
                  {(file.type === 'OTHER' || !file.type) && <FileIcon className="text-gray-500" size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold dark:text-white truncate">{file.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {file.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star size={18} className={isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'} />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Download file"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 transition-colors"
                  title="Delete file"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900/50">
              {renderPreview()}
            </div>

            {/* Footer - File Info */}
            {(file.description || (file.tags && file.tags.length > 0)) && (
              <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                {file.description && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Description
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{file.description}</p>
                  </div>
                )}
                {file.tags && file.tags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {file.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="delete-confirm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold dark:text-white">Delete File</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Are you sure you want to delete "<span className="font-medium">{file.name}</span>"?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This action cannot be undone. The file will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default FileViewer;