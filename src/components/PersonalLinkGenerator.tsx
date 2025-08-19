import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { persistentStorage } from '@/lib/persistentStorage';
import { useToast } from '@/hooks/use-toast';

interface PersonalLinkGeneratorProps {
  accessCode: string;
}

export const PersonalLinkGenerator: React.FC<PersonalLinkGeneratorProps> = ({ accessCode }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const personalLink = persistentStorage.generatePersonalLink(accessCode);
  const isEmbedded = persistentStorage.isEmbedded();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(personalLink);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Your personal link has been copied to clipboard.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please manually copy the link below.",
        variant: "destructive",
      });
    }
  };

  const openInNewTab = () => {
    window.open(personalLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Personal Link
        </CardTitle>
        <CardDescription>
          Share this link to access your habits from any device. Your data will automatically sync across all devices using this link.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="personal-link">Your Personal Link</Label>
          <div className="flex gap-2">
            <Input
              id="personal-link"
              value={personalLink}
              readOnly
              className="flex-1 font-mono text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
        
        {isEmbedded && (
          <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-2">
              <ExternalLink className="w-4 h-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">Open in full browser</p>
                <p className="text-xs text-muted-foreground mt-1">
                  For the best experience and full storage access, open your personal link in a new tab.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openInNewTab}
                  className="mt-2"
                >
                  Open Personal Link
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <p>💡 <strong>Pro tip:</strong> Bookmark this link to instantly access your habits from any browser or device!</p>
        </div>
      </CardContent>
    </Card>
  );
};