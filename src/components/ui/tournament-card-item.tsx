'use client';

import { useState } from 'react';
import cn from '@/utils/cn';
import { formatDistanceToNow } from 'date-fns';

interface Tournament {
  id: number;
  name: string;
  organizer: string;
  buyIn: number;
  prizePool: number;
  startTime: string;
  status: string;
  participants: number;
  maxParticipants: number;
  investmentPool: number;
  minInvestment: number;
  expectedROI: number;
  riskLevel: string;
  organizerRating: number;
  image?: string;
}

interface TournamentCardProps {
  tournament: Tournament;
  className?: string;
}

export default function TournamentCard({ tournament, className }: TournamentCardProps) {
  const [isInvesting, setIsInvesting] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(tournament.minInvestment);
  const [showInvestModal, setShowInvestModal] = useState(false);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'upcoming': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'completed': return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const timeToStart = formatDistanceToNow(new Date(tournament.startTime), { addSuffix: true });

  const handleInvest = async () => {
    if (investmentAmount < tournament.minInvestment) {
      alert(`Minimum investment is ${formatCurrency(tournament.minInvestment)}`);
      return;
    }

    setIsInvesting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Successfully invested ${formatCurrency(investmentAmount)} in ${tournament.name}!`);
      setShowInvestModal(false);
    } catch (error) {
      alert('Investment failed. Please try again.');
    } finally {
      setIsInvesting(false);
    }
  };

  return (
    <>
      <div className={cn(
        'relative overflow-hidden rounded-lg bg-white shadow-card transition-all duration-200 hover:shadow-large dark:bg-light-dark',
        className
      )}>
        {/* Tournament Image/Header */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <div className="flex items-start justify-between">
            <div>
              <span className={cn(
                'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                getStatusColor(tournament.status)
              )}>
                {tournament.status.toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/80">Prize Pool</div>
              <div className="text-lg font-bold text-white">
                {formatCurrency(tournament.prizePool)}
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4">
            <h3 className="text-lg font-semibold text-white">{tournament.name}</h3>
            <p className="text-sm text-white/80">by {tournament.organizer}</p>
          </div>
        </div>

        {/* Tournament Details */}
        <div className="p-4 space-y-4">
          {/* Row 1: Buy-in and Players */}
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Buy-in</span>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                {formatCurrency(tournament.buyIn)}
              </div>
            </div>
            <div className="flex-1 min-w-0 text-right">
              <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Players</span>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                {tournament.participants.toLocaleString()}/{tournament.maxParticipants.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Row 2: ROI and Risk */}
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">ROI</span>
              <div className="font-semibold text-green-500 text-sm">
                +{tournament.expectedROI}%
              </div>
            </div>
            <div className="flex-1 min-w-0 text-right">
              <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Risk</span>
              <div className="flex justify-end">
                <span className={cn(
                  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                  getRiskColor(tournament.riskLevel)
                )}>
                  {tournament.riskLevel.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Investment Pool */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Investment Pool</span>
            <div className="font-semibold text-gray-900 dark:text-white text-sm">
              {formatCurrency(tournament.investmentPool)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Min. investment: {formatCurrency(tournament.minInvestment)}
            </div>
          </div>

          {/* Start Time */}
          <div>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Starts</span>
            <div className="font-semibold text-gray-900 dark:text-white text-sm">
              {timeToStart}
            </div>
          </div>

          {/* Organizer Rating */}
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">Organizer Rating</span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                {tournament.organizerRating}
              </span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < Math.floor(tournament.organizerRating)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    )}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>

          {/* Investment Button */}
          <button
            onClick={() => tournament.status !== 'completed' ? setShowInvestModal(true) : null}
            disabled={tournament.status === 'completed'}
            className={cn(
              'w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors mt-4',
              tournament.status === 'completed'
                ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
            )}
          >
            {tournament.status === 'completed' 
              ? 'Tournament Completed' 
              : 'Invest Now'
            }
          </button>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Invest in {tournament.name}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Investment Amount
              </label>
              <input
                type="number"
                min={tournament.minInvestment}
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum: {formatCurrency(tournament.minInvestment)}
              </p>
            </div>

            <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
              <div className="flex justify-between text-sm">
                <span>Expected Return:</span>
                <span className="font-medium text-green-500">
                  {formatCurrency(investmentAmount * (1 + tournament.expectedROI / 100))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Potential Profit:</span>
                <span className="font-medium text-green-500">
                  +{formatCurrency(investmentAmount * (tournament.expectedROI / 100))}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowInvestModal(false)}
                disabled={isInvesting}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleInvest}
                disabled={isInvesting || investmentAmount < tournament.minInvestment}
                className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {isInvesting ? 'Processing...' : 'Confirm Investment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

