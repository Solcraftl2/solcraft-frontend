// src/services/feeService.ts
// Servizio per la gestione delle commissioni della piattaforma

import { supabaseClient } from '../lib/supabaseClient';
import { PlayerRanking, RANKING_CONFIG } from '../types/player';
import { FeePaymentRequest, FeePaymentResponse, PlatformFee, FeeCalculation } from '../types/fees';

export const feeService = {
  // Calcola le commissioni in base al ranking e al target pool
  calculateFees(targetPoolAmount: number, playerRanking: PlayerRanking): FeeCalculation {
    const rankingConfig = RANKING_CONFIG[playerRanking];
    return {
      initialFeePct: rankingConfig.initialFeePct,
      initialFeeAmount: targetPoolAmount * rankingConfig.initialFeePct,
      winningsFeePct: rankingConfig.winningsFeePct
    };
  },

  // Recupera tutte le commissioni per un torneo specifico
  async getTournamentFees(tournamentId: string): Promise<PlatformFee[]> {
    const { data, error } = await supabaseClient
      .from('platform_fees')
      .select('*')
      .eq('tournament_id', tournamentId);
    
    if (error) throw new Error(error.message);
    return data as PlatformFee[];
  },

  // Paga una commissione (iniziale o sulle vincite)
  async payFee(paymentData: FeePaymentRequest): Promise<FeePaymentResponse> {
    try {
      const endpoint = paymentData.fee_type === 'initial' 
        ? '/api/tournaments/pay_initial_fee'
        : '/api/tournaments/pay_winnings_fee';
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tournament_id: paymentData.tournament_id,
          amount: paymentData.amount
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || `Errore nel pagamento della commissione ${paymentData.fee_type}` };
      }
      
      const data = await response.json();
      return { 
        success: true, 
        fee_id: data.fee_id,
        transaction_hash: data.transaction_hash
      };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Errore sconosciuto' };
    }
  },

  // Recupera tutte le commissioni pagate dalla piattaforma
  async getAllPlatformFees(): Promise<PlatformFee[]> {
    const { data, error } = await supabaseClient
      .from('platform_fees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as PlatformFee[];
  },

  // Recupera le statistiche delle commissioni per la dashboard admin
  async getPlatformFeeStats(): Promise<{
    totalInitialFees: number;
    totalWinningsFees: number;
    totalFees: number;
    feesByMonth: { month: string; amount: number }[];
  }> {
    // Questa è una simulazione, in un'implementazione reale dovrebbe fare una query aggregata
    const { data, error } = await supabaseClient
      .from('platform_fees')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    
    const fees = data as PlatformFee[];
    const initialFees = fees.filter(fee => fee.fee_type === 'initial' && fee.status === 'paid');
    const winningsFees = fees.filter(fee => fee.fee_type === 'winnings' && fee.status === 'paid');
    
    const totalInitialFees = initialFees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalWinningsFees = winningsFees.reduce((sum, fee) => sum + fee.amount, 0);
    
    // Raggruppa per mese (semplificato)
    const feesByMonth: { [key: string]: number } = {};
    fees.forEach(fee => {
      if (fee.status !== 'paid') return;
      
      const date = new Date(fee.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!feesByMonth[monthKey]) {
        feesByMonth[monthKey] = 0;
      }
      
      feesByMonth[monthKey] += fee.amount;
    });
    
    const feesByMonthArray = Object.entries(feesByMonth).map(([month, amount]) => ({
      month,
      amount
    })).sort((a, b) => a.month.localeCompare(b.month));
    
    return {
      totalInitialFees,
      totalWinningsFees,
      totalFees: totalInitialFees + totalWinningsFees,
      feesByMonth: feesByMonthArray
    };
  }
};
