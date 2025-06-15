// src/types/tournaments.ts
// Definizione dei tipi corretti per i tornei con UUID

import { PlayerRanking } from './player';

export type TournamentStatus = 
  | 'pending_initial_payment' 
  | 'pending_guarantee' 
  | 'funding_open'
  | 'funding_failed' 
  | 'funding_complete' 
  | 'funds_transferred_to_player'
  | 'in_progress' 
  | 'awaiting_results' 
  | 'completed_won' 
  | 'completed_lost' 
  | 'cancelled';

export interface Tournament {
  id: string; // UUID as string for frontend compatibility
  name: string;
  description?: string;
  game_type: string;
  creator_user_id: string; // UUID as string
  target_pool_amount: number;
  current_pool_amount: number;
  tournament_buy_in?: number;
  external_tournament_url?: string;
  player_ranking_at_creation: PlayerRanking;
  status: TournamentStatus;
  initial_platform_fee_pct: number;
  initial_platform_fee_amount: number;
  initial_platform_fee_paid: boolean;
  player_guarantee_pct: number;
  player_guarantee_amount_required: number;
  player_guarantee_paid: boolean;
  winnings_platform_fee_pct: number;
  total_winnings_from_tournament?: number;
  platform_winnings_fee_amount?: number;
  net_winnings_for_investors?: number;
  funding_start_time?: string;
  funding_end_time?: string;
  created_at: string;
  updated_at: string;
}

export interface TournamentInvestment {
  id: string; // UUID as string
  tournament_id: string; // UUID as string
  investor_id: string; // UUID as string
  amount: number;
  percentage_of_pool: number;
  status: 'active' | 'refunded' | 'paid_out';
  winnings_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface TournamentWithInvestments extends Tournament {
  investments: TournamentInvestment[];
  my_investment?: TournamentInvestment;
}

export interface CreateTournamentRequest {
  name: string;
  description?: string;
  game_type: string;
  target_pool_amount: number;
  tournament_buy_in?: number;
  external_tournament_url?: string;
  player_ranking?: PlayerRanking;
  funding_end_time?: string;
}

export interface InvestInTournamentRequest {
  tournament_id: string;
  amount: number;
}

export interface InitialPaymentRequest {
  tournament_id: string;
  transaction_hash?: string;
}

export interface GuaranteePaymentRequest {
  tournament_id: string;
  transaction_hash?: string;
}

export interface ReportTournamentResultsRequest {
  tournament_id: string;
  won: boolean;
  total_winnings?: number;
  proof_url?: string;
  notes?: string;
}

export interface TournamentResponse {
  success: boolean;
  tournament?: Tournament;
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

