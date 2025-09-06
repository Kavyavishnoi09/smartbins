import React from 'react';
import { motion } from 'framer-motion';
import { Route, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import BinCard from '../components/Cards/BinCard';

const MyRoutes: React.FC = () => {
  const { bins, routes, drivers, updateBinStatus, isLoading } = useData();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Get current driver's routes
  const driver = drivers.find(d => d.id === 'driver-1'); // In real app, would match with user
  const driverRoutes = routes.filter(route => route.driverId === driver?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold mb-2">My Routes</h1>
        <p className="text-blue-100">
          Today's assigned routes and collection schedule
        </p>
      </motion.div>

      {/* Driver Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop'}
              alt={user?.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.name}
              </h2>
              <p className="text-green-600 dark:text-green-400 capitalize">
                {driver?.status || 'Available'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Routes</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {driverRoutes.length}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Routes */}
      {driverRoutes.map((route, index) => {
        const routeBins = bins.filter(bin => route.bins.includes(bin.id));
        const completedBins = routeBins.filter(bin => bin.fillLevel < 10).length;
        const progress = (completedBins / routeBins.length) * 100;

        return (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            {/* Route Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Route className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {route.name}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{route.distance} km</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{route.estimatedDuration} min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  route.status === 'completed' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                    : route.status === 'in-progress'
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {route.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {completedBins}/{routeBins.length} completed
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Route Progress
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {progress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Bins Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routeBins.map((bin) => (
                <BinCard
                  key={bin.id}
                  bin={bin}
                  onStatusUpdate={updateBinStatus}
                  showActions={true}
                />
              ))}
            </div>

            {/* Route Actions */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">
                  {completedBins} of {routeBins.length} bins collected
                </span>
              </div>

              {route.status !== 'completed' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  {route.status === 'pending' ? 'Start Route' : 'Continue Route'}
                </motion.button>
              )}
            </div>
          </motion.div>
        );
      })}

      {driverRoutes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm text-center"
        >
          <Route className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
            No Routes Assigned
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have any routes assigned for today. Please check back later or contact your supervisor.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MyRoutes;