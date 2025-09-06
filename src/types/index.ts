export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff' | 'driver';
  name: string;
  avatar?: string;
}

export interface Bin {
  id: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    area: string;
  };
  fillLevel: number; // 0-100%
  capacity: number; // in liters
  lastEmptied: Date;
  lastUpdated: Date;
  sensorId: string;
  status: 'empty' | 'half' | 'full' | 'overflow';
  predictedFullTime?: Date;
  batteryLevel?: number;
  temperature?: number;
}

export interface Route {
  id: string;
  name: string;
  bins: string[]; // bin IDs
  driverId?: string;
  estimatedDuration: number; // in minutes
  distance: number; // in km
  optimized: boolean;
  status: 'pending' | 'in-progress' | 'completed';
  startTime?: Date;
  completedTime?: Date;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  assignedRoutes: string[];
  status: 'available' | 'on-route' | 'break';
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export interface CollectionRecord {
  id: string;
  binId: string;
  driverId: string;
  collectedAt: Date;
  fillLevelBefore: number;
  wasteAmount: number; // in kg
  notes?: string;
}

export interface Analytics {
  totalBins: number;
  fullBins: number;
  halfFullBins: number;
  emptyBins: number;
  dailyCollections: number;
  weeklyCollections: number;
  averageFillRate: number;
  predictedOverflows: number;
}