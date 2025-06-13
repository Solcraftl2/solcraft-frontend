// src/components/InitialFeePaymentForm.tsx
// Componente per il pagamento della commissione iniziale

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { feeService } from '../services/feeService';
import { PlayerRanking, RANKING_CONFIG } from '../types/player';

interface InitialFeePaymentFormProps {
  tournamentId: string;
  tournamentName: string;
  targetPoolAmount: number;
  playerRanking: PlayerRanking;
  initialFeeAmount: number;
  onPaymentComplete: () => void;
}

export const InitialFeePaymentForm: React.FC<InitialFeePaymentFormProps> = ({
  tournamentId,
  tournamentName,
  targetPoolAmount,
  playerRanking,
  initialFeeAmount,
  onPaymentComplete
}) => {
  const { publicKey, signTransaction, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Calcola la percentuale della commissione in base al ranking
  const feePercentage = RANKING_CONFIG[playerRanking].initialFeePct * 100;

  const handlePayFee = async () => {
    if (!connected || !publicKey || !signTransaction) {
      setError('Wallet non connesso. Connetti il tuo wallet per procedere.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Qui andrebbe la logica per creare e firmare la transazione Solana
      // Per semplicità, simuliamo una transazione riuscita
      
      // Invia la richiesta di pagamento commissione al backend
      const result = await feeService.payFee({
        tournament_id: tournamentId,
        amount: initialFeeAmount,
        fee_type: 'initial'
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Errore nel pagamento della commissione iniziale');
      }
      
      setSuccess(true);
      onPaymentComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il pagamento della commissione');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#252538',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '16px',
      border: '1px solid #3e3e4f'
    }}>
      <h3 style={{ color: '#e0e0e0', marginTop: 0 }}>Commissione Iniziale</h3>
      
      <p style={{ color: '#b8b8c3' }}>
        Per avviare il torneo "{tournamentName}", è necessario pagare una commissione iniziale del {feePercentage.toFixed(0)}% 
        in base al tuo ranking {playerRanking}.
      </p>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        backgroundColor: '#1e1e2e',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '16px'
      }}>
        <span style={{ color: '#b8b8c3' }}>Importo commissione:</span>
        <span style={{ color: '#7e3af2', fontWeight: 'bold' }}>{initialFeeAmount.toFixed(2)} SOL</span>
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: 'rgba(255, 77, 79, 0.2)', 
          color: '#ff4d4f',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}
      
      {success ? (
        <div style={{ 
          backgroundColor: 'rgba(82, 196, 26, 0.2)', 
          color: '#52c41a',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '16px'
        }}>
          Commissione pagata con successo! Ora puoi procedere con il deposito della garanzia.
        </div>
      ) : (
        <button
          onClick={handlePayFee}
          disabled={isLoading || !connected}
          style={{
            backgroundColor: '#7e3af2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: isLoading || !connected ? 'not-allowed' : 'pointer',
            opacity: isLoading || !connected ? 0.7 : 1,
            width: '100%',
            transition: 'all 0.2s ease'
          }}
        >
          {isLoading ? 'Elaborazione...' : `Paga ${initialFeeAmount.toFixed(2)} SOL di Commissione`}
        </button>
      )}
      
      <p style={{ color: '#b8b8c3', fontSize: '12px', marginTop: '12px' }}>
        Questa commissione è necessaria per avviare il processo di raccolta fondi e non è rimborsabile.
      </p>
    </div>
  );
};
