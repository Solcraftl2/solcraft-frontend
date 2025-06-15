// src/services/tournamentService.ts
// Servizio corretto per la gestione dei tornei con gestione errori robusta

import { 
  CreateTournamentRequest, 
  Tournament, 
  TournamentInvestment, 
  TournamentResponse, 
  InitialPaymentRequest, 
  GuaranteePaymentRequest, 
  ReportTournamentResultsRequest, 
  InvestInTournamentRequest,
  ApiResponse 
} from '../types/tournaments';
import { supabaseClient } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

class TournamentServiceClass {
  private apiBaseUrl = '/api/tournaments';

  // Metodo per gestire errori API
  private handleApiError(error: any): string {
    console.error('API Error:', error);
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Si è verificato un errore imprevisto';
  }

  // Metodo per fare richieste API
  private async makeApiRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleApiError(error),
      };
    }
  }

  // Recupera tutti i tornei
  async getAllTournaments(): Promise<Tournament[]> {
    try {
      const { data, error } = await supabaseClient
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Errore nel caricare i tornei');
        throw new Error(error.message);
      }
      
      return data as Tournament[] || [];
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      toast.error('Errore nel caricare i tornei');
      return [];
    }
  }

  // Recupera i tornei aperti per investimento
  async getOpenTournaments(): Promise<Tournament[]> {
    try {
      const { data, error } = await supabaseClient
        .from('tournaments')
        .select('*')
        .eq('status', 'funding_open')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Errore nel caricare i tornei aperti');
        throw new Error(error.message);
      }
      
      return data as Tournament[] || [];
    } catch (error) {
      console.error('Error fetching open tournaments:', error);
      toast.error('Errore nel caricare i tornei aperti');
      return [];
    }
  }

  // Recupera un torneo specifico per ID
  async getTournamentById(id: string): Promise<Tournament | null> {
    try {
      const { data, error } = await supabaseClient
        .from('tournaments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('Torneo non trovato');
          return null;
        }
        toast.error('Errore nel caricare il torneo');
        throw new Error(error.message);
      }
      
      return data as Tournament;
    } catch (error) {
      console.error('Error fetching tournament:', error);
      toast.error('Errore nel caricare il torneo');
      return null;
    }
  }

  // Recupera i tornei creati da un utente specifico
  async getTournamentsByCreator(userId: string): Promise<Tournament[]> {
    try {
      const { data, error } = await supabaseClient
        .from('tournaments')
        .select('*')
        .eq('creator_user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Errore nel caricare i tuoi tornei');
        throw new Error(error.message);
      }
      
      return data as Tournament[] || [];
    } catch (error) {
      console.error('Error fetching user tournaments:', error);
      toast.error('Errore nel caricare i tuoi tornei');
      return [];
    }
  }

  // Recupera gli investimenti per un torneo specifico
  async getTournamentInvestments(tournamentId: string): Promise<TournamentInvestment[]> {
    try {
      const { data, error } = await supabaseClient
        .from('tournament_investments')
        .select('*')
        .eq('tournament_id', tournamentId)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Errore nel caricare gli investimenti');
        throw new Error(error.message);
      }
      
      return data as TournamentInvestment[] || [];
    } catch (error) {
      console.error('Error fetching investments:', error);
      toast.error('Errore nel caricare gli investimenti');
      return [];
    }
  }

  // Recupera l'investimento di un utente specifico in un torneo
  async getUserInvestmentInTournament(
    tournamentId: string, 
    userId: string
  ): Promise<TournamentInvestment | null> {
    try {
      const { data, error } = await supabaseClient
        .from('tournament_investments')
        .select('*')
        .eq('tournament_id', tournamentId)
        .eq('investor_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user investment:', error);
        return null;
      }
      
      return data as TournamentInvestment | null;
    } catch (error) {
      console.error('Error fetching user investment:', error);
      return null;
    }
  }

  // Crea un nuovo torneo
  async createTournament(tournamentData: CreateTournamentRequest): Promise<TournamentResponse> {
    const response = await this.makeApiRequest<Tournament>(
      this.apiBaseUrl,
      {
        method: 'POST',
        body: JSON.stringify(tournamentData),
      }
    );

    if (response.success) {
      toast.success('Torneo creato con successo!');
      return { success: true, tournament: response.data };
    } else {
      toast.error(response.error || 'Errore nella creazione del torneo');
      return { success: false, error: response.error };
    }
  }

  // Paga la commissione iniziale per un torneo
  async payInitialFee(paymentData: InitialPaymentRequest): Promise<TournamentResponse> {
    const response = await this.makeApiRequest<Tournament>(
      `${this.apiBaseUrl}/pay_initial_fee`,
      {
        method: 'POST',
        body: JSON.stringify(paymentData),
      }
    );

    if (response.success) {
      toast.success('Commissione iniziale pagata con successo!');
      return { success: true, tournament: response.data };
    } else {
      toast.error(response.error || 'Errore nel pagamento della commissione');
      return { success: false, error: response.error };
    }
  }

  // Paga la garanzia per un torneo
  async payGuarantee(paymentData: GuaranteePaymentRequest): Promise<TournamentResponse> {
    const response = await this.makeApiRequest<Tournament>(
      `${this.apiBaseUrl}/pay_guarantee`,
      {
        method: 'POST',
        body: JSON.stringify(paymentData),
      }
    );

    if (response.success) {
      toast.success('Garanzia depositata con successo!');
      return { success: true, tournament: response.data };
    } else {
      toast.error(response.error || 'Errore nel deposito della garanzia');
      return { success: false, error: response.error };
    }
  }

  // Investi in un torneo
  async investInTournament(investmentData: InvestInTournamentRequest): Promise<TournamentResponse> {
    const response = await this.makeApiRequest<Tournament>(
      `${this.apiBaseUrl}/${investmentData.tournament_id}/invest`,
      {
        method: 'POST',
        body: JSON.stringify({ amount: investmentData.amount }),
      }
    );

    if (response.success) {
      toast.success('Investimento effettuato con successo!');
      return { success: true, tournament: response.data };
    } else {
      toast.error(response.error || 'Errore nell\'investimento');
      return { success: false, error: response.error };
    }
  }

  // Riporta i risultati di un torneo
  async reportTournamentResults(resultsData: ReportTournamentResultsRequest): Promise<TournamentResponse> {
    const response = await this.makeApiRequest<Tournament>(
      `${this.apiBaseUrl}/report_results`,
      {
        method: 'POST',
        body: JSON.stringify(resultsData),
      }
    );

    if (response.success) {
      toast.success('Risultati del torneo riportati con successo!');
      return { success: true, tournament: response.data };
    } else {
      toast.error(response.error || 'Errore nel riportare i risultati');
      return { success: false, error: response.error };
    }
  }

  // Cancella un torneo
  async cancelTournament(tournamentId: string): Promise<TournamentResponse> {
    const response = await this.makeApiRequest<Tournament>(
      `${this.apiBaseUrl}/${tournamentId}/cancel`,
      {
        method: 'POST',
      }
    );

    if (response.success) {
      toast.success('Torneo cancellato con successo!');
      return { success: true, tournament: response.data };
    } else {
      toast.error(response.error || 'Errore nella cancellazione del torneo');
      return { success: false, error: response.error };
    }
  }
}

export const tournamentService = new TournamentServiceClass();

