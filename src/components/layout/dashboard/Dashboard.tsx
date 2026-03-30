import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  FolderOpen, 
  FileText, 
  HardDrive,
  TrendingUp
} from 'lucide-react';
import { fileService } from '../../../services/fileService';
import { semesterService } from '../../../services/semesterService';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';

const Dashboard: React.FC = () => {
  const { data: semesters, isLoading: semestersLoading } = useQuery({
    queryKey: ['semesters'],
    queryFn: semesterService.getAll
  });

  const { data: files, isLoading: filesLoading } = useQuery({
    queryKey: ['files', 'all'],
    queryFn: () => fileService.search({})
  });

  const totalModules = semesters?.reduce((acc, sem) => acc + (sem.modules?.length || 0), 0) || 0;
  const totalFiles = files?.length || 0;
  const totalStorage = files?.reduce((acc, file) => acc + file.fileSize, 0) || 0;

  const stats = [
    {
      title: 'Total Semesters',
      value: semesters?.length || 0,
      icon: BookOpen,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Modules',
      value: totalModules,
      icon: FolderOpen,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Total Files',
      value: totalFiles,
      icon: FileText,
      color: 'bg-purple-500',
      change: '+23%'
    },
    {
      title: 'Storage Used',
      value: formatBytes(totalStorage),
      icon: HardDrive,
      color: 'bg-orange-500',
      change: '+5%'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your academic library
        </p>
      </motion.div>

      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              📚 Upload new lecture material
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              📝 Create study notes
            </button>
            <button className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              ✅ Add assignment deadline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default Dashboard;