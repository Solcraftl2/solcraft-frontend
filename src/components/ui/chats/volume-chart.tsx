import { useState } from 'react';
import { format } from 'date-fns';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis } from 'recharts';
import { VolumeData } from '@/data/static/volume';

interface VolumeChartProps {
  title?: string;
  description?: string;
}

function CustomAxis({ x, y, payload }: any) {
  const date = format(new Date(payload.value * 1000), 'd');
  return (
    <g
      transform={`translate(${x},${y})`}
      className="text-xs text-gray-500 md:text-sm"
    >
      <text x={0} y={0} dy={10} textAnchor="end" fill="currentColor">
        {date}
      </text>
    </g>
  );
}

const numberAbbr = (number: any) => {
  if (number >= 1e6 && number < 1e9) return +(number / 1e6).toFixed(1) + 'M';
  if (number >= 1e9 && number < 1e12) return +(number / 1e9).toFixed(1) + 'B';
  if (number >= 1e12) return +(number / 1e12).toFixed(1) + 'T';
};

export default function VolumeChart({ title, description }: VolumeChartProps) {
  let [date, setDate] = useState(1624147200);
  let [volume, setVolume] = useState('547792029');
  const formattedDate = format(new Date(date * 1000), 'MMMM d, yyyy');
  const dailyVolume = numberAbbr(volume);

  return (
    <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark sm:p-8">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:text-base">
          {title || 'Volume'}
        </h4>
      </div>
      <div className="mb-1 text-base font-medium text-gray-900 dark:text-white sm:text-xl">
        {dailyVolume}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
        {description || formattedDate}
      </div>
      <div className="mt-5 h-64 sm:mt-8 2xl:h-72 3xl:h-[340px] 4xl:h-[480px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={VolumeData}
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
            onMouseMove={(data: any) => {
              if (data.isTooltipActive) {
                setDate(data.activePayload[0].payload.date);
                setVolume(data.activePayload[0].payload.volume);
              }
            }}
          >
            <defs>
              <linearGradient id="volume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip content={<></>} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={<CustomAxis />}
            />
            <Area
              type="linear"
              dataKey="volume"
              stroke="#7c3aed"
              strokeWidth={2}
              fill="url(#volume)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
