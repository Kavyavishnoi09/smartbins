import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

interface FillLevelChartProps {
  data: Array<{
    time: string;
    level: number;
  }>;
  height?: number;
}

const FillLevelChart: React.FC<FillLevelChartProps> = ({ data, height = 300 }) => {
  const { theme } = useTheme();
  
  const colors = {
    light: {
      grid: '#f0f0f0',
      text: '#666',
      line: '#10b981'
    },
    dark: {
      grid: '#374151',
      text: '#9ca3af',
      line: '#34d399'
    }
  };

  const currentColors = colors[theme];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={currentColors.grid} />
        <XAxis 
          dataKey="time" 
          stroke={currentColors.text}
          fontSize={12}
        />
        <YAxis 
          stroke={currentColors.text}
          fontSize={12}
          domain={[0, 100]}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            border: `1px solid ${currentColors.grid}`,
            borderRadius: '8px',
            color: currentColors.text
          }}
        />
        <Line 
          type="monotone" 
          dataKey="level" 
          stroke={currentColors.line}
          strokeWidth={2}
          dot={{ fill: currentColors.line, strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FillLevelChart;