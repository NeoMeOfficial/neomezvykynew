import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { persistentStorage } from '@/lib/persistentStorage';
import { Shield, ShieldAlert, RotateCcw } from 'lucide-react';

interface StorageHealthIndicatorProps {
  accessCode: string | null;
  onReconnect?: () => Promise<boolean>;
}

export const StorageHealthIndicator: React.FC<StorageHealthIndicatorProps> = ({ 
  accessCode, 
  onReconnect 
}) => {
  const [health, setHealth] = useState<{ [key: string]: boolean }>({});
  const [checking, setChecking] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const healthResult = await persistentStorage.healthCheck();
      setHealth(healthResult);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleReconnect = async () => {
    if (!onReconnect) return;
    
    setReconnecting(true);
    try {
      const success = await onReconnect();
      if (success) {
        await checkHealth();
      }
    } catch (error) {
      console.error('Reconnection failed:', error);
    } finally {
      setReconnecting(false);
    }
  };

  useEffect(() => {
    if (accessCode) {
      checkHealth();
    }
  }, [accessCode]);

  if (!accessCode) return null;

  const healthyMethods = Object.values(health).filter(Boolean).length;
  const totalMethods = Object.keys(health).length;
  
  if (totalMethods === 0) return null;

  const isHealthy = healthyMethods >= 2;
  const showWarning = healthyMethods === 1;
  const isCritical = healthyMethods === 0;

  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge 
        variant={isHealthy ? "secondary" : showWarning ? "outline" : "destructive"}
        className="flex items-center gap-1"
      >
        {isHealthy ? (
          <Shield className="w-3 h-3 text-primary" />
        ) : (
          <ShieldAlert className="w-3 h-3 text-destructive" />
        )}
        {isHealthy ? 'Secure' : showWarning ? 'Limited' : 'At Risk'}
      </Badge>
      
      <span className="text-muted-foreground">
        {healthyMethods}/{totalMethods} storage methods
      </span>

      {(showWarning || isCritical) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReconnect}
          disabled={reconnecting || checking}
          className="h-auto p-1 text-xs"
        >
          <RotateCcw className={`w-3 h-3 ${reconnecting ? 'animate-spin' : ''}`} />
          {reconnecting ? 'Fixing...' : 'Fix'}
        </Button>
      )}
    </div>
  );
};