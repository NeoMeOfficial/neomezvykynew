import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Copy, Check, Settings, Trash2, Edit, Webhook, Shield, ShieldAlert } from 'lucide-react';
import { useAccessCode } from '@/hooks/useAccessCode';
import { persistentStorage } from '@/lib/persistentStorage';

interface AccessCodeSettingsProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AccessCodeSettings = ({ open: externalOpen, onOpenChange }: AccessCodeSettingsProps = {}) => {
  const { accessCode, clearAccessCode, setCustomAccessCode, enterAccessCode } = useAccessCode();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [zapierConnected, setZapierConnected] = useState(false);
  const [showZapierConfig, setShowZapierConfig] = useState(false);
  
  // Handle external control if provided
  const isControlledExternally = externalOpen !== undefined && onOpenChange !== undefined;
  const isOpen = isControlledExternally ? externalOpen : open;
  
  const handleOpenChange = (newOpen: boolean) => {
    if (isControlledExternally) {
      onOpenChange?.(newOpen);
    } else {
      setOpen(newOpen);
    }
  };
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
    handleOpenChange(false);
  };

  const handleChangeCode = () => {
    setShowChangeCode(true);
    setNewCode('');
    setCodeError('');
    setCodeSuccess('');
  };

  const handleSubmitNewCode = async () => {
    if (changeCodeType === 'custom') {
      if (newCode.trim().length < 4) {
        setCodeError('Kód musí obsahovať minimálne 4 znaky');
        return;
      }
      try {
        await setCustomAccessCode(newCode.trim());
      } catch (error) {
        setCodeError('Nepodarilo sa vytvoriť kód');
        return;
      }
    } else {
      if (newCode.trim().length < 4) {
        setCodeError('Kód musí obsahovať minimálne 4 znaky');
        return;
      }
      try {
        await enterAccessCode(newCode.trim());
      } catch (error) {
        setCodeError('Nepodarilo sa zmeniť kód');
        return;
      }
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

  useEffect(() => {
    const loadWebhookConfig = () => {
      const savedWebhook = persistentStorage.getZapierWebhook();
      if (savedWebhook) {
        setWebhookUrl(savedWebhook);
        setZapierConnected(true);
      }
    };
    loadWebhookConfig();
  }, []);

  const handleSaveWebhook = () => {
    if (webhookUrl.trim()) {
      persistentStorage.setZapierWebhook(webhookUrl.trim());
      setZapierConnected(true);
      setCodeSuccess('Zapier webhook saved!');
      setTimeout(() => setCodeSuccess(''), 2000);
    }
  };

  const handleRemoveWebhook = () => {
    persistentStorage.setZapierWebhook('');
    setWebhookUrl('');
    setZapierConnected(false);
    setCodeSuccess('Zapier webhook removed!');
    setTimeout(() => setCodeSuccess(''), 2000);
  };

  if (!accessCode) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
                  variant="secondary" 
                  onClick={() => setShowZapierConfig(!showZapierConfig)}
                  className="w-full"
                >
                  <Webhook className="w-4 h-4 mr-2" />
                  Zapier Backup
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
              
              {showZapierConfig && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Webhook className="w-4 h-4" />
                      <span className="font-medium text-sm">Zapier Webhook Backup</span>
                      {zapierConnected ? (
                        <Shield className="w-4 h-4 text-primary" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="webhook-url" className="text-sm">
                        Zapier Webhook URL
                      </Label>
                      <Input
                        id="webhook-url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleSaveWebhook}
                        disabled={!webhookUrl.trim()}
                        className="flex-1"
                      >
                        Save Webhook
                      </Button>
                      {zapierConnected && (
                        <Button
                          variant="outline"
                          onClick={handleRemoveWebhook}
                          className="flex-1"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        Create a webhook trigger in Zapier to backup your access code to external services. This provides an additional layer of persistence.
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                </>
              )}

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