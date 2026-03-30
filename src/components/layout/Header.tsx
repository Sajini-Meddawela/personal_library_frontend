import React from 'react';
import { Menu, Sun, Moon, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode, sidebarOpen }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Menu size={20} />
          </button>
          <h2 className="text-xl font-semibold dark:text-white">Academic Library</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;