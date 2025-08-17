import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccessCode } from '@/hooks/useAccessCode';

interface AccessCodeInputProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccessCodeInput = ({ open, onOpenChange }: AccessCodeInputProps) => {
  const { enterAccessCode } = useAccessCode();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!code.trim()) {
      setError('Prosím zadajte váš kód');
      return;
    }

    // Basic format validation
    const codePattern = /^[A-Z]+-[A-Z]+-\d{4}$/;
    if (!codePattern.test(code.toUpperCase().trim())) {
      setError('Kód musí byť vo formáte SLOVO-SLOVO-ČÍSLA (napr. APPLE-BEACH-1234)');
      return;
    }

    enterAccessCode(code);
    setCode('');
    setError('');
    onOpenChange(false);
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Zadajte váš prístupový kód</DialogTitle>
          <DialogDescription>
            Máte už prístupový kód? Zadajte ho pre prístup k svojim uloženým údajom.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="access-code">Prístupový kód</Label>
            <Input
              id="access-code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="SLOVO-SLOVO-1234"
              className="font-mono"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />
            {error && (
              <p className="text-sm text-destructive mt-1">{error}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              Pokračovať
            </Button>
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Zrušiť
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Kód je vo formáte SLOVO-SLOVO-ČÍSLA, napríklad APPLE-BEACH-1234
        </p>
      </DialogContent>
    </Dialog>
  );
};