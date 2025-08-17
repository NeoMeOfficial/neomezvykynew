import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Settings, Trash2, Edit } from 'lucide-react';
import { useAccessCode } from '@/hooks/useAccessCode';

export const AccessCodeSettings = () => {
  const { accessCode, clearAccessCode, setCustomAccessCode, enterAccessCode } = useAccessCode();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [showChangeCode, setShowChangeCode] = useState(false);
  const [changeCodeType, setChangeCodeType] = useState<'custom' | 'existing'>('custom');
  const [newCode, setNewCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');

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

  const handleChangeCode = () => {
    setShowChangeCode(true);
    setNewCode('');
    setCodeError('');
    setCodeSuccess('');
  };

  const handleSubmitNewCode = () => {
    if (changeCodeType === 'custom') {
      if (newCode.trim().length < 4) {
        setCodeError('Kód musí obsahovať minimálne 4 znaky');
        return;
      }
      setCustomAccessCode(newCode.trim());
    } else {
      if (newCode.trim().length < 4) {
        setCodeError('Kód musí obsahovať minimálne 4 znaky');
        return;
      }
      enterAccessCode(newCode.trim());
    }
    
    setCodeSuccess('Kód bol úspešne zmenený!');
    setTimeout(() => {
      setShowChangeCode(false);
      setCodeSuccess('');
    }, 1500);
  };

  const resetChangeCodeForm = () => {
    setShowChangeCode(false);
    setNewCode('');
    setCodeError('');
    setCodeSuccess('');
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
          {!showChangeCode ? (
            <>
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
                  variant="secondary" 
                  onClick={handleChangeCode}
                  className="w-full"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Zmeniť kód
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
            </>
          ) : (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium">Zmeňte svoj prístupový kód:</label>
                
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant={changeCodeType === 'custom' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setChangeCodeType('custom');
                        setCodeError('');
                        setNewCode('');
                      }}
                      className="flex-1"
                    >
                      Vytvoriť nový
                    </Button>
                    <Button
                      variant={changeCodeType === 'existing' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setChangeCodeType('existing');
                        setCodeError('');
                        setNewCode('');
                      }}
                      className="flex-1"
                    >
                      Zadať existujúci
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-code" className="text-sm">
                    {changeCodeType === 'custom' 
                      ? 'Váš nový vlastný kód (min. 4 znaky)' 
                      : 'Existujúci kód (min. 4 znaky)'
                    }
                  </Label>
                  <Input
                    id="new-code"
                    value={newCode}
                    onChange={(e) => {
                      setNewCode(e.target.value.toUpperCase());
                      setCodeError('');
                    }}
                    placeholder={changeCodeType === 'custom' ? 'MOJNOVYKOD' : 'EXISTUJUCIKOD'}
                    className="font-mono mt-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmitNewCode();
                      }
                    }}
                  />
                  {codeError && (
                    <p className="text-destructive text-xs mt-1">{codeError}</p>
                  )}
                  {codeSuccess && (
                    <p className="text-green-600 text-xs mt-1 font-medium">{codeSuccess}</p>
                  )}
                </div>

                <div className="bg-background border border-primary/20 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    {changeCodeType === 'custom' 
                      ? '💡 Vytvoríte si vlastný kód. Automaticky sa pridá jedinečný identifikátor.' 
                      : '⚠️ Zadajte existujúci kód na prístup k uloženým údajom.'
                    }
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={resetChangeCodeForm}
                    className="flex-1"
                  >
                    Zrušiť
                  </Button>
                  <Button
                    onClick={handleSubmitNewCode}
                    disabled={newCode.trim().length < 4}
                    className="flex-1"
                  >
                    {changeCodeType === 'custom' ? 'Vytvoriť' : 'Zmeniť'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};