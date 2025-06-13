// src/types/player.ts
// Definizione dei tipi per il ranking dei giocatori

export type PlayerRanking = 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE';

export interface RankingConfig {
  PLATINUM: {
    minTournaments: number;
    minWinRate: number;
    guaranteePct: number;
    initialFeePct: number;
    winningsFeePct: number;
  };
  GOLD: {
    minTournaments: number;
    minWinRate: number;
    guaranteePct: number;
    initialFeePct: number;
    winningsFeePct: number;
  };
  SILVER: {
    minTournaments: number;
    minWinRate: number;
    guaranteePct: number;
    initialFeePct: number;
    winningsFeePct: number;
  };
  BRONZE: {
    minTournaments: number;
    minWinRate: number;
    guaranteePct: number;
    initialFeePct: number;
    winningsFeePct: number;
  };
}

export const RANKING_CONFIG: RankingConfig = {
  PLATINUM: {
    minTournaments: 50,
    minWinRate: 0.65,
    guaranteePct: 0.20,
    initialFeePct: 0.05,
    winningsFeePct: 0.15
  },
  GOLD: {
    minTournaments: 30,
    minWinRate: 0.55,
    guaranteePct: 0.25,
    initialFeePct: 0.07,
    winningsFeePct: 0.17
  },
  SILVER: {
    minTournaments: 15,
    minWinRate: 0.45,
    guaranteePct: 0.30,
    initialFeePct: 0.08,
    winningsFeePct: 0.18
  },
  BRONZE: {
    minTournaments: 0,
    minWinRate: 0,
    guaranteePct: 0.40,
    initialFeePct: 0.10,
    winningsFeePct: 0.20
  }
};

export interface Player {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  ranking: PlayerRanking;
  tournaments_played: number;
  tournaments_won: number;
  win_rate: number;
  created_at: string;
  updated_at: string;
}

export interface PlayerProfile extends Player {
  total_earnings: number;
  active_tournaments: number;
  completed_tournaments: number;
}
