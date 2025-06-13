// src/services/tournamentService.ts
// Servizio per la gestione dei tornei

import { CreateTournamentRequest, Tournament, TournamentInvestment, TournamentResponse, InitialPaymentRequest, GuaranteePaymentRequest, ReportTournamentResultsRequest, InvestInTournamentRequest } from '../types/tournaments';
import { supabaseClient } from '../lib/supabaseClient';

export const tournamentService = {
  // Recupera tutti i tornei
  async getAllTournaments(): Promise<Tournament[]> {
    const { data, error } = await supabaseClient
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Tournament[];
  },

  // Recupera i tornei aperti per investimento
  async getOpenTournaments(): Promise<Tournament[]> {
    const { data, error } = await supabaseClient
      .from('tournaments')
      .select('*')
      .eq('status', 'funding_open')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Tournament[];
  },

  // Recupera un torneo specifico per ID
  async getTournamentById(id: string): Promise<Tournament> {
    const { data, error } = await supabaseClient
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data as Tournament;
  },

  // Recupera i tornei creati da un utente specifico
  async getTournamentsByCreator(userId: string): Promise<Tournament[]> {
    const { data, error } = await supabaseClient
      .from('tournaments')
      .select('*')
      .eq('creator_user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data as Tournament[];
  },

  // Recupera gli investimenti per un torneo specifico
  async getTournamentInvestments(tournamentId: string): Promise<TournamentInvestment[]> {
    const { data, error } = await supabaseClient
      .from('tournament_investments')
      .select('*')
      .eq('tournament_id', tournamentId);
    
    if (error) throw new Error(error.message);
    return data as TournamentInvestment[];
  },

  // Recupera l'investimento di un utente specifico in un torneo
  async getUserInvestmentInTournament(tournamentId: string, userId: string): Promise<TournamentInvestment | null> {
    const { data, error } = await supabaseClient
      .from('tournament_investments')
      .select('*')
      .eq('tournament_id', tournamentId)
      .eq('investor_id', userId)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return data as TournamentInvestment | null;
  },

  // Crea un nuovo torneo
  async createTournament(tournamentData: CreateTournamentRequest): Promise<TournamentResponse> {
    try {
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tournamentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Errore nella creazione del torneo' };
      }
      
      const data = await response.json();
      return { success: true, tournament: data.tournament };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Errore sconosciuto' };
    }
  },

  // Paga la commissione iniziale per un torneo
  async payInitialFee(paymentData: InitialPaymentRequest): Promise<TournamentResponse> {
    try {
      const response = await fetch('/api/tournaments/pay_initial_fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Errore nel pagamento della commissione iniziale' };
      }
      
      const data = await response.json();
      return { success: true, tournament: data.tournament };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Errore sconosciuto' };
    }
  },

  // Paga la garanzia per un torneo
  async payGuarantee(paymentData: GuaranteePaymentRequest): Promise<TournamentResponse> {
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
      return { success: true, tournament: data.tournament };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Errore sconosciuto' };
    }
  },

  // Investi in un torneo
  async investInTournament(investmentData: InvestInTournamentRequest): Promise<TournamentResponse> {
    try {
      const response = await fetch(`/api/tournaments/${investmentData.tournament_id}/invest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: investmentData.amount }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Errore nell\'investimento' };
      }
      
      const data = await response.json();
      return { success: true, tournament: data.tournament };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Errore sconosciuto' };
    }
  },

  // Riporta i risultati di un torneo
  async reportTournamentResults(resultsData: ReportTournamentResultsRequest): Promise<TournamentResponse> {
    try {
      const response = await fetch('/api/tournaments/report_results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultsData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Errore nel riportare i risultati del torneo' };
      }
      
      const data = await response.json();
      return { success: true, tournament: data.tournament };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Errore sconosciuto' };
    }
  }
};
