import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase-config';

interface ChatConnectionHealthOptions {
  channelName: string;
  onReconnect?: () => void;
  checkIntervalMs?: number;
}

interface ChatConnectionHealthResult {
  isHealthy: boolean;
  lastCheck: Date | null;
  connectionIssues: number;
  forceHealthCheck: () => void;
}

export const useChatConnectionHealth = ({
  channelName,
  onReconnect,
  checkIntervalMs = 30000 // 30 seconds
}: ChatConnectionHealthOptions): ChatConnectionHealthResult => {
  const [isHealthy, setIsHealthy] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [connectionIssues, setConnectionIssues] = useState(0);
  const healthCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const lastMessageTime = useRef<Date>(new Date());

  const performHealthCheck = useCallback(async () => {
    try {
      console.log(`🏥 Performing health check for ${channelName}`);
      setLastCheck(new Date());
      
      // Check if we can perform a simple database query
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id')
        .limit(1);
      
      if (error) {
        console.warn('❌ Database health check failed:', error);
        setIsHealthy(false);
        setConnectionIssues(prev => prev + 1);
        
        // Trigger reconnect if callback provided
        if (onReconnect && connectionIssues >= 2) {
          console.log('🔄 Triggering reconnect due to health check failures');
          onReconnect();
          setConnectionIssues(0); // Reset counter after reconnect attempt
        }
      } else {
        console.log('✅ Database health check passed');
        setIsHealthy(true);
        setConnectionIssues(0);
      }
    } catch (error) {
      console.error('🚨 Health check exception:', error);
      setIsHealthy(false);
      setConnectionIssues(prev => prev + 1);
    }
  }, [channelName, onReconnect, connectionIssues]);

  const forceHealthCheck = useCallback(() => {
    performHealthCheck();
  }, [performHealthCheck]);

  // Update last message time (can be called from parent component)
  const updateLastMessageTime = useCallback(() => {
    lastMessageTime.current = new Date();
  }, []);

  useEffect(() => {
    // Start periodic health checks
    healthCheckInterval.current = setInterval(performHealthCheck, checkIntervalMs);
    
    // Initial health check
    performHealthCheck();
    
    return () => {
      if (healthCheckInterval.current) {
        clearInterval(healthCheckInterval.current);
      }
    };
  }, [performHealthCheck, checkIntervalMs]);

  // Monitor for long periods without activity (potential connection drop)
  useEffect(() => {
    const inactivityCheck = setInterval(() => {
      const timeSinceLastMessage = Date.now() - lastMessageTime.current.getTime();
      const fiveMinutes = 5 * 60 * 1000;
      
      // If no activity for 5 minutes and we think we're healthy, do a check
      if (timeSinceLastMessage > fiveMinutes && isHealthy) {
        console.log('⚠️ Long inactivity detected, performing health check');
        performHealthCheck();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(inactivityCheck);
  }, [isHealthy, performHealthCheck]);

  return {
    isHealthy,
    lastCheck,
    connectionIssues,
    forceHealthCheck
  };
};
