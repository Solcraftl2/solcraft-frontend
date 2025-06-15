// Estende il servizio API con nuovi endpoint per investimenti e utenti
import { apiService } from './apiService';

export interface User {
  id: string;
  email: string;
  wallet_address?: string;
  portfolio_value: number;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  user_id: string;
  tournament_id: string;
  amount: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  expected_return?: number;
  actual_return?: number;
}

export interface ChartData {
  date: string;
  value: number;
  volume?: number;
  liquidity?: number;
}

class ExtendedApiService {
  // User endpoints
  async getUserProfile(userId: string): Promise<User> {
    // TODO: Implementare endpoint backend
    return {
      id: userId,
      email: 'user@example.com',
      portfolio_value: 0, // Utente nuovo
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    // TODO: Implementare endpoint backend
    throw new Error('Not implemented yet');
  }

  // Investment endpoints
  async getUserInvestments(userId: string): Promise<Investment[]> {
    // TODO: Implementare endpoint backend
    // Per ora ritorna array vuoto per utente nuovo
    return [];
  }

  async createInvestment(data: Partial<Investment>): Promise<Investment> {
    // TODO: Implementare endpoint backend
    throw new Error('Not implemented yet');
  }

  async updateInvestment(investmentId: string, data: Partial<Investment>): Promise<Investment> {
    // TODO: Implementare endpoint backend
    throw new Error('Not implemented yet');
  }

  // Chart data endpoints
  async getLiquidityData(timeframe: '24h' | '7d' | '30d' = '24h'): Promise<ChartData[]> {
    // TODO: Implementare endpoint backend
    // Per ora ritorna dati minimi per utente nuovo
    return [
      { date: new Date().toISOString(), value: 0, liquidity: 0 }
    ];
  }

  async getVolumeData(timeframe: '24h' | '7d' | '30d' = '24h'): Promise<ChartData[]> {
    // TODO: Implementare endpoint backend
    // Per ora ritorna dati minimi per utente nuovo
    return [
      { date: new Date().toISOString(), value: 0, volume: 0 }
    ];
  }

  async getOverviewData(timeframe: '24h' | '7d' | '30d' = '24h'): Promise<ChartData[]> {
    // TODO: Implementare endpoint backend
    // Per ora ritorna dati minimi per utente nuovo
    return [
      { date: new Date().toISOString(), value: 0 }
    ];
  }

  // Wallet endpoints
  async connectWallet(walletAddress: string, userId: string): Promise<User> {
    // TODO: Implementare endpoint backend
    throw new Error('Not implemented yet');
  }

  async disconnectWallet(userId: string): Promise<User> {
    // TODO: Implementare endpoint backend
    throw new Error('Not implemented yet');
  }

  // Tournament participation
  async joinTournament(tournamentId: string, userId: string): Promise<any> {
    // TODO: Implementare endpoint backend
    throw new Error('Not implemented yet');
  }

  async leaveTournament(tournamentId: string, userId: string): Promise<any> {
    // TODO: Implementare endpoint backend
    throw new Error('Not implemented yet');
  }
}

export const extendedApiService = new ExtendedApiService();
export default extendedApiService;

