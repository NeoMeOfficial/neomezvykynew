import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save, X, Lightbulb } from 'lucide-react';
import { temporaryStorage } from '@/lib/temporaryStorage';

interface SaveProgressDialogProps {
  isOpen: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export function SaveProgressDialog({ isOpen, onSave, onDiscard, onCancel }: SaveProgressDialogProps) {
  const dataSummary = temporaryStorage.getDataSummary();

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Save className="h-5 w-5 text-primary" />
            Uložiť pokrok?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Máš neuložené údaje, ktoré sa stratia ak odídeš bez vytvorenia kódu.
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  {dataSummary.habitEntries > 0 && (
                    <div>• {dataSummary.habitEntries} záznamov návykov</div>
                  )}
                  {dataSummary.reflectionEntries > 0 && (
                    <div>• {dataSummary.reflectionEntries} reflexií</div>
                  )}
                  {dataSummary.hasCycleData && (
                    <div>• Nastavenia cyklu</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              onClick={onSave}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Vytvoriť kód a uložiť pokrok
            </Button>
            
            <Button 
              onClick={onDiscard}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <X className="h-4 w-4 mr-2" />
              Odísť bez uloženia
            </Button>
            
            <Button 
              onClick={onCancel}
              variant="ghost"
              className="w-full"
            >
              Zrušiť
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}