import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-config';

export type RealtimeStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'ERROR';

interface UseRealtimeStatusResult {
  status: RealtimeStatus;
  isConnected: boolean;
  lastConnected: Date | null;
}

export const useRealtimeStatus = (channelName?: string): UseRealtimeStatusResult => {
  const [status, setStatus] = useState<RealtimeStatus>('CONNECTING');
  const [lastConnected, setLastConnected] = useState<Date | null>(null);

  useEffect(() => {
    // Monitor Supabase connection status
    const statusChannel = supabase.channel('realtime-status');
    
    statusChannel
      .subscribe((channelStatus) => {
        switch (channelStatus) {
          case 'SUBSCRIBED':
            setStatus('CONNECTED');
            setLastConnected(new Date());
            break;
          case 'CHANNEL_ERROR':
            setStatus('ERROR');
            break;
          case 'TIMED_OUT':
            setStatus('DISCONNECTED');
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
      supabase.removeChannel(statusChannel);
    };
  }, [channelName]);

  return {
    status,
    isConnected: status === 'CONNECTED',
    lastConnected
  };
};
