import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, MapPin, Battery, Thermometer, AlertTriangle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import BinCard from '../components/Cards/BinCard';
import StatCard from '../components/Cards/StatCard';

const Bins: React.FC = () => {
  const { bins, analytics, updateBinStatus, isLoading } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [areaFilter, setAreaFilter] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter bins
  const filteredBins = bins.filter(bin => {
    const matchesSearch = bin.location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bin.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bin.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || bin.status === statusFilter;
    const matchesArea = areaFilter === 'all' || bin.location.area === areaFilter;
    
    return matchesSearch && matchesStatus && matchesArea;
  });

  // Get unique areas
  const areas = Array.from(new Set(bins.map(bin => bin.location.area)));

  // Calculate stats for filtered bins
  const filteredStats = {
    total: filteredBins.length,
    empty: filteredBins.filter(b => b.status === 'empty').length,
    half: filteredBins.filter(b => b.status === 'half').length,
    full: filteredBins.filter(b => b.status === 'full' || b.status === 'overflow').length,
    lowBattery: filteredBins.filter(b => b.batteryLevel && b.batteryLevel < 20).length
  };

  const statCards = [
    {
      title: 'Total Bins',
      value: filteredStats.total,
      icon: MapPin,
      color: 'blue' as const
    },
    {
      title: 'Empty Bins',
      value: filteredStats.empty,
      icon: MapPin,
      color: 'green' as const
    },
    {
      title: 'Full Bins',
      value: filteredStats.full,
      icon: AlertTriangle,
      color: 'red' as const
    },
    {
      title: 'Low Battery',
      value: filteredStats.lowBattery,
      icon: Battery,
      color: 'yellow' as const
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bins Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage all waste bins across the city
          </p>
        </div>

        {(user?.role === 'admin' || user?.role === 'staff') && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Bin</span>
          </motion.button>
        )}
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

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
      >
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search bins by ID, area, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">All Status</option>
              <option value="empty">Empty</option>
              <option value="half">Half Full</option>
              <option value="full">Full</option>
              <option value="overflow">Overflow</option>
            </select>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
            >
              <option value="all">All Areas</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Bins Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {filteredBins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBins.map((bin, index) => (
              <motion.div
                key={bin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <BinCard
                  bin={bin}
                  onStatusUpdate={updateBinStatus}
                  showActions={user?.role !== 'admin'}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              No Bins Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </motion.div>

      {/* Urgent Actions */}
      {filteredStats.full > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-semibold text-red-800 dark:text-red-300">
              Urgent Collection Required
            </h2>
          </div>
          <p className="text-red-700 dark:text-red-400 mb-4">
            {filteredStats.full} bins are full and need immediate collection
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
          >
            Create Emergency Route
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default Bins;