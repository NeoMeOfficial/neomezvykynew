import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { temporaryStorage } from '@/lib/temporaryStorage';

interface TemporaryDataIndicatorProps {
  className?: string;
  onShowAccessCodeValidation?: () => void;
}

export function TemporaryDataIndicator({ className = '', onShowAccessCodeValidation }: TemporaryDataIndicatorProps) {
  if (!temporaryStorage.isSessionActive() || !temporaryStorage.hasTemporaryData()) {
    return null;
  }

  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-amber-600" />
        <div className="flex-1">
          <p className="text-base font-medium text-amber-800">
            Dočasné údaje
          </p>
          <p className="text-sm text-amber-700">
            Tvoj pokrok sa neuloží bez{' '}
            <button 
              onClick={onShowAccessCodeValidation}
              className="underline hover:text-amber-800 transition-colors"
            >
              zadania kódu
            </button>
          </p>
        </div>
        <AlertCircle className="h-4 w-4 text-amber-500" />
      </div>
    </div>
  );
}