import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bin, Driver, Route, CollectionRecord, Analytics } from '../types';
import { addHours, subHours, subDays } from 'date-fns';

interface DataContextType {
  bins: Bin[];
  drivers: Driver[];
  routes: Route[];
  collections: CollectionRecord[];
  analytics: Analytics;
  updateBinStatus: (binId: string, collected: boolean) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data generator
const generateMockBins = (): Bin[] => {
  const areas = ['Downtown', 'Residential North', 'Industrial Zone', 'Park District', 'Shopping Center'];
  const bins: Bin[] = [];

  for (let i = 1; i <= 12; i++) {
    const fillLevel = Math.floor(Math.random() * 100);
    const area = areas[Math.floor(Math.random() * areas.length)];
    
    let status: Bin['status'] = 'empty';
    if (fillLevel > 80) status = 'full';
    else if (fillLevel > 90) status = 'overflow';
    else if (fillLevel > 40) status = 'half';

    // Calculate predicted full time based on current fill rate
    const currentFillRate = fillLevel / 100;
    const avgDailyIncrease = Math.random() * 15 + 5; // 5-20% per day
    const daysToFull = (100 - fillLevel) / avgDailyIncrease;
    
    bins.push({
      id: `bin-${i}`,
      location: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        address: `${Math.floor(Math.random() * 9999)} ${['Main St', 'Oak Ave', 'Pine Rd', 'Cedar Blvd'][Math.floor(Math.random() * 4)]}`,
        area
      },
      fillLevel,
      capacity: 240,
      lastEmptied: subDays(new Date(), Math.floor(Math.random() * 7)),
      lastUpdated: subHours(new Date(), Math.floor(Math.random() * 2)),
      sensorId: `ESP32-${i.toString().padStart(3, '0')}`,
      status,
      predictedFullTime: daysToFull > 0 ? addHours(new Date(), daysToFull * 24) : undefined,
      batteryLevel: Math.floor(Math.random() * 40) + 60,
      temperature: Math.floor(Math.random() * 15) + 15
    });
  }

  return bins;
};

const generateMockDrivers = (): Driver[] => [
  {
    id: 'driver-1',
    name: 'Mike Johnson',
    email: 'mike@edust.com',
    phone: '+1-555-0101',
    licenseNumber: 'CDL-A-12345',
    assignedRoutes: ['route-1'],
    status: 'on-route'
  },
  {
    id: 'driver-2',
    name: 'Sarah Williams',
    email: 'sarah@edust.com',
    phone: '+1-555-0102',
    licenseNumber: 'CDL-A-67890',
    assignedRoutes: ['route-2'],
    status: 'available'
  },
  {
    id: 'driver-3',
    name: 'Tom Brown',
    email: 'tom@edust.com',
    phone: '+1-555-0103',
    licenseNumber: 'CDL-A-11111',
    assignedRoutes: [],
    status: 'break'
  }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [drivers] = useState<Driver[]>(generateMockDrivers());
  const [routes, setRoutes] = useState<Route[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize mock data
  useEffect(() => {
    const initData = () => {
      const mockBins = generateMockBins();
      setBins(mockBins);

      // Generate routes based on bins
      const mockRoutes: Route[] = [
        {
          id: 'route-1',
          name: 'Downtown Route',
          bins: mockBins.filter(b => b.location.area === 'Downtown').map(b => b.id),
          driverId: 'driver-1',
          estimatedDuration: 120,
          distance: 15.5,
          optimized: true,
          status: 'in-progress',
          startTime: subHours(new Date(), 2)
        },
        {
          id: 'route-2',
          name: 'North Residential',
          bins: mockBins.filter(b => b.location.area === 'Residential North').map(b => b.id),
          driverId: 'driver-2',
          estimatedDuration: 90,
          distance: 12.3,
          optimized: true,
          status: 'pending'
        }
      ];

      setRoutes(mockRoutes);

      // Generate some collection records
      const mockCollections: CollectionRecord[] = [];
      for (let i = 0; i < 20; i++) {
        mockCollections.push({
          id: `collection-${i}`,
          binId: mockBins[Math.floor(Math.random() * mockBins.length)].id,
          driverId: drivers[Math.floor(Math.random() * drivers.length)].id,
          collectedAt: subDays(new Date(), Math.floor(Math.random() * 7)),
          fillLevelBefore: Math.floor(Math.random() * 40) + 60,
          wasteAmount: Math.floor(Math.random() * 50) + 20
        });
      }
      setCollections(mockCollections);
      
      setIsLoading(false);
    };

    initData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setBins(prevBins => 
        prevBins.map(bin => ({
          ...bin,
          fillLevel: Math.min(100, bin.fillLevel + Math.random() * 2),
          lastUpdated: new Date(),
          batteryLevel: Math.max(0, bin.batteryLevel - Math.random() * 0.1)
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [drivers]);

  const updateBinStatus = (binId: string, collected: boolean) => {
    if (collected) {
      setBins(prevBins =>
        prevBins.map(bin =>
          bin.id === binId
            ? {
                ...bin,
                fillLevel: 0,
                status: 'empty' as const,
                lastEmptied: new Date(),
                lastUpdated: new Date()
              }
            : bin
        )
      );

      // Add collection record
      const bin = bins.find(b => b.id === binId);
      if (bin) {
        const newCollection: CollectionRecord = {
          id: `collection-${Date.now()}`,
          binId,
          driverId: 'driver-1', // In real app, would be current driver
          collectedAt: new Date(),
          fillLevelBefore: bin.fillLevel,
          wasteAmount: Math.floor(bin.fillLevel * 2.4), // Rough calculation
          notes: 'Collected via driver app'
        };
        setCollections(prev => [newCollection, ...prev]);
      }
    }
  };

  // Calculate analytics
  const analytics: Analytics = {
    totalBins: bins.length,
    fullBins: bins.filter(b => b.status === 'full' || b.status === 'overflow').length,
    halfFullBins: bins.filter(b => b.status === 'half').length,
    emptyBins: bins.filter(b => b.status === 'empty').length,
    dailyCollections: collections.filter(c => 
      c.collectedAt > subHours(new Date(), 24)
    ).length,
    weeklyCollections: collections.filter(c => 
      c.collectedAt > subDays(new Date(), 7)
    ).length,
    averageFillRate: bins.reduce((acc, bin) => acc + bin.fillLevel, 0) / bins.length,
    predictedOverflows: bins.filter(b => 
      b.predictedFullTime && b.predictedFullTime < addHours(new Date(), 24)
    ).length
  };

  return (
    <DataContext.Provider value={{
      bins,
      drivers,
      routes,
      collections,
      analytics,
      updateBinStatus,
      isLoading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};