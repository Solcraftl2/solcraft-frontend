// src/components/PlayerTournamentDashboard.tsx
// Dashboard per i tornei creati dal giocatore

import React, { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Tournament } from '../types/tournaments';
import { InitialFeePaymentForm } from './InitialFeePaymentForm';
import { GuaranteePaymentForm } from './GuaranteePaymentForm';
import { PlayerRankingBadge } from './PlayerRankingBadge';

export const PlayerTournamentDashboard: React.FC = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlayerTournaments = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('creator_user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setTournaments(data as Tournament[] || []);
    } catch (error) {
      console.error('Error fetching player tournaments:', error);
      // toast.error('Errore nel caricare i tuoi tornei.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayerTournaments();
  }, [user]);

  if (isLoading) return <div>Caricamento tornei...</div>;
  if (!user) return <div>Devi essere loggato per vedere i tuoi tornei.</div>;
  if (tournaments.length === 0) return <div>Non hai ancora creato nessun torneo.</div>;

  return (
    <div className="player-tournament-dashboard" style={{
      backgroundColor: '#1e1e2e',
      padding: '20px',
      borderRadius: '12px'
    }}>
      <h2 style={{ color: '#fff' }}>I Miei Tornei Creati</h2>
      {tournaments.map(tournament => (
        <div key={tournament.id} style={{
          backgroundColor: '#252538',
          padding: '15px',
          marginBottom: '15px',
          borderRadius: '8px',
          color: '#e0e0e0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#fff', margin: '0' }}>{tournament.name}</h3>
            <span style={{
              display: 'inline-block',
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              color: 'white',
              backgroundColor: getStatusColor(tournament.status)
            }}>
              {formatStatus(tournament.status)}
            </span>
          </div>
          
          <div style={{ marginTop: '10px' }}>
            <PlayerRankingBadge ranking={tournament.player_ranking_at_creation} />
          </div>
          
          <p>Target Pool: {tournament.target_pool_amount} SOL</p>
          <p>Pool Attuale: {tournament.current_pool_amount} SOL</p>
          
          {/* Barra di progresso per la pool */}
          <div style={{
            height: '10px',
            backgroundColor: '#3e3e4f',
            borderRadius: '5px',
            margin: '10px 0',
            overflow: 'hidden'
          }}>
            <div 
              style={{
                height: '100%',
                backgroundColor: '#7e3af2',
                borderRadius: '5px',
                transition: 'width 0.3s ease-in-out',
                width: `${Math.min(100, (tournament.current_pool_amount / tournament.target_pool_amount) * 100)}%`
              }}
            ></div>
          </div>

          {/* Dettagli Commissione Iniziale */} 
          <p>Commissione Iniziale: {tournament.initial_platform_fee_amount.toFixed(2)} SOL ({tournament.initial_platform_fee_pct * 100}%) - {tournament.initial_platform_fee_paid ? 'Pagata' : 'Da Pagare'}</p>
          {tournament.status === 'pending_initial_payment' && !tournament.initial_platform_fee_paid && (
            <InitialFeePaymentForm 
              tournamentId={tournament.id}
              tournamentName={tournament.name}
              targetPoolAmount={tournament.target_pool_amount}
              playerRanking={tournament.player_ranking_at_creation}
              initialFeeAmount={tournament.initial_platform_fee_amount}
              onPaymentComplete={fetchPlayerTournaments} 
            />
          )}

          {/* Dettagli Garanzia */} 
          <p>Garanzia Richiesta: {tournament.player_guarantee_amount_required.toFixed(2)} SOL ({tournament.player_guarantee_pct * 100}%) - {tournament.player_guarantee_paid ? 'Depositata' : 'Da Depositare'}</p>
          {tournament.status === 'pending_guarantee' && !tournament.player_guarantee_paid && (
            <GuaranteePaymentForm 
              tournamentId={tournament.id}
              tournamentName={tournament.name}
              targetPoolAmount={tournament.target_pool_amount}
              playerRanking={tournament.player_ranking_at_creation}
              onPaymentComplete={fetchPlayerTournaments} 
            />
          )}
          
          {/* Altre azioni e informazioni in base allo stato del torneo */} 
          {tournament.status === 'awaiting_results' && (
            <button style={{
              backgroundColor: '#7e3af2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '10px'
            }}>
              Riporta Risultati
            </button>
          )}

          <hr style={{ borderColor: '#3e3e4f', marginTop: '20px' }} />
        </div>
      ))}
    </div>
  );
};

// Funzioni di utilità
function getStatusColor(status: string): string {
  switch (status) {
    case 'funding_open': return '#28a745'; // Verde
    case 'pending_initial_payment':
    case 'pending_guarantee': return '#ffc107'; // Giallo
    case 'funding_complete': return '#17a2b8'; // Ciano
    case 'funds_transferred_to_player':
    case 'in_progress': return '#007bff'; // Blu
    case 'awaiting_results': return '#6f42c1'; // Viola
    case 'completed_won': return '#28a745'; // Verde
    case 'completed_lost': return '#dc3545'; // Rosso
    case 'funding_failed':
    case 'cancelled': return '#6c757d'; // Grigio
    default: return '#6c757d'; // Grigio
  }
}

function formatStatus(status: string): string {
  switch (status) {
    case 'pending_initial_payment': return 'In attesa di commissione';
    case 'pending_guarantee': return 'In attesa di garanzia';
    case 'funding_open': return 'Raccolta fondi aperta';
    case 'funding_complete': return 'Raccolta fondi completata';
    case 'funds_transferred_to_player': return 'Fondi trasferiti';
    case 'in_progress': return 'In corso';
    case 'awaiting_results': return 'In attesa di risultati';
    case 'completed_won': return 'Completato (Vinto)';
    case 'completed_lost': return 'Completato (Perso)';
    case 'funding_failed': return 'Raccolta fondi fallita';
    case 'cancelled': return 'Annullato';
    default: return status.replace(/_/g, ' ');
  }
}
