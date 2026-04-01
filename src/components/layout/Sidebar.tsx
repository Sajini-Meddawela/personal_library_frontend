import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Search, 
  ChevronLeft,
  ChevronRight,
  Library
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/semesters', icon: BookOpen, label: 'Semesters' },
    { path: '/modules', icon: BookOpen, label: 'Modules' },
    { path: '/search', icon: Search, label: 'Search' },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: open ? 256 : 80 }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-lg z-20"
    >
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className={`flex items-center gap-2 ${!open && 'justify-center w-full'}`}>
          <Library className="w-8 h-8 text-primary-600" />
          {open && <span className="font-bold text-xl dark:text-white">AcademiLib</span>}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }
              ${!open && 'justify-center'}
            `}
          >
            <item.icon size={20} />
            {open && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;