import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, TrendingUp, AlertTriangle, Truck, Clock, BarChart3 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import StatCard from '../components/Cards/StatCard';
import BinCard from '../components/Cards/BinCard';
import FillLevelChart from '../components/Charts/FillLevelChart';

const Dashboard: React.FC = () => {
  const { bins, analytics, isLoading } = useData();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Get urgent bins (>80% full or predicted to be full within 24 hours)
  const urgentBins = bins.filter(bin => 
    bin.fillLevel > 80 || 
    (bin.predictedFullTime && bin.predictedFullTime < new Date(Date.now() + 24 * 60 * 60 * 1000))
  );

  // Generate sample chart data
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    level: Math.floor(Math.random() * 30) + (i * 2) // Simulated increasing trend
  }));

  const statCards = [
    {
      title: 'Total Bins',
      value: analytics.totalBins,
      icon: Trash2,
      color: 'blue' as const,
      change: { value: 5.2, type: 'increase' as const }
    },
    {
      title: 'Full Bins',
      value: analytics.fullBins,
      icon: AlertTriangle,
      color: 'red' as const,
      change: { value: 12.5, type: 'increase' as const }
    },
    {
      title: 'Collections Today',
      value: analytics.dailyCollections,
      icon: Truck,
      color: 'green' as const,
      change: { value: 8.1, type: 'increase' as const }
    },
    {
      title: 'Average Fill Rate',
      value: `${analytics.averageFillRate.toFixed(1)}%`,
      icon: BarChart3,
      color: 'purple' as const,
      change: { value: 3.2, type: 'decrease' as const }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-green-100">
          Here's your waste management overview for today
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Alerts Section */}
      {urgentBins.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-300">
              Urgent Attention Required
            </h2>
          </div>
          <p className="text-red-700 dark:text-red-400 mb-4">
            {urgentBins.length} bins require immediate attention
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentBins.slice(0, 3).map((bin) => (
              <BinCard key={bin.id} bin={bin} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fill Level Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Average Fill Level Trend (24h)
          </h3>
          <FillLevelChart data={chartData} />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Quick Stats
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Empty Bins</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {analytics.emptyBins}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Half Full</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {analytics.halfFullBins}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Full/Overflow</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {analytics.fullBins}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700 dark:text-gray-300">Predicted Overflows</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                {analytics.predictedOverflows}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Bin bin-3 was emptied by Mike Johnson
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500 ml-auto">2 min ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Bin bin-7 reached 80% capacity
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500 ml-auto">15 min ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Route optimization completed for Downtown area
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500 ml-auto">1 hour ago</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;