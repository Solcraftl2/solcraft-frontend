'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { extendedApiService, ChartData } from '@/services/extendedApiService';

interface VolumeChartProps {
  title?: string;
  description?: string;
}

function CustomAxis({ x, y, payload }: any) {
  const date = format(new Date(payload.value), 'd');
  return (
    <g transform={`translate(${x},${y})`} className="text-sm text-gray-500">
      <text x={0} y={0} dy={10} textAnchor="end" fill="currentColor">
        {date}
      </text>
    </g>
  );
}

const numberAbbr = (number: any) => {
  if (number < 1e3) return number;
  if (number >= 1e3 && number < 1e6) return +(number / 1e3).toFixed(1) + 'K';
  if (number >= 1e6 && number < 1e9) return +(number / 1e6).toFixed(1) + 'M';
  if (number >= 1e9 && number < 1e12) return +(number / 1e9).toFixed(1) + 'B';
  if (number >= 1e12) return +(number / 1e12).toFixed(1) + 'T';
};

export default function VolumeChart({ 
  title = "Volume 24h", 
  description = "Investment volume data" 
}: VolumeChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<number>(0);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await extendedApiService.getVolumeData('24h');
      setChartData(data);
      
      // Set initial values
      if (data.length > 0) {
        setSelectedDate(data[data.length - 1].date);
        setSelectedValue(data[data.length - 1].volume || 0);
      }
    } catch (err) {
      console.error('Error loading volume data:', err);
      setError('Failed to load volume data');
      // Set default values for new users
      const defaultData = [
        { date: new Date().toISOString(), value: 0, volume: 0 }
      ];
      setChartData(defaultData);
      setSelectedDate(defaultData[0].date);
      setSelectedValue(0);
    } finally {
      setLoading(false);
    }
  };

  const formattedDate = selectedDate ? format(new Date(selectedDate), 'MMMM d, yyyy') : '';
  const displayValue = numberAbbr(selectedValue);

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark sm:p-8">
        <h3 className="mb-1.5 text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 sm:mb-2 sm:text-base">
          {title}
        </h3>
        <div className="flex items-center justify-center h-56">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark sm:p-8">
        <h3 className="mb-1.5 text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 sm:mb-2 sm:text-base">
          {title}
        </h3>
        <div className="text-sm text-red-500 mb-4">{error}</div>
        <div className="flex items-center justify-center h-56">
          <button
            onClick={loadChartData}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark sm:p-8">
      <h3 className="mb-1.5 text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 sm:mb-2 sm:text-base">
        {title}
      </h3>
      <div className="mb-1 text-base font-medium text-gray-900 dark:text-white sm:text-xl">
        {displayValue}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
        {formattedDate}
      </div>
      <div className="mt-5 h-56 sm:mt-8 md:mt-16 lg:mt-8 lg:h-64 2xl:h-72 3xl:h-[340px] 4xl:h-[480px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
            onMouseMove={(data) => {
              if (data.isTooltipActive && data.activePayload && data.activePayload[0]) {
                setSelectedDate(data.activePayload[0].payload.date);
                setSelectedValue(data.activePayload[0].payload.volume || 0);
              }
            }}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={<CustomAxis />}
              interval={0}
              tickMargin={5}
            />
            <Tooltip
              cursor={{ strokeWidth: 0, fill: '#dffdff' }}
            />
            <Bar type="monotone" dataKey="volume" fill="#1FC7D4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
