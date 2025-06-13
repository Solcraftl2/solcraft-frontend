// src/components/PlayerRankingBadge.tsx
// Componente per visualizzare il ranking del giocatore

import React from 'react';
import { PlayerRanking } from '../types/player';

interface PlayerRankingBadgeProps {
  ranking: PlayerRanking;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const PlayerRankingBadge: React.FC<PlayerRankingBadgeProps> = ({ 
  ranking, 
  size = 'medium',
  showLabel = true
}) => {
  // Configurazione colori e dimensioni in base al ranking
  const rankingConfig = {
    'PLATINUM': {
      backgroundColor: '#E5E4E2',
      textColor: '#333333',
      borderColor: '#A9A9A9',
      label: 'Platino'
    },
    'GOLD': {
      backgroundColor: '#FFD700',
      textColor: '#333333',
      borderColor: '#DAA520',
      label: 'Oro'
    },
    'SILVER': {
      backgroundColor: '#C0C0C0',
      textColor: '#333333',
      borderColor: '#A9A9A9',
      label: 'Argento'
    },
    'BRONZE': {
      backgroundColor: '#CD7F32',
      textColor: '#FFFFFF',
      borderColor: '#8B4513',
      label: 'Bronzo'
    }
  };

  // Dimensioni in base al parametro size
  const sizeConfig = {
    'small': {
      badgeSize: '24px',
      fontSize: '10px',
      padding: '2px 6px',
      labelFontSize: '10px'
    },
    'medium': {
      badgeSize: '32px',
      fontSize: '14px',
      padding: '4px 10px',
      labelFontSize: '12px'
    },
    'large': {
      badgeSize: '40px',
      fontSize: '18px',
      padding: '6px 14px',
      labelFontSize: '14px'
    }
  };

  const config = rankingConfig[ranking];
  const dimensions = sizeConfig[size];

  return (
    <div style={{ 
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      <div style={{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
        border: `2px solid ${config.borderColor}`,
        borderRadius: '50%',
        width: dimensions.badgeSize,
        height: dimensions.badgeSize,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: dimensions.fontSize,
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        {ranking.charAt(0)}
      </div>
      {showLabel && (
        <span style={{
          fontSize: dimensions.labelFontSize,
          fontWeight: 'bold',
          color: '#e0e0e0' // Colore testo tema scuro SolCraft
        }}>
          {config.label}
        </span>
      )}
    </div>
  );
};
