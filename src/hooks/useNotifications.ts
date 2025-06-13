// src/hooks/useNotifications.ts
// Hook per la gestione delle notifiche

import { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import { Notification, NotificationType } from '../types/notifications';

export const useNotifications = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Carica le notifiche iniziali
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        setNotifications(data || []);
        setUnreadCount(data?.filter(n => !n.read).length || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [supabase, user]);

  // Sottoscrizione alle nuove notifiche
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev].slice(0, 100)); // Limita a 100 notifiche per performance
          if (!newNotification.read) {
            setUnreadCount(prev => prev + 1);
          }
          
          let toastMessage = newNotification.content.message || `Nuovo aggiornamento: ${newNotification.type}`;
          // Personalizza i messaggi per tipi specifici
          switch(newNotification.type) {
            case 'initial_fee_required':
              toastMessage = `Devi pagare la commissione iniziale per il torneo: ${newNotification.content.tournament_name}`;
              break;
            case 'guarantee_required':
              toastMessage = `Deposito garanzia richiesto per: ${newNotification.content.tournament_name}`;
              break;
            case 'funding_complete':
              toastMessage = `La raccolta fondi per "${newNotification.content.tournament_name}" è completa!`;
              break;
            case 'funds_transferred_to_player':
              toastMessage = `I fondi sono stati trasferiti al tuo wallet per il torneo: ${newNotification.content.tournament_name}`;
              break;
            case 'winnings_distributed':
              toastMessage = `Le vincite sono state distribuite per il torneo: ${newNotification.content.tournament_name}`;
              break;
            // Altri casi specifici
          }

          toast.custom((t) => (
            <div
              onClick={() => {
                toast.dismiss(t.id);
                if (newNotification.link_to) {
                  // Qui puoi usare il router di Next.js per navigare
                  // import { useRouter } from 'next/router';
                  // const router = useRouter(); router.push(newNotification.link_to);
                  window.location.href = newNotification.link_to;
                }
              }}
              style={{
                backgroundColor: '#2a2a3e',
                color: '#e0e0e0',
                padding: '12px 18px',
                borderRadius: '8px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                borderLeft: `4px solid ${newNotification.content.isError ? '#ff4d4f' : '#7e3af2'}`, // Colore accento
                cursor: newNotification.link_to ? 'pointer' : 'default',
              }}
            >
              <strong>{newNotification.content.title || 'Nuova Notifica'}:</strong> {toastMessage}
            </div>
          ), { id: newNotification.id, duration: 8000 });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase, user]);

  // Segna una notifica come letta
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Segna tutte le notifiche come lette
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Elimina una notifica
  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
};
