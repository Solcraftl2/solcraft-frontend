// src/components/PlatformFeesOverview.tsx
// Componente per la dashboard admin delle commissioni della piattaforma

import React, { useEffect, useState } from 'react';
import { feeService } from '../services/feeService';
import { PlatformFee } from '../types/fees';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registra i componenti Chart.js necessari
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const PlatformFeesOverview: React.FC = () => {
  const [feeStats, setFeeStats] = useState<{
    totalInitialFees: number;
    totalWinningsFees: number;
    totalFees: number;
    feesByMonth: { month: string; amount: number }[];
  } | null>(null);
  const [recentFees, setRecentFees] = useState<PlatformFee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Recupera le statistiche delle commissioni
        const stats = await feeService.getPlatformFeeStats();
        setFeeStats(stats);

        // Recupera le commissioni recenti
        const fees = await feeService.getAllPlatformFees();
        setRecentFees(fees.slice(0, 10)); // Mostra solo le 10 più recenti
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore nel recupero dei dati delle commissioni');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepara i dati per il grafico
  const chartData = {
    labels: feeStats?.feesByMonth.map(item => item.month) || [],
    datasets: [
      {
        label: 'Commissioni per Mese (SOL)',
        data: feeStats?.feesByMonth.map(item => item.amount) || [],
        backgroundColor: '#7e3af2',
        borderColor: '#6c2bd9',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e0e0e0'
        }
      },
      title: {
        display: true,
        text: 'Commissioni Mensili',
        color: '#e0e0e0'
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#b8b8c3'
        },
        grid: {
          color: '#3e3e4f'
        }
      },
      x: {
        ticks: {
          color: '#b8b8c3'
        },
        grid: {
          color: '#3e3e4f'
        }
      }
    }
  };

  if (isLoading) return <div>Caricamento statistiche commissioni...</div>;
  if (error) return <div>Errore: {error}</div>;

  return (
    <div style={{
      backgroundColor: '#1e1e2e',
      padding: '20px',
      borderRadius: '12px'
    }}>
      <h2 style={{ color: '#fff', marginTop: 0 }}>Dashboard Commissioni Piattaforma</h2>

      {/* Statistiche generali */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: '#252538',
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#b8b8c3', margin: '0 0 8px 0', fontSize: '14px' }}>Commissioni Iniziali</h3>
          <p style={{ color: '#7e3af2', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            {feeStats?.totalInitialFees.toFixed(2)} SOL
          </p>
        </div>
        <div style={{
          backgroundColor: '#252538',
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#b8b8c3', margin: '0 0 8px 0', fontSize: '14px' }}>Commissioni su Vincite</h3>
          <p style={{ color: '#7e3af2', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            {feeStats?.totalWinningsFees.toFixed(2)} SOL
          </p>
        </div>
        <div style={{
          backgroundColor: '#252538',
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#b8b8c3', margin: '0 0 8px 0', fontSize: '14px' }}>Commissioni Totali</h3>
          <p style={{ color: '#7e3af2', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            {feeStats?.totalFees.toFixed(2)} SOL
          </p>
        </div>
      </div>

      {/* Grafico commissioni mensili */}
      <div style={{
        backgroundColor: '#252538',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Tabella commissioni recenti */}
      <div style={{
        backgroundColor: '#252538',
        padding: '16px',
        borderRadius: '8px'
      }}>
        <h3 style={{ color: '#e0e0e0', marginTop: 0 }}>Commissioni Recenti</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            color: '#e0e0e0'
          }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #3e3e4f' }}>ID Torneo</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #3e3e4f' }}>Tipo</th>
                <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #3e3e4f' }}>Importo (SOL)</th>
                <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #3e3e4f' }}>Percentuale</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #3e3e4f' }}>Stato</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #3e3e4f' }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {recentFees.map(fee => (
                <tr key={fee.id}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #3e3e4f' }}>
                    {fee.tournament_id.substring(0, 8)}...
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #3e3e4f' }}>
                    {fee.fee_type === 'initial' ? 'Iniziale' : 'Vincite'}
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #3e3e4f' }}>
                    {fee.amount.toFixed(2)}
                  </td>
                  <td style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #3e3e4f' }}>
                    {fee.percentage.toFixed(1)}%
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #3e3e4f' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: getStatusColor(fee.status),
                      color: 'white'
                    }}>
                      {formatStatus(fee.status)}
                    </span>
                  </td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #3e3e4f' }}>
                    {new Date(fee.created_at).toLocaleDateString('it-IT')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Funzioni di utilità
function getStatusColor(status: string): string {
  switch (status) {
    case 'paid': return '#28a745'; // Verde
    case 'pending': return '#ffc107'; // Giallo
    case 'refunded': return '#6c757d'; // Grigio
    default: return '#6c757d'; // Grigio
  }
}

function formatStatus(status: string): string {
  switch (status) {
    case 'paid': return 'Pagata';
    case 'pending': return 'In attesa';
    case 'refunded': return 'Rimborsata';
    default: return status;
  }
}
