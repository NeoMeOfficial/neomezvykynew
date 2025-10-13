import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Check, Calendar, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ShareCalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessCode: string | null;
  onAccessCodeGenerated?: (code: string) => void;
}

export const ShareCalendarDialog = ({ open, onOpenChange, accessCode, onAccessCodeGenerated }: ShareCalendarDialogProps) => {
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatingAccessCode, setGeneratingAccessCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localAccessCode, setLocalAccessCode] = useState<string | null>(accessCode);
  const { toast } = useToast();

  // Update local access code when prop changes
  useEffect(() => {
    setLocalAccessCode(accessCode);
  }, [accessCode]);

  // Auto-generate access code if needed, then share code
  useEffect(() => {
    if (open && !shareCode) {
      if (!localAccessCode) {
        handleGenerateAccessCode();
      } else {
        generateShareCode();
      }
    }
  }, [open, localAccessCode]);

  const handleGenerateAccessCode = async () => {
    setGeneratingAccessCode(true);
    try {
      // Call the database function to generate a unique access code
      const { data, error } = await supabase.rpc('generate_access_code');
      
      if (error) throw error;
      
      const newAccessCode = data as string;
      setLocalAccessCode(newAccessCode);
      
      // Notify parent component
      if (onAccessCodeGenerated) {
        onAccessCodeGenerated(newAccessCode);
      }
      
      toast({
        title: "Kód vytvorený",
        description: "Váš prístupový kód bol úspešne vytvorený",
      });
    } catch (error) {
      console.error('Error generating access code:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vygenerovať prístupový kód",
        variant: "destructive",
      });
    } finally {
      setGeneratingAccessCode(false);
    }
  };

  const generateShareCode = async () => {
    if (!localAccessCode) return;
    
    setGenerating(true);
    try {
      // Generate a random 6-character code
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // Insert into database
      const { data, error } = await supabase
        .from('shared_access_codes')
        .insert({
          code,
          owner_access_code: localAccessCode,
        })
        .select()
        .single();

      if (error) throw error;

      setShareCode(data.code);
      toast({
        title: "Kód vygenerovaný",
        description: "Zdieľací odkaz bol úspešne vytvorený",
      });
    } catch (error) {
      console.error('Error generating share code:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa vygenerovať zdieľací kód",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const shareUrl = shareCode 
    ? `${window.location.origin}/shared/${shareCode}`
    : null;

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Skopírované",
        description: "Odkaz bol skopírovaný do schránky",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa skopírovať odkaz",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setShareCode(null);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Zdieľať kalendár
          </DialogTitle>
          <DialogDescription>
            Vytvorte zdieľací odkaz pre lekára alebo inú dôveryhodnú osobu
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {generatingAccessCode || generating || !shareCode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {generatingAccessCode ? "Vytvára sa váš prístupový kód..." : "Generuje sa zdieľací odkaz..."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Zdieľací odkaz</label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl || ''}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                <p className="font-medium">Kód: {shareCode}</p>
                <p className="text-muted-foreground">
                  Platnosť: 30 dní od vytvorenia
                </p>
              </div>

              <Button 
                onClick={handleClose}
                variant="outline"
                className="w-full"
              >
                Zavrieť
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
