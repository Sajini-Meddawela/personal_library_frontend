import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter } from 'lucide-react';
import { fileService } from '../services/fileService';
import FileCard from '../components/files/FileCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SearchBar from '../components/common/SearchBar';

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileType, setFileType] = useState('ALL');
  const [category, setCategory] = useState('ALL');

  const { data: results, isLoading, refetch } = useQuery({
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
    if (query) refetch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold dark:text-white mb-4">Search Files</h1>
        <SearchBar onSearch={handleSearch} placeholder="Search by name, description, or tags..." />
      </div>
      
      {searchQuery && (
        <>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm font-medium dark:text-white">Filters:</span>
            </div>
            
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
            >
              <option value="ALL">All Types</option>
              <option value="PDF">PDF</option>
              <option value="VIDEO">Video</option>
              <option value="IMAGE">Image</option>
              <option value="DOCUMENT">Document</option>
            </select>
            
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800"
            >
              <option value="ALL">All Categories</option>
              <option value="LECTURE_MATERIAL">Lecture Material</option>
              <option value="VIDEO">Video</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="REFERENCE_PAPER">Reference Paper</option>
              <option value="EBOOK">eBook</option>
              <option value="NOTES">Notes</option>
            </select>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : results && results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(file => (
                <FileCard key={file.id} file={file} onUpdate={refetch} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <p className="text-gray-500 dark:text-gray-400">No results found for "{searchQuery}"</p>
            </div>
          )}
        </>
      )}
      
      {!searchQuery && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Enter a search term to find your files</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;