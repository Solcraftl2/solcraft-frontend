// src/components/PlayerTournamentDashboard.tsx
// Dashboard corretto per i tornei creati dal giocatore con gestione errori robusta

import React, { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Tournament } from '../types/tournaments';
import { InitialFeePaymentForm } from './InitialFeePaymentForm';
import { GuaranteePaymentForm } from './GuaranteePaymentForm';
import { PlayerRankingBadge } from './PlayerRankingBadge';
import { tournamentService } from '../services/tournamentService';
import toast from 'react-hot-toast';

interface PlayerTournamentDashboardProps {
  className?: string;
}

export const PlayerTournamentDashboard: React.FC<PlayerTournamentDashboardProps> = ({ 
  className = "" 
}) => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerTournaments = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const userTournaments = await tournamentService.getTournamentsByCreator(user.id);
      setTournaments(userTournaments);
    } catch (error) {
      console.error('Error fetching player tournaments:', error);
      setError('Errore nel caricare i tuoi tornei. Riprova più tardi.');
      toast.error('Errore nel caricare i tuoi tornei');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = async () => {
    toast.success('Pagamento completato con successo!');
    await fetchPlayerTournaments();
  };

  const handleReportResults = async (tournamentId: string) => {
    try {
      // This would open a modal or navigate to a results reporting page
      toast.info('Funzionalità di report risultati in arrivo');
    } catch (error) {
      toast.error('Errore nel riportare i risultati');
    }
  };

  const handleCancelTournament = async (tournamentId: string) => {
    try {
      const result = await tournamentService.cancelTournament(tournamentId);
      if (result.success) {
        await fetchPlayerTournaments();
      }
    } catch (error) {
      toast.error('Errore nella cancellazione del torneo');
    }
  };

  useEffect(() => {
    fetchPlayerTournaments();
  }, [user]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <span className="ml-2 text-gray-300">Caricamento tornei...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-yellow-400">Devi essere loggato per vedere i tuoi tornei.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={fetchPlayerTournaments}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-2">Nessun torneo creato</h3>
          <p className="text-gray-400 mb-4">Non hai ancora creato nessun torneo.</p>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Crea il tuo primo torneo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`player-tournament-dashboard ${className}`} style={{
      backgroundColor: '#1e1e2e',
      padding: '20px',
      borderRadius: '12px'
    }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">I Miei Tornei Creati</h2>
        <div className="text-sm text-gray-400">
          {tournaments.length} torneo{tournaments.length !== 1 ? 'i' : ''}
        </div>
      </div>

      <div className="space-y-4">
        {tournaments.map(tournament => (
          <TournamentCard
            key={tournament.id}
            tournament={tournament}
            onPaymentComplete={handlePaymentComplete}
            onReportResults={handleReportResults}
            onCancelTournament={handleCancelTournament}
          />
        ))}
      </div>
    </div>
  );
};

interface TournamentCardProps {
  tournament: Tournament;
  onPaymentComplete: () => void;
  onReportResults: (tournamentId: string) => void;
  onCancelTournament: (tournamentId: string) => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onPaymentComplete,
  onReportResults,
  onCancelTournament
}) => {
  const progressPercentage = Math.min(100, (tournament.current_pool_amount / tournament.target_pool_amount) * 100);

  return (
    <div style={{
      backgroundColor: '#252538',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #3e3e4f'
    }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">{tournament.name}</h3>
          {tournament.description && (
            <p className="text-gray-400 text-sm">{tournament.description}</p>
          )}
        </div>
        <StatusBadge status={tournament.status} />
      </div>

      {/* Ranking Badge */}
      <div className="mb-4">
        <PlayerRankingBadge ranking={tournament.player_ranking_at_creation} />
      </div>

      {/* Pool Information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-sm">Target Pool</p>
          <p className="text-white font-semibold">{tournament.target_pool_amount} SOL</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Pool Attuale</p>
          <p className="text-white font-semibold">{tournament.current_pool_amount} SOL</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progresso Raccolta Fondi</span>
          <span>{progressPercentage.toFixed(1)}%</span>
        </div>
        <div style={{
          height: '8px',
          backgroundColor: '#3e3e4f',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div 
            style={{
              height: '100%',
              backgroundColor: '#7e3af2',
              borderRadius: '4px',
              transition: 'width 0.3s ease-in-out',
              width: `${progressPercentage}%`
            }}
          />
        </div>
      </div>

      {/* Fee Information */}
      <div className="space-y-2 mb-4">
        <FeeInfo
          label="Commissione Iniziale"
          amount={tournament.initial_platform_fee_amount}
          percentage={tournament.initial_platform_fee_pct * 100}
          paid={tournament.initial_platform_fee_paid}
        />
        <FeeInfo
          label="Garanzia Richiesta"
          amount={tournament.player_guarantee_amount_required}
          percentage={tournament.player_guarantee_pct * 100}
          paid={tournament.player_guarantee_paid}
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {tournament.status === 'pending_initial_payment' && !tournament.initial_platform_fee_paid && (
          <InitialFeePaymentForm 
            tournamentId={tournament.id}
            tournamentName={tournament.name}
            targetPoolAmount={tournament.target_pool_amount}
            playerRanking={tournament.player_ranking_at_creation}
            initialFeeAmount={tournament.initial_platform_fee_amount}
            onPaymentComplete={onPaymentComplete} 
          />
        )}

        {tournament.status === 'pending_guarantee' && !tournament.player_guarantee_paid && (
          <GuaranteePaymentForm 
            tournamentId={tournament.id}
            tournamentName={tournament.name}
            targetPoolAmount={tournament.target_pool_amount}
            playerRanking={tournament.player_ranking_at_creation}
            onPaymentComplete={onPaymentComplete} 
          />
        )}

        {tournament.status === 'awaiting_results' && (
          <button 
            onClick={() => onReportResults(tournament.id)}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Riporta Risultati
          </button>
        )}

        {['pending_initial_payment', 'pending_guarantee', 'funding_open'].includes(tournament.status) && (
          <button 
            onClick={() => onCancelTournament(tournament.id)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Cancella Torneo
          </button>
        )}
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'funding_open': 
        return { color: '#28a745', text: 'Raccolta Aperta' };
      case 'pending_initial_payment':
        return { color: '#ffc107', text: 'In attesa di commissione' };
      case 'pending_guarantee': 
        return { color: '#ffc107', text: 'In attesa di garanzia' };
      case 'funding_complete': 
        return { color: '#17a2b8', text: 'Raccolta Completata' };
      case 'funds_transferred_to_player':
      case 'in_progress': 
        return { color: '#007bff', text: 'In Corso' };
      case 'awaiting_results': 
        return { color: '#6f42c1', text: 'In attesa di risultati' };
      case 'completed_won': 
        return { color: '#28a745', text: 'Completato (Vinto)' };
      case 'completed_lost': 
        return { color: '#dc3545', text: 'Completato (Perso)' };
      case 'funding_failed':
      case 'cancelled': 
        return { color: '#6c757d', text: 'Cancellato' };
      default: 
        return { color: '#6c757d', text: status.replace(/_/g, ' ') };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '600',
      color: 'white',
      backgroundColor: config.color
    }}>
      {config.text}
    </span>
  );
};

interface FeeInfoProps {
  label: string;
  amount: number;
  percentage: number;
  paid: boolean;
}

const FeeInfo: React.FC<FeeInfoProps> = ({ label, amount, percentage, paid }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-400">{label}:</span>
    <div className="text-right">
      <span className="text-white font-medium">
        {amount.toFixed(2)} SOL ({percentage.toFixed(1)}%)
      </span>
      <span className={`ml-2 px-2 py-1 rounded text-xs ${
        paid 
          ? 'bg-green-500/20 text-green-400' 
          : 'bg-yellow-500/20 text-yellow-400'
      }`}>
        {paid ? 'Pagato' : 'Da Pagare'}
      </span>
    </div>
  </div>
);

