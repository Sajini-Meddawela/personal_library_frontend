import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
      <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
        <Home size={16} />
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return (
          <React.Fragment key={name}>
            <ChevronRight size={14} />
            {isLast ? (
              <span className="text-gray-900 dark:text-white font-medium capitalize">
                {decodeURIComponent(name)}
              </span>
            ) : (
              <Link 
                to={routeTo} 
                className="hover:text-primary-600 dark:hover:text-primary-400 capitalize"
              >
                {decodeURIComponent(name)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;