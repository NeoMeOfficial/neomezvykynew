import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { persistentStorage } from '@/lib/persistentStorage';
import { Shield, ShieldAlert, RotateCcw, Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const [isEphemeral, setIsEphemeral] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const healthResult = await persistentStorage.healthCheck();
      setHealth(healthResult);
      setIsEphemeral(persistentStorage.isEphemeralContext());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setChecking(false);
    }
  };

  const copyPersonalLink = async () => {
    if (!accessCode) return;
    
    try {
      const personalLink = persistentStorage.generatePersonalLink(accessCode);
      await navigator.clipboard.writeText(personalLink);
      toast({
        title: 'Link copied!',
        description: 'Personal link copied to clipboard. Bookmark this to always access your data.',
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: 'Copy failed',
        description: 'Could not copy link to clipboard.',
        variant: 'destructive',
      });
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
  const showWarning = healthyMethods === 1 || isEphemeral;
  const isCritical = healthyMethods === 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs">
        <Badge 
          variant={isHealthy && !isEphemeral ? "secondary" : showWarning ? "outline" : "destructive"}
          className="flex items-center gap-1"
        >
          {isHealthy && !isEphemeral ? (
            <Shield className="w-3 h-3 text-primary" />
          ) : (
            <ShieldAlert className="w-3 h-3 text-destructive" />
          )}
          {isHealthy && !isEphemeral ? 'Secure' : showWarning ? 'Limited' : 'At Risk'}
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

        <Button
          variant="ghost"
          size="sm"
          onClick={copyPersonalLink}
          className="h-auto p-1 text-xs"
          title="Copy personal link"
        >
          <Copy className="w-3 h-3" />
        </Button>
      </div>

      {isEphemeral && (
        <div className="bg-muted/50 border border-border rounded-lg p-3 text-xs space-y-2">
          <div className="flex items-start gap-2">
            <ExternalLink className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">In-app browser detected</p>
              <p className="text-muted-foreground">
                Your data might not persist when closing the app. For the best experience:
              </p>
              <ul className="text-muted-foreground space-y-1 ml-2">
                <li>• Bookmark your personal link (copied above)</li>
                <li>• Or open this app in your main browser</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};