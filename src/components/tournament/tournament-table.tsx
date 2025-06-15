'use client';

import { useState, useEffect } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import cn from '@/utils/cn';
import { apiService, Tournament } from '@/services/apiService';

interface TournamentTableData {
  id: string;
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
}

export default function TournamentTable() {
  const [tournaments, setTournaments] = useState<TournamentTableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiTournaments = await apiService.getTournaments();
      
      // Trasforma i dati API nel formato richiesto dalla tabella
      const transformedData: TournamentTableData[] = apiTournaments.map((tournament) => ({
        id: tournament.id,
        name: tournament.name,
        organizer: 'Unknown Organizer', // TODO: Aggiungere organizer al backend
        buyIn: parseFloat(tournament.buy_in),
        prizePool: parseFloat(tournament.total_prize),
        startTime: tournament.start_date,
        status: tournament.status,
        participants: 0, // TODO: Aggiungere participants al backend
        maxParticipants: tournament.max_participants || 0,
        investmentPool: parseFloat(tournament.total_prize) * 0.1, // 10% del prize pool
        minInvestment: Math.max(parseFloat(tournament.buy_in) * 0.1, 25), // 10% del buy-in, minimo $25
        expectedROI: Math.random() * 20 + 5, // TODO: Calcolo ROI reale
        riskLevel: parseFloat(tournament.buy_in) > 1000 ? 'high' : parseFloat(tournament.buy_in) > 100 ? 'medium' : 'low',
        organizerRating: 4.0 + Math.random() * 1, // TODO: Rating reale organizer
      }));

      setTournaments(transformedData);
    } catch (err) {
      console.error('Error loading tournaments:', err);
      setError('Failed to load tournaments. Please try again.');
      setTournaments([]); // Mostra lista vuota in caso di errore
    } finally {
      setLoading(false);
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
      data: tournaments, // Usa i dati reali dal backend
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  // Loading state
  if (loading) {
    return (
      <div className="rounded-lg bg-white shadow-card dark:bg-light-dark">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available Tournaments
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading tournaments...
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-lg bg-white shadow-card dark:bg-light-dark">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available Tournaments
          </h3>
          <p className="text-sm text-red-500">
            {error}
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <button
            onClick={loadTournaments}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (tournaments.length === 0) {
    return (
      <div className="rounded-lg bg-white shadow-card dark:bg-light-dark">
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available Tournaments
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No tournaments available at the moment
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No tournaments found. Check back later!
            </p>
            <button
              onClick={loadTournaments}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

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

