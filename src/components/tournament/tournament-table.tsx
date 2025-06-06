'use client';

import { useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import cn from '@/utils/cn';

const tournamentData = [
  {
    id: 1,
    name: 'Sunday Million',
    organizer: 'PokerPro',
    buyIn: 215,
    prizePool: 1000000,
    startTime: '2025-06-08T20:00:00Z',
    status: 'upcoming',
    participants: 4500,
    maxParticipants: 5000,
    investmentPool: 250000,
    minInvestment: 100,
    expectedROI: 18.5,
    riskLevel: 'medium',
    organizerRating: 4.8,
  },
  {
    id: 2,
    name: 'High Roller Championship',
    organizer: 'ChampionAce',
    buyIn: 5000,
    prizePool: 2500000,
    startTime: '2025-06-10T18:00:00Z',
    status: 'upcoming',
    participants: 450,
    maxParticipants: 500,
    investmentPool: 500000,
    minInvestment: 500,
    expectedROI: 25.2,
    riskLevel: 'high',
    organizerRating: 4.9,
  },
  {
    id: 3,
    name: 'Daily Grind Series',
    organizer: 'TourneyKing',
    buyIn: 55,
    prizePool: 100000,
    startTime: '2025-06-07T19:00:00Z',
    status: 'live',
    participants: 1800,
    maxParticipants: 2000,
    investmentPool: 75000,
    minInvestment: 50,
    expectedROI: 12.8,
    riskLevel: 'low',
    organizerRating: 4.6,
  },
  {
    id: 4,
    name: 'Micro Stakes Marathon',
    organizer: 'MicroMaster',
    buyIn: 11,
    prizePool: 25000,
    startTime: '2025-06-09T16:00:00Z',
    status: 'upcoming',
    participants: 2200,
    maxParticipants: 2500,
    investmentPool: 15000,
    minInvestment: 25,
    expectedROI: 8.5,
    riskLevel: 'low',
    organizerRating: 4.4,
  },
  {
    id: 5,
    name: 'Bounty Hunter Special',
    organizer: 'BountyHunter',
    buyIn: 320,
    prizePool: 500000,
    startTime: '2025-06-11T21:00:00Z',
    status: 'upcoming',
    participants: 1500,
    maxParticipants: 1600,
    investmentPool: 120000,
    minInvestment: 150,
    expectedROI: 22.1,
    riskLevel: 'medium',
    organizerRating: 4.7,
  },
];

export default function TournamentTable() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
      case 'live': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'upcoming': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'completed': return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const columns = [
    {
      Header: 'Tournament',
      accessor: 'name',
      Cell: ({ row }: any) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {row.original.name}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            by {row.original.organizer}
          </div>
        </div>
      ),
    },
    {
      Header: 'Buy-in',
      accessor: 'buyIn',
      Cell: ({ value }: any) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      Header: 'Prize Pool',
      accessor: 'prizePool',
      Cell: ({ value }: any) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(value)}
        </span>
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
      Header: 'Expected ROI',
      accessor: 'expectedROI',
      Cell: ({ value }: any) => (
        <span className="font-medium text-green-500">
          +{value}%
        </span>
      ),
    },
    {
      Header: 'Risk',
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
      Header: 'Min Investment',
      accessor: 'minInvestment',
      Cell: ({ value }: any) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      Header: 'Action',
      accessor: 'id',
      Cell: ({ row }: any) => (
        <button
          className={cn(
            'rounded-lg px-3 py-1 text-sm font-medium transition-colors',
            row.original.status === 'completed'
              ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
              : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
          )}
          disabled={row.original.status === 'completed'}
          onClick={() => {
            alert(`Investing in ${row.original.name}...`);
          }}
        >
          {row.original.status === 'completed' ? 'Completed' : 'Invest'}
        </button>
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
      data: tournamentData,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="rounded-lg bg-white shadow-card dark:bg-light-dark">
      <div className="px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Available Tournaments
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Invest in poker tournaments and earn returns based on performance
        </p>
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

