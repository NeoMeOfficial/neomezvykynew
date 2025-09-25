import React, { useState } from 'react';
import { Calendar as CalendarIcon, TrendingUp, Lightbulb, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Extremely lightweight initial version for instant loading
export default function MenstrualCycleTrackerFast() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="space-y-6">
        {/* Minimal loading UI - renders instantly */}
        <div className="flex items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-base font-medium" style={{ color: '#955F6A' }}>
              Vitajte v menštruačnom kalendári
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-colors ${
                step === currentStep
                  ? 'bg-rose-400'
                  : step < currentStep
                  ? 'bg-rose-300'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Quick setup form */}
        <div className="space-y-4 p-6 rounded-2xl" style={{ backgroundColor: '#FBF8F9' }}>
          <h3 className="text-lg font-medium text-center" style={{ color: '#955F6A' }}>
            Rýchle nastavenie
          </h3>
          
          <div className="space-y-3">
            <Button 
              onClick={() => setCurrentStep(2)}
              className="w-full py-3 rounded-xl"
              style={{ backgroundColor: '#F4415F', color: 'white' }}
            >
              Začať sledovanie cyklu
            </Button>
            
            <div className="text-center">
              <p className="text-sm" style={{ color: '#955F6A' }}>
                Kompletný kalendár sa načíta na pozadí...
              </p>
            </div>
          </div>
        </div>

        {/* Simple navigation */}
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            style={{ borderColor: '#F4415F', color: '#F4415F' }}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Kalendár
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            style={{ borderColor: '#F4415F', color: '#F4415F' }}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Štatistiky
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            style={{ borderColor: '#F4415F', color: '#F4415F' }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Nastavenia
          </Button>
        </div>
      </div>
    </div>
  );
}