import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Download, Calendar, BarChart3 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import AnalyticsCharts from '../components/Charts/AnalyticsCharts';
import StatCard from '../components/Cards/StatCard';

const Analytics: React.FC = () => {
  const { analytics, collections, bins, isLoading } = useData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Generate mock weekly data
  const weeklyData = [
    { day: 'Mon', collections: 12, predictions: 15 },
    { day: 'Tue', collections: 18, predictions: 16 },
    { day: 'Wed', collections: 8, predictions: 10 },
    { day: 'Thu', collections: 14, predictions: 12 },
    { day: 'Fri', collections: 22, predictions: 20 },
    { day: 'Sat', collections: 10, predictions: 8 },
    { day: 'Sun', collections: 6, predictions: 5 },
  ];

  // Bin status distribution for pie chart
  const statusData = [
    { name: 'Empty', value: analytics.emptyBins, color: '#10b981' },
    { name: 'Half Full', value: analytics.halfFullBins, color: '#f59e0b' },
    { name: 'Full', value: analytics.fullBins, color: '#ef4444' },
  ];

  const analyticsCards = [
    {
      title: 'Weekly Collections',
      value: analytics.weeklyCollections,
      icon: TrendingUp,
      color: 'green' as const,
      change: { value: 15.3, type: 'increase' as const }
    },
    {
      title: 'Efficiency Rate',
      value: `${((analytics.weeklyCollections / (analytics.totalBins * 7)) * 100).toFixed(1)}%`,
      icon: BarChart3,
      color: 'blue' as const,
      change: { value: 8.2, type: 'increase' as const }
    },
    {
      title: 'Predicted Overflows',
      value: analytics.predictedOverflows,
      icon: Calendar,
      color: 'red' as const,
      change: { value: 23.1, type: 'decrease' as const }
    },
    {
      title: 'Average Fill Rate',
      value: `${analytics.averageFillRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'purple' as const,
      change: { value: 5.7, type: 'increase' as const }
    }
  ];

  const handleExportReport = (type: 'pdf' | 'excel') => {
    // In a real application, this would generate and download the report
    alert(`Exporting ${type.toUpperCase()} report... (Demo mode)`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Detailed insights and performance metrics
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExportReport('pdf')}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>PDF Report</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExportReport('excel')}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Excel Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => (
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

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <AnalyticsCharts weeklyData={weeklyData} statusData={statusData} />
      </motion.div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Collection Performance
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">On-Time Collections</span>
              <span className="font-semibold text-blue-600">87.5%</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Route Efficiency</span>
              <span className="font-semibold text-green-600">92.3%</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Avg. Collection Time</span>
              <span className="font-semibold text-yellow-600">3.2 min</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-gray-700 dark:text-gray-300">Fuel Efficiency</span>
              <span className="font-semibold text-purple-600">8.5 km/L</span>
            </div>
          </div>
        </motion.div>

        {/* Predictive Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
            Predictive Insights
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
              <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">
                High Priority Areas
              </h4>
              <p className="text-sm text-red-700 dark:text-red-400">
                Downtown and Shopping Center areas show 40% faster fill rates
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                Seasonal Trends
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Weekend collections increase by 25% during summer months
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                Optimization Opportunities
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Route consolidation could reduce travel time by 15%
              </p>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
              <h4 className="font-medium text-green-800 dark:text-green-300 mb-1">
                Cost Savings
              </h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                Predictive maintenance can save up to $5,000 per month
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;