import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Battery, Thermometer, AlertTriangle } from 'lucide-react';
import { Bin } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface BinCardProps {
  bin: Bin;
  onStatusUpdate?: (binId: string, collected: boolean) => void;
  showActions?: boolean;
}

const BinCard: React.FC<BinCardProps> = ({ bin, onStatusUpdate, showActions = false }) => {
  const getStatusColor = (status: Bin['status']) => {
    switch (status) {
      case 'empty':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'half':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      case 'full':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      case 'overflow':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 animate-pulse';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getFillLevelColor = (level: number) => {
    if (level >= 80) return 'bg-red-500';
    if (level >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const isUrgent = bin.fillLevel >= 85 || bin.status === 'overflow';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 ${
        isUrgent 
          ? 'border-red-200 dark:border-red-800' 
          : 'border-gray-100 dark:border-gray-700'
      } p-6 relative overflow-hidden`}
    >
      {/* Urgent indicator */}
      {isUrgent && (
        <div className="absolute top-0 right-0 p-2">
          <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Bin {bin.id}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(bin.status)}`}>
          {bin.status}
        </span>
      </div>

      {/* Fill Level Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Fill Level</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {bin.fillLevel.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${getFillLevelColor(bin.fillLevel)}`}
            initial={{ width: 0 }}
            animate={{ width: `${bin.fillLevel}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center space-x-2 mb-3">
        <MapPin className="w-4 h-4 text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {bin.location.area}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {bin.location.address}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Last Updated</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {formatDistanceToNow(bin.lastUpdated, { addSuffix: true })}
            </p>
          </div>
        </div>

        {bin.batteryLevel && (
          <div className="flex items-center space-x-2">
            <Battery className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Battery</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {bin.batteryLevel}%
              </p>
            </div>
          </div>
        )}

        {bin.temperature && (
          <div className="flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Temperature</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {bin.temperature}°C
              </p>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Last Emptied</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDistanceToNow(bin.lastEmptied, { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Predicted Full Time */}
      {bin.predictedFullTime && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
            Predicted Full Time
          </p>
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            {bin.predictedFullTime.toLocaleDateString()} at{' '}
            {bin.predictedFullTime.toLocaleTimeString()}
          </p>
        </div>
      )}

      {/* Actions */}
      {showActions && onStatusUpdate && (
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStatusUpdate(bin.id, true)}
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Mark as Collected
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default BinCard;