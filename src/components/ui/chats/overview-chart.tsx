import { useLayout } from '@/lib/hooks/use-layout';
import cn from '@/utils/cn';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
  },
  {
    name: 'Page E',
    uv: 1290,
    pv: 3500,
  },
  {
    name: 'Page F',
    uv: 1690,
    pv: 3000,
  },
];

interface Props {
  chartWrapperClass?: string;
  title?: string;
  description?: string;
}

export default function OverviewChart({ chartWrapperClass, title, description }: Props) {
  const { layout } = useLayout();

  return (
    <div
      className={cn(
        'rounded-lg bg-light-dark p-6 text-white shadow-card sm:p-8',
        {
          'w-full lg:w-[49%]': layout === 'retro',
        },
        chartWrapperClass
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium uppercase tracking-wider text-gray-300 sm:text-base">
          {title || 'Overview'}
        </h4>
      </div>
      {description && (
        <div className="mb-4 text-xs text-gray-400 sm:text-sm">
          {description}
        </div>
      )}
      <div className="h-64 w-full sm:h-72 lg:h-64 xl:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
            />
            <Area
              type="monotone"
              dataKey="pv"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
