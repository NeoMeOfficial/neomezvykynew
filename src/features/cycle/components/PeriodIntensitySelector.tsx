import React from 'react';
import { Droplets, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PeriodIntensity } from '../types';

interface PeriodIntensitySelectorProps {
  date: string;
  currentIntensity?: PeriodIntensity;
  onSelect: (intensity: PeriodIntensity | null) => void;
  onClose: () => void;
}

export function PeriodIntensitySelector({ 
  date, 
  currentIntensity, 
  onSelect, 
  onClose 
}: PeriodIntensitySelectorProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('sk-SK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const intensityOptions = [
    { value: 1 as PeriodIntensity, label: 'Slabá', description: 'Veľmi slabé krvácanie' },
    { value: 2 as PeriodIntensity, label: 'Mierná', description: 'Normálne krvácanie' },
    { value: 3 as PeriodIntensity, label: 'Silná', description: 'Silné krvácanie' }
  ];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(253, 242, 248, 0.98) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 8px 32px rgba(149, 95, 106, 0.2)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium" style={{ color: '#FF7782' }}>
            Intenzita menštruácie
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Date */}
        <p className="text-sm" style={{ color: '#955F6A' }}>
          {formatDate(date)}
        </p>

        {/* Intensity Options */}
        <div className="space-y-3">
          {intensityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                currentIntensity === option.value
                  ? 'shadow-lg scale-[1.02]'
                  : 'hover:shadow-md hover:scale-[1.01]'
              }`}
              style={{
                background: currentIntensity === option.value
                  ? 'linear-gradient(135deg, rgba(255, 119, 130, 0.15) 0%, rgba(253, 242, 248, 0.25) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(253, 242, 248, 0.75) 100%)',
                border: currentIntensity === option.value 
                  ? '2px solid #FF7782'
                  : '1px solid rgba(149, 95, 106, 0.1)'
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(option.value)].map((_, i) => (
                    <Droplets 
                      key={i} 
                      className="w-4 h-4" 
                      style={{ color: '#FF7782' }}
                      fill="currentColor"
                    />
                  ))}
                  {[...Array(3 - option.value)].map((_, i) => (
                    <Droplets 
                      key={i + option.value} 
                      className="w-4 h-4" 
                      style={{ color: 'rgba(149, 95, 106, 0.3)' }}
                    />
                  ))}
                </div>
                <div>
                  <div className="font-medium text-sm" style={{ color: '#FF7782' }}>
                    {option.label}
                  </div>
                  <div className="text-xs" style={{ color: '#955F6A' }}>
                    {option.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Remove Option */}
        {currentIntensity && (
          <Button
            variant="outline"
            onClick={() => onSelect(null)}
            className="w-full"
            style={{
              borderColor: 'rgba(149, 95, 106, 0.2)',
              color: '#955F6A'
            }}
          >
            Odstrániť záznam
          </Button>
        )}
      </div>
    </div>
  );
}