import React from 'react';
import { motion } from 'framer-motion';
import FileCard from './FileCard';
import { File } from '../../types';

interface FileListProps {
  files: File[];
  onUpdate: () => void;
}

const FileList: React.FC<FileListProps> = ({ files, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file, index) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <FileCard file={file} onUpdate={onUpdate} />
        </motion.div>
      ))}
    </div>
  );
};

export default FileList;