import React from 'react';
import { Calendar as CalendarIcon, TrendingUp, Settings } from 'lucide-react';

// Ultra-minimal, ultra-fast calendar - no hooks, no heavy operations
export default function MenstrualCalendarUltraFast() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div className="w-full max-w-none px-2 sm:px-4 py-4 sm:py-8 mx-auto">
        <div className="w-full max-w-[600px] mx-auto space-y-6">
          
          {/* Welcome header */}
          <div className="text-center space-y-3">
            <h1 className="text-xl font-medium" style={{ color: '#955F6A' }}>
              Menštruačný kalendár
            </h1>
            <p className="text-sm" style={{ color: '#955F6A', opacity: 0.8 }}>
              Sledujte svoj cyklus jednoducho a bezpečne
            </p>
          </div>

          {/* Quick action buttons */}
          <div className="grid gap-4">
            <div 
              className="p-6 rounded-2xl border transition-all hover:shadow-md cursor-pointer"
              style={{ backgroundColor: '#FBF8F9', borderColor: '#F4415F20' }}
            >
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-8 w-8" style={{ color: '#F4415F' }} />
                <div>
                  <h3 className="font-medium" style={{ color: '#955F6A' }}>
                    Začať sledovanie
                  </h3>
                  <p className="text-sm" style={{ color: '#955F6A', opacity: 0.7 }}>
                    Nastavte svoj menštruačný cyklus
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="p-6 rounded-2xl border transition-all hover:shadow-md cursor-pointer"
              style={{ backgroundColor: '#FBF8F9', borderColor: '#F4415F20' }}
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8" style={{ color: '#F4415F' }} />
                <div>
                  <h3 className="font-medium" style={{ color: '#955F6A' }}>
                    Prehľad cyklu
                  </h3>
                  <p className="text-sm" style={{ color: '#955F6A', opacity: 0.7 }}>
                    Sledujte svoje štatistiky
                  </p>
                </div>
              </div>
            </div>

            <div 
              className="p-6 rounded-2xl border transition-all hover:shadow-md cursor-pointer"
              style={{ backgroundColor: '#FBF8F9', borderColor: '#F4415F20' }}
            >
              <div className="flex items-center space-x-3">
                <Settings className="h-8 w-8" style={{ color: '#F4415F' }} />
                <div>
                  <h3 className="font-medium" style={{ color: '#955F6A' }}>
                    Nastavenia
                  </h3>
                  <p className="text-sm" style={{ color: '#955F6A', opacity: 0.7 }}>
                    Prispôsobte si aplikáciu
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple calendar preview */}
          <div 
            className="p-6 rounded-2xl border"
            style={{ backgroundColor: '#FBF8F9', borderColor: '#F4415F20' }}
          >
            <h3 className="font-medium mb-4 text-center" style={{ color: '#955F6A' }}>
              Decemer 2024
            </h3>
            
            {/* Simple calendar grid */}
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map((day) => (
                <div key={day} className="p-2 text-xs font-medium" style={{ color: '#955F6A' }}>
                  {day}
                </div>
              ))}
              
              {/* Calendar days - static for speed */}
              {Array.from({ length: 31 }, (_, i) => (
                <div 
                  key={i + 1}
                  className="p-2 text-sm rounded hover:bg-rose-50 cursor-pointer transition-colors"
                  style={{ color: '#955F6A' }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs" style={{ color: '#955F6A', opacity: 0.6 }}>
              Bezpečné a súkromné sledovanie vášho cyklu
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}