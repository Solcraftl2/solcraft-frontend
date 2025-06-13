// src/components/GuaranteePaymentForm.tsx
// Componente per il pagamento della garanzia

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { guaranteeService } from '../services/guaranteeService';
import { PlayerRanking, RANKING_CONFIG } from '../types/player';

interface GuaranteePaymentFormProps {
  tournamentId: string;
  tournamentName: string;
  targetPoolAmount: number;
  playerRanking: PlayerRanking;
  onPaymentComplete: () => void;
}

export const GuaranteePaymentForm: React.FC<GuaranteePaymentFormProps> = ({
  tournamentId,
  tournamentName,
  targetPoolAmount,
  playerRanking,
  onPaymentComplete
}) => {
  const { publicKey, signTransaction, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Calcola l'importo della garanzia in base al ranking
  const guaranteeAmount = guaranteeService.calculateGuaranteeAmount(targetPoolAmount, playerRanking);
  const guaranteePercentage = RANKING_CONFIG[playerRanking].guaranteePct * 100;

  const handlePayGuarantee = async () => {
    if (!connected || !publicKey || !signTransaction) {
      setError('Wallet non connesso. Connetti il tuo wallet per procedere.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Qui andrebbe la logica per creare e firmare la transazione Solana
      // Per semplicità, simuliamo una transazione riuscita
      
      const simulatedTxHash = `simulated_tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Invia la richiesta di pagamento garanzia al backend
      const result = await guaranteeService.payGuarantee({
        tournament_id: tournamentId,
        transaction_hash: simulatedTxHash
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Errore nel pagamento della garanzia');
      }
      
      setSuccess(true);
      onPaymentComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto durante il pagamento della garanzia');
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
      <h3 style={{ color: '#e0e0e0', marginTop: 0 }}>Deposito Garanzia</h3>
      
      <p style={{ color: '#b8b8c3' }}>
        Per procedere con il torneo "{tournamentName}", è necessario depositare una garanzia del {guaranteePercentage.toFixed(0)}% 
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
        <span style={{ color: '#b8b8c3' }}>Importo garanzia:</span>
        <span style={{ color: '#7e3af2', fontWeight: 'bold' }}>{guaranteeAmount.toFixed(2)} SOL</span>
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
          Garanzia depositata con successo! Il torneo è ora in fase di raccolta fondi.
        </div>
      ) : (
        <button
          onClick={handlePayGuarantee}
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
          {isLoading ? 'Elaborazione...' : `Deposita ${guaranteeAmount.toFixed(2)} SOL di Garanzia`}
        </button>
      )}
      
      <p style={{ color: '#b8b8c3', fontSize: '12px', marginTop: '12px' }}>
        La garanzia verrà restituita al termine del torneo, a meno che non vengano violate le regole.
      </p>
    </div>
  );
};
