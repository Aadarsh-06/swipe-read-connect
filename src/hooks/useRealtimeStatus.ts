import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

export type RealtimeStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

interface UseRealtimeStatusResult {
  status: RealtimeStatus;
  isConnected: boolean;
  lastConnected: Date | null;
  reconnect: () => void;
}

export const useRealtimeStatus = (channelName?: string): UseRealtimeStatusResult => {
  const [status, setStatus] = useState<RealtimeStatus>('CONNECTING');
  const [lastConnected, setLastConnected] = useState<Date | null>(null);
  const [statusChannel, setStatusChannel] = useState<ReturnType<typeof supabase.channel> | null>(null);

  const reconnect = useCallback(() => {
    console.log('Attempting to reconnect realtime...');
    if (statusChannel) {
      statusChannel.unsubscribe().then(() => {
        statusChannel.subscribe();
      });
    }
  }, [statusChannel]);

  useEffect(() => {
    // Monitor Supabase connection status
    const channel = supabase.channel(channelName ? `realtime-status-${channelName}` : 'realtime-status');
    setStatusChannel(channel);
    
    channel
      .subscribe((channelStatus) => {
        switch (channelStatus) {
          case 'SUBSCRIBED':
            setStatus('CONNECTED');
            setLastConnected(new Date());
            break;
          case 'CHANNEL_ERROR':
            setStatus('ERROR');
            // Auto-reconnect after error
            setTimeout(() => {
              console.log('Auto-reconnecting after error...');
              reconnect();
            }, 3000);
            break;
          case 'TIMED_OUT':
            setStatus('DISCONNECTED');
            // Auto-reconnect after timeout
            setTimeout(() => {
              console.log('Auto-reconnecting after timeout...');
              reconnect();
            }, 5000);
            break;
          case 'CLOSED':
            setStatus('DISCONNECTED');
            break;
          default:
            setStatus('CONNECTING');
        }
        
        if (channelName) {
          console.log(`Real-time status for ${channelName}: ${channelStatus}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
      setStatusChannel(null);
    };
  }, [channelName, reconnect]);

  return {
    status,
    isConnected: status === 'CONNECTED',
    lastConnected,
    reconnect
  };
};
