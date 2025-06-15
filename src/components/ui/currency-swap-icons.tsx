import React from 'react';
import { Ethereum } from '@/components/icons/ethereum';
import { Tether } from '@/components/icons/tether';
import { Bnb } from '@/components/icons/bnb';
import { Usdc } from '@/components/icons/usdc';
import { Cardano } from '@/components/icons/cardano';
import { Doge } from '@/components/icons/doge';

// Import Bitcoin icon if it exists, or create a placeholder
const Bitcoin = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#F7931A"/>
    <path d="M15.5 10.5C15.5 9.67 14.83 9 14 9H10V12H14C14.83 12 15.5 11.33 15.5 10.5Z" fill="white"/>
    <path d="M15.5 13.5C15.5 12.67 14.83 12 14 12H10V15H14C14.83 15 15.5 14.33 15.5 13.5Z" fill="white"/>
  </svg>
);

export type CoinList = 'BTC' | 'ETH' | 'USDT' | 'BNB' | 'USDC' | 'ADA' | 'DOGE';

const coinIcons: Record<CoinList, React.ReactElement> = {
  BTC: <Bitcoin />,
  ETH: <Ethereum />,
  USDT: <Tether />,
  BNB: <Bnb />,
  USDC: <Usdc />,
  ADA: <Cardano />,
  DOGE: <Doge />,
};

interface CurrencySwapIconsProps {
  from: CoinList;
  to: CoinList;
  size?: 'small' | 'medium' | 'large';
}

const CurrencySwapIcons: React.FC<CurrencySwapIconsProps> = ({ 
  from, 
  to, 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={sizeClasses[size]}>
        {coinIcons[from]}
      </div>
      <svg 
        className="w-4 h-4 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M17 8l4 4m0 0l-4 4m4-4H3" 
        />
      </svg>
      <div className={sizeClasses[size]}>
        {coinIcons[to]}
      </div>
    </div>
  );
};

export default CurrencySwapIcons;
export { coinIcons };
