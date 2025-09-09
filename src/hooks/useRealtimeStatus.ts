import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase-config';

export type RealtimeStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

interface UseRealtimeStatusResult {
  status: RealtimeStatus;
  isConnected: boolean;
  lastConnected: Date | null;
  reconnect: () => void;
}

// Global status tracker to avoid multiple status channels
const globalStatusTracker = {
  status: 'CONNECTING' as RealtimeStatus,
  lastConnected: null as Date | null,
  subscribers: new Set<(status: RealtimeStatus) => void>(),
  channel: null as ReturnType<typeof supabase.channel> | null,
  
  subscribe: (callback: (status: RealtimeStatus) => void) => {
    globalStatusTracker.subscribers.add(callback);
    callback(globalStatusTracker.status); // Immediately call with current status
    
    // Initialize channel if not exists
    if (!globalStatusTracker.channel) {
      globalStatusTracker.init();
    }
    
    return () => {
      globalStatusTracker.subscribers.delete(callback);
      // Clean up if no more subscribers
      if (globalStatusTracker.subscribers.size === 0 && globalStatusTracker.channel) {
        supabase.removeChannel(globalStatusTracker.channel);
        globalStatusTracker.channel = null;
      }
    };
  },
  
  updateStatus: (newStatus: RealtimeStatus) => {
    console.log(`🔄 Global real-time status updated: ${globalStatusTracker.status} → ${newStatus}`);
    globalStatusTracker.status = newStatus;
    if (newStatus === 'CONNECTED') {
      globalStatusTracker.lastConnected = new Date();
    }
    globalStatusTracker.subscribers.forEach(callback => callback(newStatus));
  },
  
  init: () => {
    if (globalStatusTracker.channel) return;
    
    console.log('🚀 Initializing global real-time status monitor');
    const channel = supabase.channel('global-realtime-status', {
      config: {
        broadcast: { self: false },
        presence: { key: 'status' }
      }
    });
    
    channel.subscribe((channelStatus) => {
      console.log(`📡 Global real-time status: ${channelStatus}`);
      
      switch (channelStatus) {
        case 'SUBSCRIBED':
          globalStatusTracker.updateStatus('CONNECTED');
          break;
        case 'CHANNEL_ERROR':
          globalStatusTracker.updateStatus('ERROR');
          // Auto-reconnect after error
          setTimeout(() => {
            console.log('🔄 Auto-reconnecting after error...');
            if (globalStatusTracker.channel) {
              globalStatusTracker.channel.unsubscribe().then(() => {
                globalStatusTracker.channel?.subscribe();
              });
            }
          }, 3000);
          break;
        case 'TIMED_OUT':
          globalStatusTracker.updateStatus('DISCONNECTED');
          // Auto-reconnect after timeout
          setTimeout(() => {
            console.log('🔄 Auto-reconnecting after timeout...');
            if (globalStatusTracker.channel) {
              globalStatusTracker.channel.unsubscribe().then(() => {
                globalStatusTracker.channel?.subscribe();
              });
            }
          }, 5000);
          break;
        case 'CLOSED':
          globalStatusTracker.updateStatus('DISCONNECTED');
          break;
        default:
          globalStatusTracker.updateStatus('CONNECTING');
      }
    });
    
    globalStatusTracker.channel = channel;
  },
  
  reconnect: () => {
    console.log('🔄 Manual reconnect triggered');
    if (globalStatusTracker.channel) {
      globalStatusTracker.channel.unsubscribe().then(() => {
        globalStatusTracker.channel?.subscribe();
      });
    } else {
      globalStatusTracker.init();
    }
  }
};

export const useRealtimeStatus = (channelName?: string): UseRealtimeStatusResult => {
  const [status, setStatus] = useState<RealtimeStatus>('CONNECTING');
  const [lastConnected, setLastConnected] = useState<Date | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const reconnect = useCallback(() => {
    console.log(`🔄 Reconnect requested for ${channelName || 'global'}`);
    globalStatusTracker.reconnect();
  }, [channelName]);

  useEffect(() => {
    // Subscribe to global status
    const unsubscribe = globalStatusTracker.subscribe((newStatus) => {
      setStatus(newStatus);
      setLastConnected(globalStatusTracker.lastConnected);
    });
    
    unsubscribeRef.current = unsubscribe;
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [channelName]);

  return {
    status,
    isConnected: status === 'CONNECTED',
    lastConnected,
    reconnect
  };
};
