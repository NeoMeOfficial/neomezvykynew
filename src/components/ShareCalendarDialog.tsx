import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, Check, Calendar } from "lucide-react";

interface ShareCalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accessCode: string;
}

export const ShareCalendarDialog = ({ open, onOpenChange, accessCode }: ShareCalendarDialogProps) => {
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateShareCode = async () => {
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
          owner_access_code: accessCode,
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
          {!shareCode ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Bezpečné zdieľanie</p>
                  <p>Odkaz bude aktívny 30 dní a umožní prístup k vášmu kalendárnemu prehľadu v režime iba na čítanie.</p>
                </div>
              </div>
              
              <Button 
                onClick={generateShareCode} 
                disabled={generating}
                className="w-full"
              >
                {generating ? "Generuje sa..." : "Vygenerovať zdieľací odkaz"}
              </Button>
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
