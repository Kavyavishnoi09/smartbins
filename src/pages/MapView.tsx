import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Filter, RefreshCw } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import BinMap from '../components/Map/BinMap';
import BinCard from '../components/Cards/BinCard';

const MapView: React.FC = () => {
  const { bins, isLoading } = useData();
  const [selectedBin, setSelectedBin] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter bins based on search and status
  const filteredBins = bins.filter(bin => {
    const matchesSearch = bin.location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bin.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bin.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || bin.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const selectedBinData = bins.find(bin => bin.id === selectedBin);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Map View</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time bin locations and status monitoring
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by area, address, or bin ID..."
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
      </motion.div>

      {/* Map and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Bin Locations
                </h2>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Empty</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Half</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Full</span>
                  </div>
                </div>
              </div>
            </div>
            <BinMap
              bins={filteredBins}
              selectedBin={selectedBin}
              onBinSelect={setSelectedBin}
              height="500px"
            />
          </div>
        </motion.div>

        {/* Bin Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {selectedBinData ? (
            <BinCard bin={selectedBinData} />
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                Select a Bin
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Click on a bin marker to view its details
              </p>
            </div>
          )}

          {/* Stats Summary */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Current Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total Bins</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {filteredBins.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Empty</span>
                <span className="font-semibold text-green-600">
                  {filteredBins.filter(b => b.status === 'empty').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Half Full</span>
                <span className="font-semibold text-yellow-600">
                  {filteredBins.filter(b => b.status === 'half').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Full</span>
                <span className="font-semibold text-red-600">
                  {filteredBins.filter(b => b.status === 'full' || b.status === 'overflow').length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MapView;