// API service per le chiamate al backend
const API_BASE_URL = 'https://solcraft-backend.vercel.app/api';

export interface Tournament {
  id: string;
  name: string;
  buy_in: string;
  total_prize: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  organizer_id?: string;
  description?: string;
  max_participants?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

class ApiService {
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Tournaments
  async getTournaments(): Promise<Tournament[]> {
    const response = await this.fetchApi<ApiResponse<Tournament[]>>('/tournaments');
    return response.data;
  }

  async getTournament(id: string): Promise<Tournament> {
    const response = await this.fetchApi<ApiResponse<Tournament>>(`/tournaments/${id}`);
    return response.data;
  }

  async createTournament(tournament: Partial<Tournament>): Promise<Tournament> {
    const response = await this.fetchApi<ApiResponse<Tournament>>('/tournaments', {
      method: 'POST',
      body: JSON.stringify(tournament),
    });
    return response.data;
  }

  // Users
  async registerUser(userData: any): Promise<any> {
    const response = await this.fetchApi<ApiResponse<any>>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  }

  async loginUser(credentials: any): Promise<any> {
    const response = await this.fetchApi<ApiResponse<any>>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.data;
  }

  // Investments
  async createInvestment(investment: any): Promise<any> {
    const response = await this.fetchApi<ApiResponse<any>>('/investments', {
      method: 'POST',
      body: JSON.stringify(investment),
    });
    return response.data;
  }

  // Debug endpoints
  async getDebugEnv(): Promise<any> {
    const response = await this.fetchApi<any>('/debug/env');
    return response;
  }

  async getDebugConnection(): Promise<any> {
    const response = await this.fetchApi<any>('/debug/connection');
    return response;
  }
}

export const apiService = new ApiService();
export default apiService;

