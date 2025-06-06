'use client';

import { useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import cn from '@/utils/cn';

const investmentData = [
  {
    id: 1,
    tournament: 'Sunday Million',
    organizer: 'PokerPro',
    amount: 1500,
    investmentDate: '2025-06-01T10:00:00Z',
    status: 'active',
    currentValue: 1650,
    roi: 10.0,
    expectedPayout: '2025-06-08T23:00:00Z',
    riskLevel: 'medium',
  },
  {
    id: 2,
    tournament: 'High Roller Championship',
    organizer: 'ChampionAce',
    amount: 5000,
    investmentDate: '2025-05-28T14:30:00Z',
    status: 'active',
    currentValue: 5750,
    roi: 15.0,
    expectedPayout: '2025-06-10T22:00:00Z',
    riskLevel: 'high',
  },
  {
    id: 3,
    tournament: 'Daily Grind Series',
    organizer: 'TourneyKing',
    amount: 500,
    investmentDate: '2025-06-05T09:15:00Z',
    status: 'completed',
    currentValue: 580,
    roi: 16.0,
    expectedPayout: '2025-06-07T22:30:00Z',
    riskLevel: 'low',
  },
  {
    id: 4,
    tournament: 'Micro Stakes Marathon',
    organizer: 'MicroMaster',
    amount: 250,
    investmentDate: '2025-06-03T16:45:00Z',
    status: 'active',
    currentValue: 275,
    roi: 10.0,
    expectedPayout: '2025-06-09T20:00:00Z',
    riskLevel: 'low',
  },
  {
    id: 5,
    tournament: 'Bounty Hunter Special',
    organizer: 'BountyHunter',
    amount: 2000,
    investmentDate: '2025-06-04T11:20:00Z',
    status: 'pending',
    currentValue: 2000,
    roi: 0.0,
    expectedPayout: '2025-06-11T23:30:00Z',
    riskLevel: 'medium',
  },
];

export default function InvestmentTable() {
  const [isLoading, setIsLoading] = useState(false);

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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
      case 'active': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'completed': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'pending': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'cancelled': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const handleAction = async (action: string, investment: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`${action} action for ${investment.tournament} completed successfully!`);
    } catch (error) {
      alert(`Error performing ${action} action`);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      Header: 'Tournament',
      accessor: 'tournament',
      Cell: ({ row }: any) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.original.tournament}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            by {row.original.organizer}
          </div>
        </div>
      ),
    },
    {
      Header: 'Investment',
      accessor: 'amount',
      Cell: ({ value }: any) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      Header: 'Current Value',
      accessor: 'currentValue',
      Cell: ({ value, row }: any) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {formatCurrency(value)}
          </div>
          <div className={cn(
            'text-sm font-medium',
            row.original.roi > 0 ? 'text-green-500' : 
            row.original.roi < 0 ? 'text-red-500' : 'text-gray-500'
          )}>
            {row.original.roi > 0 ? '+' : ''}{row.original.roi.toFixed(1)}%
          </div>
        </div>
      ),
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ value }: any) => (
        <span className={cn(
          'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
          getStatusColor(value)
        )}>
          {value.toUpperCase()}
        </span>
      ),
    },
    {
      Header: 'Risk Level',
      accessor: 'riskLevel',
      Cell: ({ value }: any) => (
        <span className={cn(
          'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
          getRiskColor(value)
        )}>
          {value.toUpperCase()}
        </span>
      ),
    },
    {
      Header: 'Investment Date',
      accessor: 'investmentDate',
      Cell: ({ value }: any) => (
        <span className="text-gray-900 dark:text-white">
          {formatDate(value)}
        </span>
      ),
    },
    {
      Header: 'Expected Payout',
      accessor: 'expectedPayout',
      Cell: ({ value }: any) => (
        <span className="text-gray-900 dark:text-white">
          {formatDate(value)}
        </span>
      ),
    },
    {
      Header: 'Action',
      accessor: 'id',
      Cell: ({ row }: any) => (
        <div className="flex space-x-2">
          {row.original.status === 'active' && (
            <button 
              className="rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              disabled={isLoading}
              onClick={() => handleAction('Withdraw', row.original)}
            >
              {isLoading ? 'Processing...' : 'Withdraw'}
            </button>
          )}
          {row.original.status === 'completed' && (
            <button 
              className="rounded-lg bg-green-500 px-3 py-1 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
              disabled={isLoading}
              onClick={() => handleAction('Claim', row.original)}
            >
              {isLoading ? 'Processing...' : 'Claim'}
            </button>
          )}
          {row.original.status === 'pending' && (
            <button 
              className="rounded-lg bg-yellow-500 px-3 py-1 text-sm font-medium text-white hover:bg-yellow-600 disabled:opacity-50"
              disabled={isLoading}
              onClick={() => handleAction('Cancel', row.original)}
            >
              {isLoading ? 'Processing...' : 'Cancel'}
            </button>
          )}
        </div>
      ),
    },
  ];

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: investmentData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  // Calculate totals
  const totalInvested = investmentData.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investmentData.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalROI = ((totalCurrentValue - totalInvested) / totalInvested) * 100;

  return (
    <div className="rounded-lg bg-white shadow-card dark:bg-light-dark">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              My Investments
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track your tournament investments and returns
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Portfolio</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalCurrentValue)}
            </div>
            <div className={cn(
              'text-sm font-medium',
              totalROI > 0 ? 'text-green-500' : 
              totalROI < 0 ? 'text-red-500' : 'text-gray-500'
            )}>
              {totalROI > 0 ? '+' : ''}{totalROI.toFixed(1)}% ROI
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            {headerGroups.map((headerGroup, headerIndex) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={`header-${headerIndex}`}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={`column-${columnIndex}`}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.render('Header')}</span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                          <ChevronUpIcon className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronUpIcon className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="divide-y divide-gray-200 dark:divide-gray-700">
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={`row-${rowIndex}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  {row.cells.map((cell, cellIndex) => (
                    <td
                      {...cell.getCellProps()}
                      key={`cell-${rowIndex}-${cellIndex}`}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Show
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            {[5, 10, 20, 30].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            entries
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="rounded px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
          
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="rounded px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

