import React, { useState } from 'react';
import { Settings, Check, X, Calendar as CalendarIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CycleData } from './types';
import { UI_TEXT } from './insights';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycleData: CycleData;
  onUpdateCycleLength: (length: number) => void;
  onUpdatePeriodLength: (length: number) => void;
  onEditPeriodStart?: () => void;
  onReset?: () => void; // Added reset function
}

export function SettingsModal({
  isOpen,
  onClose,
  cycleData,
  onUpdateCycleLength,
  onUpdatePeriodLength,
  onEditPeriodStart,
  onReset
}: SettingsModalProps) {
  const isMobile = useIsMobile();
  const [cycleLength, setCycleLength] = useState(cycleData.cycleLength);
  const [periodLength, setPeriodLength] = useState(cycleData.periodLength);

  const handleSave = () => {
    onUpdateCycleLength(cycleLength);
    onUpdatePeriodLength(periodLength);
    onClose();
  };

  const handleCancel = () => {
    setCycleLength(cycleData.cycleLength);
    setPeriodLength(cycleData.periodLength);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`border-0 backdrop-blur-xl shadow-2xl max-w-none bg-white/95 ${
          isMobile 
            ? 'top-0 left-1/2 -translate-x-1/2 translate-y-0 w-[calc(100vw-32px)] max-h-[85vh] overflow-y-auto mx-2 mt-2' 
            : 'sm:max-w-md sm:top-1/2 sm:-translate-y-1/2'
        }`}
        style={{ 
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(253, 242, 248, 0.98) 100%)',
          boxShadow: '0 8px 32px rgba(149, 95, 106, 0.15)'
        }}
        aria-describedby={undefined}
      >
        <DialogHeader className="text-center">
          <DialogTitle className="flex items-center justify-center gap-2 text-lg" style={{ color: '#FF7782' }}>
            <Settings className="w-5 h-5" />
            {UI_TEXT.settings}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-center">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cycleLength" className="text-base" style={{ color: '#955F6A' }}>{UI_TEXT.cycleLength}</Label>
              <div className="flex items-center justify-center space-x-2">
                <Input
                  id="cycleLength"
                  type="number"
                  min="21"
                  max="45"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  className="w-20 text-center text-base border-[#FF7782]/30 focus:border-[#FF7782] focus:ring-[#FF7782]"
                  style={{ color: '#955F6A' }}
                />
                <span className="text-sm" style={{ color: '#955F6A' }}>{UI_TEXT.days}</span>
              </div>
              <p className="text-xs" style={{ color: '#955F6A', opacity: 0.7 }}>
                Obvykle 21-35 dní
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="periodLength" className="text-base" style={{ color: '#955F6A' }}>{UI_TEXT.periodLength}</Label>
              <div className="flex items-center justify-center space-x-2">
                <Input
                  id="periodLength"
                  type="number"
                  min="2"
                  max="10"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(Number(e.target.value))}
                  className="w-20 text-center text-base border-[#FF7782]/30 focus:border-[#FF7782] focus:ring-[#FF7782]"
                  style={{ color: '#955F6A' }}
                />
                <span className="text-sm" style={{ color: '#955F6A' }}>{UI_TEXT.days}</span>
              </div>
              <p className="text-xs" style={{ color: '#955F6A', opacity: 0.7 }}>
                Obvykle 2-10 dní
              </p>
            </div>
          </div>
          
          {onEditPeriodStart && (
            <div className="space-y-2">
              <Label className="text-base" style={{ color: '#955F6A' }}>Začiatok poslednej menštruácie</Label>
              <Button 
                variant="outline" 
                onClick={() => {
                  onEditPeriodStart();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 border-[#FF7782]/30 hover:bg-[#FF7782]/10"
                style={{ color: '#955F6A' }}
              >
                <CalendarIcon className="w-4 h-4" />
                Zmeniť dátum začiatku
              </Button>
              <p className="text-xs" style={{ color: '#955F6A', opacity: 0.7 }}>
                Kliknite pre zmenu dátumu poslednej menštruácie
              </p>
            </div>
           )}
           
           
           <div className="flex gap-2 justify-center pt-4">
             <Button 
               variant="outline" 
               onClick={handleCancel}
               className="border-[#FF7782]/30 hover:bg-[#FF7782]/10"
               style={{ color: '#955F6A' }}
             >
               <X className="w-4 h-4 mr-2" />
               {UI_TEXT.cancel}
             </Button>
             <Button 
               onClick={handleSave} 
               className="bg-gradient-to-r from-[#FF7782] to-[#FF9AA1] text-white hover:from-[#FF6872] hover:to-[#FF8991]"
             >
               <Check className="w-4 h-4 mr-2" />
               {UI_TEXT.save}
             </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}