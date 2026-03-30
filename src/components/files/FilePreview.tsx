import React from 'react';
import Modal from '../common/Modal';
import { File } from '../../types';
import { FileText, Video, Image, File as FileIcon, Download } from 'lucide-react';

interface FilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  file: File;
}

const FilePreview: React.FC<FilePreviewProps> = ({ isOpen, onClose, file }) => {
  const fileUrl = `http://localhost:5000${file.filePath}`;

  const renderPreview = () => {
    if (file.type === 'PDF') {
      return (
        <iframe
          src={`${fileUrl}#toolbar=0`}
          className="w-full h-[70vh] rounded-lg"
          title={file.name}
        />
      );
    }
    
    if (file.type === 'VIDEO') {
      return (
        <video controls className="w-full rounded-lg" autoPlay={false}>
          <source src={fileUrl} type={file.mimeType} />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    if (file.type === 'IMAGE') {
      return (
        <img src={fileUrl} alt={file.name} className="max-w-full max-h-[70vh] rounded-lg mx-auto" />
      );
    }
    
    return (
      <div className="text-center py-12">
        <FileIcon size={64} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Preview not available for this file type
        </p>
        <a
          href={fileUrl}
          download
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Download size={16} /> Download File
        </a>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={file.name} size="xl">
      {renderPreview()}
    </Modal>
  );
};

export default FilePreview;