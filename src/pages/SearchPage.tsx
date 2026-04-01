import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, X, FileText, Video, Image, File as FileIcon, BookOpen, GraduationCap, FolderOpen } from 'lucide-react';
import { fileService } from '../services/fileService';
import FileViewer from '../components/files/FileViewer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SearchBar from '../components/common/SearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import { File } from '../types';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileType, setFileType] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const { data: results, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['search', searchQuery, fileType, category],
    queryFn: () => fileService.search({
      q: searchQuery,
      type: fileType !== 'ALL' ? fileType : undefined,
      category: category !== 'ALL' ? category : undefined,
    }),
    enabled: searchQuery.length > 0,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearFilters = () => {
    setFileType('ALL');
    setCategory('ALL');
  };

  const handleFileClick = (file: File) => {
    setSelectedFile(file);
    setIsViewerOpen(true);
  };

  const getFileIcon = (file: File) => {
    switch (file.type) {
      case 'PDF':
        return <FileText className="text-red-500" size={20} />;
      case 'VIDEO':
        return <Video className="text-blue-500" size={20} />;
      case 'IMAGE':
        return <Image className="text-green-500" size={20} />;
      case 'DOCUMENT':
        return <FileText className="text-orange-500" size={20} />;
      default:
        return <FileIcon className="text-gray-500" size={20} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'LECTURE_MATERIAL':
        return <BookOpen size={14} className="text-blue-500" />;
      case 'VIDEO':
        return <Video size={14} className="text-red-500" />;
      case 'ASSIGNMENT':
        return <FileText size={14} className="text-green-500" />;
      case 'REFERENCE_PAPER':
        return <GraduationCap size={14} className="text-purple-500" />;
      case 'EBOOK':
        return <BookOpen size={14} className="text-orange-500" />;
      case 'NOTES':
        return <FileText size={14} className="text-teal-500" />;
      default:
        return <FolderOpen size={14} className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hasActiveFilters = fileType !== 'ALL' || category !== 'ALL';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold dark:text-white mb-2">Search Files</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find your lecture materials, assignments, videos, and more
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl">
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Search by name, description, or tags..." 
        />
      </div>

      {/* Active Search Query Display */}
      {searchQuery && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Searching for:</span>
          <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg font-medium">
            "{searchQuery}"
          </span>
          {hasActiveFilters && (
            <span className="text-gray-600 dark:text-gray-400">with filters</span>
          )}
        </div>
      )}

      {/* Filters Section */}
      {searchQuery && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm font-medium dark:text-white">Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
              >
                <X size={12} /> Clear all
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* File Type Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                File Type
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="ALL">All Types</option>
                <option value="PDF">📄 PDF Documents</option>
                <option value="VIDEO">🎥 Videos</option>
                <option value="IMAGE">🖼️ Images</option>
                <option value="DOCUMENT">📝 Documents (Word, etc.)</option>
              </select>
            </div>
            
            {/* Category Filter */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="ALL">All Categories</option>
                <option value="LECTURE_MATERIAL">📚 Lecture Materials</option>
                <option value="VIDEO">🎥 Videos</option>
                <option value="ASSIGNMENT">📝 Assignments</option>
                <option value="REFERENCE_PAPER">📄 Reference Papers</option>
                <option value="EBOOK">📖 eBooks</option>
                <option value="NOTES">📓 Notes</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Results Section */}
      {searchQuery && (
        <>
          {/* Results Count */}
          {results && results.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Found <span className="font-semibold text-primary-600 dark:text-primary-400">{results.length}</span> {results.length === 1 ? 'file' : 'files'}
              </p>
              {isFetching && !isLoading && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600"></div>
                  <span>Updating...</span>
                </div>
              )}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : results && results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleFileClick(file)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* File Icon */}
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        {getFileIcon(file)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* File Name */}
                        <h3 className="font-medium dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {file.name}
                        </h3>
                        
                        {/* File Metadata */}
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.fileSize)}
                          </p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(file.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {/* Category Badge */}
                        <div className="flex items-center gap-1 mt-2">
                          {getCategoryIcon(file.category)}
                          <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                            {file.category.replace('_', ' ').toLowerCase()}
                          </span>
                        </div>
                        
                        {/* Description (if exists) */}
                        {file.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                            {file.description}
                          </p>
                        )}
                        
                        {/* Tags */}
                        {file.tags && file.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {file.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                                #{tag}
                              </span>
                            ))}
                            {file.tags.length > 2 && (
                              <span className="text-xs px-2 py-0.5 text-gray-500">
                                +{file.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Module Info */}
                    {file.module && (
                      <div className="mt-3 pt-3 border-t dark:border-gray-700">
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <FolderOpen size={12} />
                          <span className="truncate">
                            {file.module.semester?.name} / {file.module.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <Search size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                No results found
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                We couldn't find any files matching "{searchQuery}"
                {hasActiveFilters && ' with the selected filters'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="mt-4 text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          )}
        </>
      )}
      
      {/* Empty State - No Search */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        >
          <Search size={64} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
            Search your academic library
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Enter a search term to find your lecture materials, assignments, videos, and more
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
              📚 Lecture notes
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
              🎥 Video tutorials
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
              📄 Research papers
            </span>
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300">
              📝 Assignments
            </span>
          </div>
        </motion.div>
      )}

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

export default SearchPage;