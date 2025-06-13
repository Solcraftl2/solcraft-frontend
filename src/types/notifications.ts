// src/types/notifications.ts
// Definizione dei tipi per le notifiche

export interface NotificationContent {
  message?: string;
  tournament_id?: string;
  tournament_name?: string;
  investment_id?: string;
  payment_id?: string;
  old_status?: string;
  new_status?: string;
  amount?: number;
  fee_amount?: number;
  fee_percentage?: number;
  guarantee_amount?: number;
  guarantee_percentage?: number;
  pool_amount?: number;
  title?: string;
  isError?: boolean;
  [key: string]: any;
}

export type NotificationType = 
  // Generiche
  | 'tournament_update'
  // Flusso creazione torneo (Giocatore)
  | 'initial_fee_required'      // Richiesta pagamento commissione iniziale
  | 'initial_fee_paid'          // Conferma pagamento commissione iniziale
  | 'guarantee_required'        // Richiesta deposito garanzia
  | 'guarantee_paid'            // Conferma deposito garanzia
  // Flusso raccolta fondi (Giocatore & Investitori)
  | 'funding_started'           // La raccolta fondi è iniziata
  | 'funding_progress'          // Aggiornamento sulla raccolta fondi (es. 50% raggiunto)
  | 'funding_complete'          // La pool è piena
  | 'funding_failed'            // La raccolta fondi è fallita
  // Flusso partecipazione torneo (Giocatore)
  | 'funds_transferred_to_player' // I fondi della pool sono stati trasferiti al giocatore
  | 'tournament_results_due'    // Promemoria per inserire i risultati del torneo
  // Flusso conclusione torneo (Giocatore & Investitori)
  | 'tournament_results_submitted'// Il giocatore ha inserito i risultati
  | 'winnings_fee_calculated'   // Calcolata la commissione sulle vincite (per giocatore)
  | 'winnings_distributed'      // Le vincite sono state distribuite agli investitori
  | 'guarantee_returned'        // La garanzia è stata restituita al giocatore
  | 'guarantee_forfeited'       // La garanzia è stata escussa
  // Flusso investimenti (Investitore)
  | 'investment_confirmed'      // L'investimento è stato confermato
  | 'investment_refunded'       // L'investimento è stato rimborsato (es. funding_failed)
  // Pagamenti generici
  | 'payment_received'
  | 'payment_sent'
  | string; // Permette tipi custom

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  content: NotificationContent;
  read: boolean;
  created_at: string;
  link_to?: string; // URL opzionale per reindirizzare l'utente (es. alla pagina del torneo)
}
