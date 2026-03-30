import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface Stat {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  change?: string;
}

interface StatsCardsProps {
  stats: Stat[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
              <stat.icon className={`${stat.color} text-opacity-100`} size={24} />
            </div>
            {stat.change && (
              <div className="flex items-center text-green-500 text-sm">
                <TrendingUp size={14} className="mr-1" />
                {stat.change}
              </div>
            )}
          </div>
          <h3 className="text-2xl font-bold dark:text-white">{stat.value}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{stat.title}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;