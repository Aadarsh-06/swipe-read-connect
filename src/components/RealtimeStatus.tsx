import { Wifi, WifiOff, AlertCircle, Loader2 } from 'lucide-react';
import { useRealtimeStatus, RealtimeStatus as Status } from '@/hooks/useRealtimeStatus';

interface RealtimeStatusProps {
  channelName?: string;
  className?: string;
}

export const RealtimeStatus = ({ channelName, className = '' }: RealtimeStatusProps) => {
  const { status, isConnected, lastConnected } = useRealtimeStatus(channelName);

  const getStatusConfig = (status: Status) => {
    switch (status) {
      case 'CONNECTED':
        return {
          icon: Wifi,
          text: 'Live',
          className: 'text-green-500',
          bgClassName: 'bg-green-50 border-green-200'
        };
      case 'CONNECTING':
        return {
          icon: Loader2,
          text: 'Connecting...',
          className: 'text-yellow-500 animate-spin',
          bgClassName: 'bg-yellow-50 border-yellow-200'
        };
      case 'DISCONNECTED':
        return {
          icon: WifiOff,
          text: 'Offline',
          className: 'text-gray-500',
          bgClassName: 'bg-gray-50 border-gray-200'
        };
      case 'ERROR':
        return {
          icon: AlertCircle,
          text: 'Error',
          className: 'text-red-500',
          bgClassName: 'bg-red-50 border-red-200'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${config.bgClassName} ${className}`}>
      <Icon className={`h-3 w-3 ${config.className}`} />
      <span className={`text-xs font-medium ${config.className}`}>
        {config.text}
      </span>
      {lastConnected && isConnected && (
        <span className="text-xs text-muted-foreground">
          • Real-time
        </span>
      )}
    </div>
  );
};
