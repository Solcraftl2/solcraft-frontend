// src/components/NotificationDropdown.tsx
// Componente per visualizzare le notifiche in un dropdown

import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { Notification } from '../types/notifications';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface NotificationDropdownProps {
  onClose?: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getNotificationMessage = (notification: Notification): string => {
    const { type, content } = notification;
    switch(type) {
      case 'initial_fee_required':
        return `Pagamento commissione iniziale di ${content.fee_amount?.toFixed(2)} SOL richiesto per il torneo "${content.tournament_name}".`;
      case 'guarantee_required':
        return `Deposito garanzia di ${content.guarantee_amount?.toFixed(2)} SOL richiesto per "${content.tournament_name}".`;
      case 'funding_complete':
        return `La raccolta fondi per "${content.tournament_name}" è completa! Pool: ${content.pool_amount?.toFixed(2)} SOL.`;
      case 'funds_transferred_to_player':
        return `I fondi sono stati trasferiti al tuo wallet per il torneo "${content.tournament_name}".`;
      case 'tournament_results_due':
        return `È ora di inserire i risultati per il torneo "${content.tournament_name}".`;
      case 'winnings_distributed':
        return `Le vincite sono state distribuite per il torneo "${content.tournament_name}".`;
      case 'guarantee_returned':
        return `La tua garanzia di ${content.guarantee_amount?.toFixed(2)} SOL è stata restituita per "${content.tournament_name}".`;
      case 'investment_confirmed':
        return `Il tuo investimento di ${content.amount?.toFixed(2)} SOL in "${content.tournament_name}" è stato confermato.`;
      default:
        return content.message || `Aggiornamento per ${type}`;
    }
  };

  const getNotificationIcon = (type: string): string => {
    switch(type) {
      case 'initial_fee_required':
      case 'guarantee_required':
        return '💰';
      case 'funding_complete':
      case 'funds_transferred_to_player':
        return '💸';
      case 'tournament_results_due':
        return '🏆';
      case 'winnings_distributed':
      case 'guarantee_returned':
        return '✅';
      case 'funding_failed':
      case 'guarantee_forfeited':
        return '❌';
      case 'investment_confirmed':
        return '📈';
      default:
        return '📣';
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM, HH:mm', { locale: it });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={toggleDropdown}
        style={{
          position: 'relative',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#e0e0e0',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: '#7e3af2',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          width: '320px',
          maxHeight: '400px',
          backgroundColor: '#252538',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid #3e3e4f'
          }}>
            <h3 style={{ margin: 0, color: '#e0e0e0' }}>Notifiche</h3>
            <div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#7e3af2',
                    fontSize: '12px',
                    cursor: 'pointer',
                    padding: '4px 8px'
                  }}
                >
                  Segna tutte come lette
                </button>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#e0e0e0',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginLeft: '8px'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          <div style={{
            overflowY: 'auto',
            maxHeight: '350px',
            padding: '0'
          }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: '16px',
                textAlign: 'center',
                color: '#b8b8c3'
              }}>
                Nessuna notifica
              </div>
            ) : (
              <ul style={{
                listStyle: 'none',
                margin: 0,
                padding: 0
              }}>
                {notifications.map(n => (
                  <li 
                    key={n.id} 
                    onClick={() => {
                      if (!n.read) handleMarkAsRead(n.id);
                      if (n.link_to) {
                        window.location.href = n.link_to;
                        if (onClose) onClose();
                      }
                    }}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #3e3e4f',
                      backgroundColor: n.read ? '#252538' : '#2a2a42',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      cursor: n.link_to || !n.read ? 'pointer' : 'default',
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#1e1e2e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}>
                      {getNotificationIcon(n.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: n.read ? 400 : 600, lineHeight: '1.4', color: '#e0e0e0' }}>
                        {getNotificationMessage(n)}
                      </p>
                      <span style={{ fontSize: '12px', color: '#b8b8c3' }}>
                        {formatDate(n.created_at)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
