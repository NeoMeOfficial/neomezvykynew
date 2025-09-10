import React, { useState } from 'react';
import { Settings, Check, X, Calendar as CalendarIcon } from 'lucide-react';
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
}

export function SettingsModal({
  isOpen,
  onClose,
  cycleData,
  onUpdateCycleLength,
  onUpdatePeriodLength,
  onEditPeriodStart
}: SettingsModalProps) {
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
      <DialogContent className="sm:max-w-md sm:translate-y-[-35vh] translate-y-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {UI_TEXT.settings}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cycleLength">{UI_TEXT.cycleLength}</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="cycleLength"
                type="number"
                min="21"
                max="45"
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="w-20 text-base"
              />
              <span className="text-sm text-muted-foreground">{UI_TEXT.days}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Obvykle 21-35 dní
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="periodLength">{UI_TEXT.periodLength}</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="periodLength"
                type="number"
                min="2"
                max="10"
                value={periodLength}
                onChange={(e) => setPeriodLength(Number(e.target.value))}
                className="w-20 text-base"
              />
              <span className="text-sm text-muted-foreground">{UI_TEXT.days}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Obvykle 3-7 dní
            </p>
          </div>
          
          {onEditPeriodStart && (
            <div className="space-y-2">
              <Label>Začiatok poslednej menštruácie</Label>
              <Button 
                variant="outline" 
                onClick={() => {
                  onEditPeriodStart();
                  onClose();
                }}
                className="w-full flex items-center gap-2"
              >
                <CalendarIcon className="w-4 h-4" />
                Zmeniť dátum začiatku
              </Button>
              <p className="text-xs text-muted-foreground">
                Kliknite pre zmenu dátumu poslednej menštruácie
              </p>
            </div>
          )}
          
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              {UI_TEXT.cancel}
            </Button>
            <Button onClick={handleSave} variant="hero">
              <Check className="w-4 h-4 mr-2" />
              {UI_TEXT.save}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}