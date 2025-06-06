import cn from '@/utils/cn';
import { useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { ArrowUp } from '@/components/icons/arrow-up';
import { LongArrowUp } from '@/components/icons/long-arrow-up';
import { walletCurrencies } from '@/data/static/wallet-currencies';

const data = [
  {
    name: 'Bitcoin',
    value: 400,
    volume: '+12.5%',
    isChangePositive: true,
  },
  {
    name: 'Tether',
    value: 300,
    volume: '-8.47%',
    isChangePositive: false,
  },
  {
    name: 'Cardano',
    value: 300,
    volume: '+5.63%',
    isChangePositive: true,
  },
  {
    name: 'Binance Coin',
    value: 15,
    volume: '-3.02%',
    isChangePositive: false,
  },
];

export default function WalletCard() {
  const [isChangePositive, setChangeStatus] = useState(true);
  const [percentage, setPercentage] = useState(data[0].volume);
  return (
    <div className="rounded-lg bg-transparent">
      <h3 className="mb-10 text-center text-base font-medium uppercase md:mb-3 xl:mb-10 ltr:lg:text-left rtl:lg:text-right">
        Available Coin
      </h3>
      <div className="relative -z-[1] flex h-[250px] justify-center">
        <ResponsiveContainer width={250} height="100%">
          <PieChart className="h-[250px] w-[250px] md:scale-[.90] xl:scale-100">
            <Pie
              data={data}
              cx={125} // Updated to match new width
              cy={125} // Updated to match new width
              innerRadius={85} // Adjusted to be proportional to the new width
              outerRadius={115} // Adjusted to be proportional to the new width
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              onMouseMove={(data) => {
                setChangeStatus(
                  data.payload.payload && data.payload.payload.isChangePositive,
                );
                setPercentage(
                  data.payload.payload && data.payload.payload.volume,
                );
              }}
            >
              {walletCurrencies.map((currency) => (
                <Cell
                  key={`cell-${currency.code}`}
                  fill={currency.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="bg-white-50 absolute left-[51%] top-[51%] flex h-[125px] w-[125px] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-dashed border-gray-400 dark:border-gray-600 dark:bg-transparent md:h-28 md:w-28 lg:left-[52%] lg:top-[52%] xl:h-[135px] xl:w-[135px]">
          <span
            className={cn(
              'flex items-center text-base font-medium',
              isChangePositive ? 'text-green-500' : 'text-red-500',
            )}
          >
            <LongArrowUp
              className={cn('w-4', {
                'rotate-180': !isChangePositive,
              })}
            />
            {percentage}
          </span>
        </div>
      </div>

      <div className="mt-12 md:mt-6 xl:mt-12">
        <div className="mb-5 flex items-center justify-between text-sm font-medium text-gray-400">
          <span>Coin Name</span>
          <span>Volume</span>
        </div>
        <ul className="grid gap-5">
          {walletCurrencies.map((currency) => (
            <li
              key={currency.code}
              className="grid grid-cols-[150px_repeat(2,1fr)] items-center justify-between text-sm font-medium text-gray-900 dark:text-white 2xl:grid-cols-[140px_repeat(2,1fr)] 3xl:grid-cols-[150px_repeat(2,1fr)]"
            >
              <span className="flex items-center gap-2.5 whitespace-nowrap">
                {currency.icon}
                {currency.name}
              </span>
              <span className="text-center"></span>
              <span
                className={cn(
                  'flex items-center justify-end',
                  currency.isChangePositive ? 'text-green-500' : 'text-red-500',
                )}
              >
                <span
                  className={cn('ltr:mr-2 rtl:ml-2', {
                    'rotate-180': !currency.isChangePositive,
                  })}
                >
                  <ArrowUp />
                </span>
                {currency.volume}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
