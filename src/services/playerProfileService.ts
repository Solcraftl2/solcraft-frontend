// src/services/playerProfileService.ts
// Servizio per la gestione dei profili dei giocatori

import { supabaseClient } from '../lib/supabaseClient';
import { Player, PlayerProfile, PlayerRanking, RANKING_CONFIG } from '../types/player';

export const playerProfileService = {
  // Recupera il profilo di un giocatore
  async getPlayerProfile(userId: string): Promise<PlayerProfile | null> {
    // Prima recupera i dati base del giocatore
    const { data: playerData, error: playerError } = await supabaseClient
      .from('players')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (playerError) throw new Error(playerError.message);
    if (!playerData) return null;
    
    // Recupera i tornei attivi
    const { data: activeTournaments, error: activeTournamentsError } = await supabaseClient
      .from('tournaments')
      .select('*')
      .eq('creator_user_id', userId)
      .in('status', ['funding_open', 'funding_complete', 'funds_transferred_to_player', 'in_progress', 'awaiting_results'])
      .count();
    
    if (activeTournamentsError) throw new Error(activeTournamentsError.message);
    
    // Recupera i tornei completati
    const { data: completedTournaments, error: completedTournamentsError } = await supabaseClient
      .from('tournaments')
      .select('*')
      .eq('creator_user_id', userId)
      .in('status', ['completed_won', 'completed_lost'])
      .count();
    
    if (completedTournamentsError) throw new Error(completedTournamentsError.message);
    
    // Calcola i guadagni totali (semplificato)
    const { data: earnings, error: earningsError } = await supabaseClient
      .from('tournaments')
      .select('total_winnings_from_tournament')
      .eq('creator_user_id', userId)
      .eq('status', 'completed_won');
    
    if (earningsError) throw new Error(earningsError.message);
    
    const totalEarnings = earnings.reduce((sum, tournament) => sum + (tournament.total_winnings_from_tournament || 0), 0);
    
    return {
      ...playerData as Player,
      total_earnings: totalEarnings,
      active_tournaments: activeTournaments.length,
      completed_tournaments: completedTournaments.length
    };
  },

  // Calcola il ranking di un giocatore in base alle sue statistiche
  calculatePlayerRanking(tournamentsPlayed: number, winRate: number): PlayerRanking {
    if (tournamentsPlayed >= RANKING_CONFIG.PLATINUM.minTournaments && 
        winRate >= RANKING_CONFIG.PLATINUM.minWinRate) {
      return 'PLATINUM';
    } else if (tournamentsPlayed >= RANKING_CONFIG.GOLD.minTournaments && 
               winRate >= RANKING_CONFIG.GOLD.minWinRate) {
      return 'GOLD';
    } else if (tournamentsPlayed >= RANKING_CONFIG.SILVER.minTournaments && 
               winRate >= RANKING_CONFIG.SILVER.minWinRate) {
      return 'SILVER';
    } else {
      return 'BRONZE';
    }
  },

  // Aggiorna il ranking di un giocatore
  async updatePlayerRanking(userId: string): Promise<PlayerRanking> {
    // Recupera i dati del giocatore
    const { data: playerData, error: playerError } = await supabaseClient
      .from('players')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (playerError) throw new Error(playerError.message);
    
    // Calcola il nuovo ranking
    const newRanking = this.calculatePlayerRanking(
      playerData.tournaments_played,
      playerData.win_rate
    );
    
    // Aggiorna il ranking nel database
    const { error: updateError } = await supabaseClient
      .from('players')
      .update({ ranking: newRanking, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    
    if (updateError) throw new Error(updateError.message);
    
    return newRanking;
  },

  // Crea un nuovo profilo giocatore
  async createPlayerProfile(userId: string, name: string, avatarUrl?: string, bio?: string): Promise<Player> {
    const { data, error } = await supabaseClient
      .from('players')
      .insert([
        { 
          user_id: userId,
          name,
          avatar_url: avatarUrl,
          bio,
          ranking: 'BRONZE',
          tournaments_played: 0,
          tournaments_won: 0,
          win_rate: 0
        }
      ])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data as Player;
  },

  // Aggiorna le statistiche di un giocatore dopo un torneo
  async updatePlayerStats(userId: string, won: boolean): Promise<Player> {
    // Recupera i dati attuali del giocatore
    const { data: playerData, error: playerError } = await supabaseClient
      .from('players')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (playerError) throw new Error(playerError.message);
    
    // Calcola le nuove statistiche
    const tournamentsPlayed = playerData.tournaments_played + 1;
    const tournamentsWon = won ? playerData.tournaments_won + 1 : playerData.tournaments_won;
    const winRate = tournamentsPlayed > 0 ? tournamentsWon / tournamentsPlayed : 0;
    
    // Aggiorna le statistiche nel database
    const { data, error: updateError } = await supabaseClient
      .from('players')
      .update({ 
        tournaments_played: tournamentsPlayed,
        tournaments_won: tournamentsWon,
        win_rate: winRate,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (updateError) throw new Error(updateError.message);
    
    // Aggiorna anche il ranking
    await this.updatePlayerRanking(userId);
    
    return data as Player;
  }
};
