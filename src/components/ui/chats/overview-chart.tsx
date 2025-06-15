'use client';

import { useState, useEffect } from 'react';
import cn from '@/utils/cn';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import { extendedApiService, ChartData } from '@/services/extendedApiService';

interface OverviewChartProps {
  chartWrapperClass?: string;
  title?: string;
  description?: string;
}

export default function OverviewChart({ 
  chartWrapperClass,
  title = "ROI Overview",
  description = "Investment performance"
}: OverviewChartProps) {
  const { layout } = useLayout();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalROI, setTotalROI] = useState<number>(0);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await extendedApiService.getOverviewData('24h');
      setChartData(data);
      
      // Calculate total ROI for new users (should be 0)
      if (data.length > 0) {
        const latestValue = data[data.length - 1].value;
        setTotalROI(latestValue);
      } else {
        setTotalROI(0);
      }
    } catch (err) {
      console.error('Error loading overview data:', err);
      setError('Failed to load overview data');
      // Set default values for new users
      const defaultData = [
        { date: new Date().toISOString(), value: 0 }
      ];
      setChartData(defaultData);
      setTotalROI(0);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={cn(
          'rounded-lg bg-light-dark p-6 text-white shadow-card sm:p-8',
          {
            'w-full lg:w-[49%]': layout === LAYOUT_OPTIONS.RETRO,
          },
        )}
      >
        <h3 className="text-xl font-medium tracking-tighter text-white sm:text-3xl">
          Loading...
        </h3>
        <p className="mt-2 mb-1 text-xs font-medium text-gray-400 sm:text-sm">
          {description}
        </p>
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'rounded-lg bg-light-dark p-6 text-white shadow-card sm:p-8',
          {
            'w-full lg:w-[49%]': layout === LAYOUT_OPTIONS.RETRO,
          },
        )}
      >
        <h3 className="text-xl font-medium tracking-tighter text-white sm:text-3xl">
          Error
        </h3>
        <p className="mt-2 mb-1 text-xs font-medium text-red-400 sm:text-sm">
          {error}
        </p>
        <div className="flex items-center justify-center h-60">
          <button
            onClick={loadChartData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg bg-light-dark p-6 text-white shadow-card sm:p-8',
        {
          'w-full lg:w-[49%]': layout === LAYOUT_OPTIONS.RETRO,
        },
      )}
    >
      <h3 className="text-xl font-medium tracking-tighter text-white sm:text-3xl">
        {totalROI.toFixed(1)}%
      </h3>
      <p className="mt-2 mb-1 text-xs font-medium text-gray-400 sm:text-sm">
        {totalROI === 0 ? 'No investments yet' : description}
      </p>
      <div className={cn('h-60 w-full', chartWrapperClass)}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="natural"
              dataKey="value"
              stroke="#1E40AF"
              strokeWidth={4}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
