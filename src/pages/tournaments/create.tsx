// src/pages/tournaments/create.tsx
// Pagina per la creazione di un nuovo torneo

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { tournamentService } from '../../services/tournamentService';
import { playerProfileService } from '../../services/playerProfileService';
import { PlayerRanking, Player } from '../../types/player';
import { PlayerRankingBadge } from '../../components/PlayerRankingBadge';

export default function CreateTournament() {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gameType, setGameType] = useState('Poker');
  const [targetPoolAmount, setTargetPoolAmount] = useState('');
  const [tournamentBuyIn, setTournamentBuyIn] = useState('');
  const [externalTournamentUrl, setExternalTournamentUrl] = useState('');
  const [fundingEndTime, setFundingEndTime] = useState('');
  
  const [playerProfile, setPlayerProfile] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Recupera il profilo del giocatore
  useEffect(() => {
    if (!user) return;
    
    const fetchPlayerProfile = async () => {
      try {
        const profile = await playerProfileService.getPlayerProfile(user.id);
        setPlayerProfile(profile);
      } catch (error) {
        console.error('Error fetching player profile:', error);
      }
    };
    
    fetchPlayerProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Devi essere loggato per creare un torneo.');
      return;
    }
    
    if (!playerProfile) {
      setError('Devi completare il tuo profilo giocatore prima di creare un torneo.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await tournamentService.createTournament({
        name,
        description,
        game_type: gameType,
        target_pool_amount: parseFloat(targetPoolAmount),
        tournament_buy_in: tournamentBuyIn ? parseFloat(tournamentBuyIn) : undefined,
        external_tournament_url: externalTournamentUrl || undefined,
        player_ranking: playerProfile.ranking,
        funding_end_time: fundingEndTime || undefined
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Errore nella creazione del torneo');
      }
      
      setSuccess(true);
      
      // Reindirizza alla pagina del torneo dopo 2 secondi
      setTimeout(() => {
        router.push(`/tournaments/${result.tournament?.id}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setIsLoading(false);
    }
  };

  // Calcola le commissioni e la garanzia in base al ranking
  const calculateFees = () => {
    if (!playerProfile || !targetPoolAmount) return null;
    
    const amount = parseFloat(targetPoolAmount);
    if (isNaN(amount)) return null;
    
    const ranking = playerProfile.ranking;
    const rankingConfig = {
      'PLATINUM': { initialFeePct: 0.05, guaranteePct: 0.20 },
      'GOLD': { initialFeePct: 0.07, guaranteePct: 0.25 },
      'SILVER': { initialFeePct: 0.08, guaranteePct: 0.30 },
      'BRONZE': { initialFeePct: 0.10, guaranteePct: 0.40 }
    };
    
    const config = rankingConfig[ranking];
    return {
      initialFeeAmount: amount * config.initialFeePct,
      initialFeePct: config.initialFeePct * 100,
      guaranteeAmount: amount * config.guaranteePct,
      guaranteePct: config.guaranteePct * 100
    };
  };
  
  const fees = calculateFees();

  return (
    <div style={{
      backgroundColor: '#1e1e2e',
      padding: '20px',
      borderRadius: '12px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ color: '#fff', marginTop: 0 }}>Crea Nuovo Torneo</h1>
      
      {!user ? (
        <div style={{
          backgroundColor: '#252538',
          padding: '16px',
          borderRadius: '8px',
          color: '#e0e0e0'
        }}>
          Devi essere loggato per creare un torneo.
        </div>
      ) : !playerProfile ? (
        <div style={{
          backgroundColor: '#252538',
          padding: '16px',
          borderRadius: '8px',
          color: '#e0e0e0'
        }}>
          Devi completare il tuo profilo giocatore prima di creare un torneo.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{
            backgroundColor: '#252538',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#e0e0e0', marginTop: 0 }}>Il tuo ranking</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <PlayerRankingBadge ranking={playerProfile.ranking} size="large" />
              <div>
                <p style={{ color: '#b8b8c3', margin: '0' }}>
                  Tornei giocati: {playerProfile.tournaments_played}
                </p>
                <p style={{ color: '#b8b8c3', margin: '0' }}>
                  Win rate: {(playerProfile.win_rate * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#e0e0e0' }}>
              Nome del torneo *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#252538',
                border: '1px solid #3e3e4f',
                borderRadius: '6px',
                color: '#e0e0e0'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#e0e0e0' }}>
              Descrizione
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#252538',
                border: '1px solid #3e3e4f',
                borderRadius: '6px',
                color: '#e0e0e0',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#e0e0e0' }}>
              Tipo di gioco *
            </label>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#252538',
                border: '1px solid #3e3e4f',
                borderRadius: '6px',
                color: '#e0e0e0'
              }}
            >
              <option value="Poker">Poker</option>
              <option value="Blackjack">Blackjack</option>
              <option value="Roulette">Roulette</option>
              <option value="Altro">Altro</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#e0e0e0' }}>
              Target Pool (SOL) *
            </label>
            <input
              type="number"
              value={targetPoolAmount}
              onChange={(e) => setTargetPoolAmount(e.target.value)}
              required
              min="0.1"
              step="0.1"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#252538',
                border: '1px solid #3e3e4f',
                borderRadius: '6px',
                color: '#e0e0e0'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#e0e0e0' }}>
              Buy-in del torneo (SOL)
            </label>
            <input
              type="number"
              value={tournamentBuyIn}
              onChange={(e) => setTournamentBuyIn(e.target.value)}
              min="0"
              step="0.1"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#252538',
                border: '1px solid #3e3e4f',
                borderRadius: '6px',
                color: '#e0e0e0'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#e0e0e0' }}>
              URL del torneo esterno
            </label>
            <input
              type="url"
              value={externalTournamentUrl}
              onChange={(e) => setExternalTournamentUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#252538',
                border: '1px solid #3e3e4f',
                borderRadius: '6px',
                color: '#e0e0e0'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#e0e0e0' }}>
              Data fine raccolta fondi
            </label>
            <input
              type="datetime-local"
              value={fundingEndTime}
              onChange={(e) => setFundingEndTime(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#252538',
                border: '1px solid #3e3e4f',
                borderRadius: '6px',
                color: '#e0e0e0'
              }}
            />
          </div>
          
          {fees && (
            <div style={{
              backgroundColor: '#252538',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: '#e0e0e0', marginTop: 0 }}>Riepilogo commissioni e garanzia</h3>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#b8b8c3' }}>Commissione iniziale ({fees.initialFeePct.toFixed(1)}%):</span>
                  <span style={{ color: '#7e3af2', fontWeight: 'bold' }}>{fees.initialFeeAmount.toFixed(2)} SOL</span>
                </div>
                <div style={{ fontSize: '12px', color: '#b8b8c3' }}>
                  Da pagare subito dopo la creazione del torneo
                </div>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#b8b8c3' }}>Garanzia richiesta ({fees.guaranteePct.toFixed(1)}%):</span>
                  <span style={{ color: '#7e3af2', fontWeight: 'bold' }}>{fees.guaranteeAmount.toFixed(2)} SOL</span>
                </div>
                <div style={{ fontSize: '12px', color: '#b8b8c3' }}>
                  Da depositare dopo il pagamento della commissione iniziale
                </div>
              </div>
              
              <div style={{ fontSize: '12px', color: '#ff4d4f' }}>
                Nota: La commissione sulle vincite sarà del 15-20% in base al tuo ranking
              </div>
            </div>
          )}
          
          {error && (
            <div style={{ 
              backgroundColor: 'rgba(255, 77, 79, 0.2)', 
              color: '#ff4d4f',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ 
              backgroundColor: 'rgba(82, 196, 26, 0.2)', 
              color: '#52c41a',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              Torneo creato con successo! Verrai reindirizzato alla pagina del torneo...
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading || success}
            style={{
              backgroundColor: '#7e3af2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '12px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading || success ? 'not-allowed' : 'pointer',
              opacity: isLoading || success ? 0.7 : 1,
              width: '100%',
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? 'Creazione in corso...' : 'Crea Torneo'}
          </button>
        </form>
      )}
    </div>
  );
}
