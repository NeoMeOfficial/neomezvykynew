import React from 'react';

interface ConnectionStatusProps {
  connected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ connected }) => {
  return (
    <div className="flex items-center justify-center mb-1">
      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <div 
          className={`w-2 h-2 rounded-full ${
            connected ? 'bg-green-500' : 'bg-yellow-500'
          }`}
        />
        <span>
          {connected ? 'Uložené anonymne' : 'Lokálne úložisko'}
        </span>
      </div>
    </div>
  );
};