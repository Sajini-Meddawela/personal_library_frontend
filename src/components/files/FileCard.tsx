import React from 'react';
import { 
  FileText, 
  Video, 
  Image, 
  File, 
  Trash2, 
  Star, 
  Download,
  Eye,
  MoreVertical
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fileService } from '../../services/fileService';
import toast from 'react-hot-toast';
import { File as FileType } from '../../types';
import FilePreview from './FilePreview';

interface FileCardProps {
  file: FileType;
  onUpdate: () => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onUpdate }) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);

  const getFileIcon = () => {
    switch (file.type) {
      case 'PDF':
        return <FileText className="text-red-500" size={32} />;
      case 'VIDEO':
        return <Video className="text-blue-500" size={32} />;
      case 'IMAGE':
        return <Image className="text-green-500" size={32} />;
      default:
        return <File className="text-gray-500" size={32} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await fileService.delete(file.id);
        toast.success('File deleted successfully');
        onUpdate();
      } catch (error) {
        toast.error('Failed to delete file');
      }
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await fileService.updateMetadata(file.id, { isFavorite: !file.isFavorite });
      toast.success(file.isFavorite ? 'Removed from favorites' : 'Added to favorites');
      onUpdate();
    } catch (error) {
      toast.error('Failed to update favorite status');
    }
  };

  const handleDownload = () => {
    window.open(`http://localhost:5000${file.filePath}`, '_blank');
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div>
              <h4 className="font-medium dark:text-white text-sm line-clamp-1">{file.name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(file.fileSize)} • {formatDistanceToNow(new Date(file.createdAt))} ago
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10">
                <button
                  onClick={() => {
                    setShowPreview(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Eye size={14} /> Preview
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Download size={14} /> Download
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Star size={14} /> {file.isFavorite ? 'Remove Favorite' : 'Add Favorite'}
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        {file.description && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
            {file.description}
          </p>
        )}
        
        {file.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {file.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3 pt-3 border-t dark:border-gray-700">
          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
            {file.category.replace('_', ' ')}
          </span>
          {file.isFavorite && <Star size={14} className="text-yellow-500 fill-current" />}
        </div>
      </div>
      
      <FilePreview 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
        file={file} 
      />
    </>
  );
};

export default FileCard;