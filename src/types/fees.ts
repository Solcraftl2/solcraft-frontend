// src/types/fees.ts
// Definizione dei tipi per le commissioni della piattaforma

import { PlayerRanking } from './player';

export interface FeeStructure {
  [key: string]: {
    initialFeePct: number;
    winningsFeePct: number;
  };
}

export const RANKING_FEE_STRUCTURE: FeeStructure = {
  'PLATINUM': {
    initialFeePct: 0.05, // 5%
    winningsFeePct: 0.15  // 15%
  },
  'GOLD': {
    initialFeePct: 0.07, // 7%
    winningsFeePct: 0.17  // 17%
  },
  'SILVER': {
    initialFeePct: 0.08, // 8%
    winningsFeePct: 0.18  // 18%
  },
  'BRONZE': {
    initialFeePct: 0.10, // 10%
    winningsFeePct: 0.20  // 20%
  }
};

export interface PlatformFee {
  id: string;
  tournament_id: string;
  fee_type: 'initial' | 'winnings';
  amount: number;
  percentage: number;
  status: 'pending' | 'paid' | 'refunded';
  transaction_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface FeeCalculation {
  initialFeePct: number;
  initialFeeAmount: number;
  winningsFeePct: number;
}

export interface FeePaymentRequest {
  tournament_id: string;
  amount: number;
  fee_type: 'initial' | 'winnings';
}

export interface FeePaymentResponse {
  success: boolean;
  fee_id?: string;
  transaction_hash?: string;
  error?: string;
}
