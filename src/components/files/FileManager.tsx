import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fileService } from '../../services/fileService';
import FileUpload from './FileUpload';
import FileList from './FileList';
import FileCategories from './FileCategories';
import LoadingSpinner from '../common/LoadingSpinner';
import SearchBar from '../common/SearchBar';

const FileManager: React.FC = () => {
  const { moduleId } = useParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['files', moduleId, selectedCategory],
    queryFn: () => fileService.getByModule(moduleId!, selectedCategory !== 'ALL' ? selectedCategory : undefined),
    enabled: !!moduleId,
  });

  const filteredFiles = React.useMemo(() => {
    if (!files) return [];
    if (!searchQuery) return files;
    
    return files.filter(file => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [files, searchQuery]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <FileCategories 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        <SearchBar 
          onSearch={setSearchQuery} 
          placeholder="Search files..." 
          className="sm:w-64"
        />
      </div>
      
      <FileUpload moduleId={moduleId!} onUploadSuccess={refetch} />
      
      {filteredFiles && filteredFiles.length > 0 ? (
        <FileList files={filteredFiles} onUpdate={refetch} />
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? 'No files match your search' : 'No files uploaded yet'}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileManager;