import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { moduleService } from '../../services/moduleService';
import ModuleCard from './ModuleCard';
import CreateModuleModal from './CreateModuleModal';
import LoadingSpinner from '../common/LoadingSpinner';

const ModuleList: React.FC = () => {
  const { semesterId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const { data: modules, isLoading, refetch } = useQuery({
    queryKey: ['modules', semesterId],
    queryFn: () => moduleService.getBySemester(semesterId!),
    enabled: !!semesterId,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Modules</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg 
            hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          New Module
        </button>
      </div>

      {modules?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No modules yet. Create your first module!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules?.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/module/${module.id}`)}
              className="cursor-pointer"
            >
              <ModuleCard module={module} onUpdate={refetch} />
            </motion.div>
          ))}
        </div>
      )}

      <CreateModuleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
        semesterId={semesterId!}
      />
    </>
  );
};

export default ModuleList;