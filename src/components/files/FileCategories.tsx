import React from 'react';

interface FileCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { value: 'ALL', label: 'All', icon: '📁' },
  { value: 'LECTURE_MATERIAL', label: 'Lectures', icon: '📚' },
  { value: 'VIDEO', label: 'Videos', icon: '🎥' },
  { value: 'ASSIGNMENT', label: 'Assignments', icon: '📝' },
  { value: 'REFERENCE_PAPER', label: 'Papers', icon: '📄' },
  { value: 'EBOOK', label: 'eBooks', icon: '📖' },
  { value: 'NOTES', label: 'Notes', icon: '📓' },
];

const FileCategories: React.FC<FileCategoriesProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <button
          key={cat.value}
          onClick={() => onSelectCategory(cat.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${selectedCategory === cat.value
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
        >
          <span className="mr-1">{cat.icon}</span> {cat.label}
        </button>
      ))}
    </div>
  );
};

export default FileCategories;