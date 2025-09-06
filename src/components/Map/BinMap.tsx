import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { Bin } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
const createBinIcon = (status: Bin['status']) => {
  const color = status === 'empty' ? '#10b981' : 
               status === 'half' ? '#f59e0b' : '#ef4444';
  
  return new DivIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

interface BinMapProps {
  bins: Bin[];
  selectedBin?: string;
  onBinSelect?: (binId: string) => void;
  height?: string;
}

const MapUpdater: React.FC<{ bins: Bin[] }> = ({ bins }) => {
  const map = useMap();

  useEffect(() => {
    if (bins.length > 0) {
      const bounds = bins.map(bin => [bin.location.lat, bin.location.lng] as [number, number]);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [bins, map]);

  return null;
};

const BinMap: React.FC<BinMapProps> = ({ 
  bins, 
  selectedBin, 
  onBinSelect,
  height = '400px'
}) => {
  const center: [number, number] = bins.length > 0 
    ? [bins[0].location.lat, bins[0].location.lng]
    : [40.7128, -74.0060];

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater bins={bins} />
        
        {bins.map((bin) => (
          <Marker
            key={bin.id}
            position={[bin.location.lat, bin.location.lng]}
            icon={createBinIcon(bin.status)}
            eventHandlers={{
              click: () => onBinSelect?.(bin.id)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Bin {bin.id}
                </h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Fill Level:</strong> {bin.fillLevel.toFixed(1)}%</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-1 capitalize ${
                      bin.status === 'empty' ? 'text-green-600' :
                      bin.status === 'half' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {bin.status}
                    </span>
                  </p>
                  <p><strong>Address:</strong> {bin.location.address}</p>
                  <p><strong>Area:</strong> {bin.location.area}</p>
                  <p><strong>Last Updated:</strong> {bin.lastUpdated.toLocaleTimeString()}</p>
                  {bin.predictedFullTime && (
                    <p><strong>Predicted Full:</strong> {bin.predictedFullTime.toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BinMap;