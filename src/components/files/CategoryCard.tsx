import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Category } from './CategoryFileManager';

interface CategoryCardProps {
  category: Category;
  fileCount: number;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, fileCount, onClick }) => {
  const Icon = category.icon;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`${category.bgColor} rounded-xl p-5 cursor-pointer group transition-all duration-300 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm`}>
          <Icon size={28} className={category.color} />
        </div>
        <ChevronRight 
          size={20} 
          className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" 
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold dark:text-white mb-1">{category.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{category.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500 dark:text-gray-500">
            {fileCount} {fileCount === 1 ? 'file' : 'files'}
          </span>
          <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
            View all →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryCard;