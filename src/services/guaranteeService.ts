// src/services/guaranteeService.ts
// Servizio per la gestione delle garanzie dei giocatori

import { supabaseClient } from '../lib/supabaseClient';
import { PlayerRanking, RANKING_CONFIG } from '../types/player';
import { GuaranteePaymentRequest } from '../types/tournaments';

export interface PlayerGuarantee {
  id: string;
  tournament_id: string;
  player_id: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'active' | 'returned' | 'forfeited';
  transaction_hash?: string;
  created_at: string;
  updated_at: string;
}

export const guaranteeService = {
  // Calcola l'importo della garanzia in base al ranking e al target pool
  calculateGuaranteeAmount(targetPoolAmount: number, playerRanking: PlayerRanking): number {
    const rankingConfig = RANKING_CONFIG[playerRanking];
    return targetPoolAmount * rankingConfig.guaranteePct;
  },

  // Recupera la garanzia di un giocatore per un torneo specifico
  async getPlayerGuarantee(tournamentId: string, playerId: string): Promise<PlayerGuarantee | null> {
    const { data, error } = await supabaseClient
      .from('player_guarantees')
      .select('*')
      .eq('tournament_id', tournamentId)
      .eq('player_id', playerId)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return data as PlayerGuarantee | null;
  },

  // Paga la garanzia per un torneo
  async payGuarantee(paymentData: GuaranteePaymentRequest): Promise<{ success: boolean; guarantee_id?: string; error?: string }> {
    try {
      const response = await fetch('/api/tournaments/pay_guarantee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Errore nel pagamento della garanzia' };
      }
      
      const data = await response.json();
      return { success: true, guarantee_id: data.guarantee_id };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Errore sconosciuto' };
    }
  },

  // Recupera tutte le garanzie attive di un giocatore
  async getActivePlayerGuarantees(playerId: string): Promise<PlayerGuarantee[]> {
    const { data, error } = await supabaseClient
      .from('player_guarantees')
      .select('*')
      .eq('player_id', playerId)
      .eq('status', 'active');
    
    if (error) throw new Error(error.message);
    return data as PlayerGuarantee[];
  },

  // Recupera lo storico delle garanzie di un giocatore
  async getPlayerGuaranteeHistory(playerId: string): Promise<PlayerGuarantee[]> {
    const { data, error } = await supabaseClient
      .from('player_guarantees')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as PlayerGuarantee[];
  }
};
