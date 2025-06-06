'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import cn from '@/utils/cn';

interface User {
  id: string;
  walletAddress: string;
  username: string;
  email: string;
  portfolioValue: number;
  totalInvested: number;
  totalROI: number;
  isOrganizer: boolean;
  organizerRating?: number;
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (walletAddress: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const mockUser: User = {
  id: '1',
  walletAddress: '7KQLiaJmKk6KexNwznkgBZPXYux5TsPBki3NVh2XXoM7',
  username: 'PokerPro',
  email: 'pokerpro@solcraft.com',
  portfolioValue: 25430,
  totalInvested: 22500,
  totalROI: 13.02,
  isOrganizer: true,
  organizerRating: 4.8,
  joinedDate: '2024-01-15T10:00:00Z',
};

export default function AuthPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUser(mockUser);
      alert('Wallet connected successfully!');
    } catch (error) {
      alert('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setUser(null);
    alert('Wallet disconnected');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Account
            </h1>
            <button
              onClick={disconnectWallet}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Disconnect Wallet
            </button>
          </div>

          {/* Profile Card */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow-card dark:bg-light-dark">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {user.username.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user.username}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Joined {formatDate(user.joinedDate)}
                  </p>
                  {user.isOrganizer && (
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Tournament Organizer
                      </span>
                      {user.organizerRating && (
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.organizerRating}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={cn(
                                  'h-3 w-3',
                                  i < Math.floor(user.organizerRating!)
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
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowProfile(true)}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Portfolio Value
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(user.portfolioValue)}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Invested
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(user.totalInvested)}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total ROI
              </h3>
              <p className="text-2xl font-bold text-green-500">
                +{user.totalROI.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Wallet Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Wallet Address
                </label>
                <div className="flex items-center space-x-2">
                  <code className="rounded bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800">
                    {user.walletAddress}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(user.walletAddress)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Modal */}
        {showProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Edit Profile
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Username
                  </label>
                  <input
                    type="text"
                    defaultValue={user.username}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowProfile(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Profile updated successfully!');
                    setShowProfile(false);
                  }}
                  className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Connect Your Wallet
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connect your Solana wallet to access SolCraft
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-card dark:bg-light-dark">
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full rounded-lg bg-blue-500 px-4 py-3 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
          
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Supported wallets: Phantom, Solflare, Backpack
          </div>
        </div>
      </div>
    </div>
  );
}

