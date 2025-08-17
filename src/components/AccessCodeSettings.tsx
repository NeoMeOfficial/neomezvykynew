import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, Settings, Trash2 } from 'lucide-react';
import { useAccessCode } from '@/hooks/useAccessCode';

export const AccessCodeSettings = () => {
  const { accessCode, clearAccessCode } = useAccessCode();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopyCode = async () => {
    if (accessCode) {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClearCode = () => {
    clearAccessCode();
    setOpen(false);
  };

  if (!accessCode) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="fixed top-4 right-4 z-10">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nastavenia kódu</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Váš prístupový kód:</label>
            <div className="bg-muted p-3 rounded-lg font-mono text-center mt-1">
              {accessCode}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              onClick={handleCopyCode}
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Skopírované!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Kopírovať kód
                </>
              )}
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleClearCode}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Vymazať kód
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Ak vymažete kód, stratíte prístup k uloženým údajom. Môžete si vytvoriť nový kód alebo zadať existujúci.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};