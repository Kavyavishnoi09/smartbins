import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

interface AnalyticsChartsProps {
  weeklyData: Array<{
    day: string;
    collections: number;
    predictions: number;
  }>;
  statusData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ weeklyData, statusData }) => {
  const { theme } = useTheme();
  
  const colors = {
    light: {
      grid: '#f0f0f0',
      text: '#666',
      bar1: '#10b981',
      bar2: '#f59e0b'
    },
    dark: {
      grid: '#374151',
      text: '#9ca3af',
      bar1: '#34d399',
      bar2: '#fbbf24'
    }
  };

  const currentColors = colors[theme];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Collections Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Weekly Collections vs Predictions
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={currentColors.grid} />
            <XAxis 
              dataKey="day" 
              stroke={currentColors.text}
              fontSize={12}
            />
            <YAxis 
              stroke={currentColors.text}
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                border: `1px solid ${currentColors.grid}`,
                borderRadius: '8px',
                color: currentColors.text
              }}
            />
            <Bar dataKey="collections" fill={currentColors.bar1} name="Actual Collections" />
            <Bar dataKey="predictions" fill={currentColors.bar2} name="Predicted" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bin Status Distribution */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Bin Status Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                border: `1px solid ${currentColors.grid}`,
                borderRadius: '8px',
                color: currentColors.text
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {statusData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {entry.name} ({entry.value})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;