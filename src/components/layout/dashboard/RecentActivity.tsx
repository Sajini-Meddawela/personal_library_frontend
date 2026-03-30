import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { FileText, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { fileService } from '../../../services/fileService';
import LoadingSpinner from '../../common/LoadingSpinner';

const RecentActivity: React.FC = () => {
  const { data: files, isLoading } = useQuery({
    queryKey: ['recentFiles'],
    queryFn: () => fileService.search({}),
  });

  const recentFiles = files?.slice(0, 5) || [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText size={16} className="text-blue-500" />;
      case 'VIDEO':
        return <Clock size={16} className="text-red-500" />;
      default:
        return <BookOpen size={16} className="text-green-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : recentFiles.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No recent activity
        </p>
      ) : (
        <div className="space-y-4">
          {recentFiles.map((file) => (
            <div key={file.id} className="flex items-start gap-3">
              <div className="mt-1">{getActivityIcon(file.type)}</div>
              <div className="flex-1">
                <p className="text-sm font-medium dark:text-white">{file.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Added {formatDistanceToNow(new Date(file.createdAt))} ago
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;