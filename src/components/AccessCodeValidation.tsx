import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AccessCodeValidationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValidCode: (code: string) => void;
}

export const AccessCodeValidation: React.FC<AccessCodeValidationProps> = ({
  open,
  onOpenChange,
  onValidCode,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Zadajte prístupový kód');
      return;
    }

    if (code.length !== 6) {
      setError('Prístupový kód musí mať presne 6 znakov');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-access-code', {
        body: { code: code.toUpperCase() }
      });

      if (error) {
        throw error;
      }

      if (data.valid) {
        onValidCode(data.code);
        setCode('');
        setError('');
      } else {
        setError(data.message || 'Neplatný prístupový kód');
      }
    } catch (err) {
      console.error('Error validating access code:', err);
      setError('Chyba pri overovaní kódu. Skúste to znova.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onOpenChange(false);
  };

  const handlePurchaseClick = () => {
    window.open('https://www.neome.com.au/svk', '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-3xl top-[35%]">
        <DialogHeader>
          <DialogTitle className="text-center">Zadajte prístupový kód</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access-code">Prístupový kód (6 znakov)</Label>
              <Input
                id="access-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="XXXXXX"
                maxLength={6}
                className="text-center text-lg tracking-widest font-mono"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-3">
              <Button 
                type="submit" 
                className="w-full" 
                style={{ backgroundColor: '#5F3E31' }}
                disabled={loading || code.length !== 6}
              >
                {loading ? 'Overujem...' : 'Overiť kód'}
              </Button>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full gap-2" 
                onClick={handlePurchaseClick}
              >
                <ExternalLink className="h-4 w-4" />
                Kúpiť prístup k NeoMe
              </Button>

              <div className="w-full p-3 bg-muted/50 border border-border rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Prístupový kód je poskytovaný po zakúpení prístupu k aplikácii NeoMe.
                </p>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};