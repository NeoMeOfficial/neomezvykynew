import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { persistentStorage } from '@/lib/persistentStorage';

interface CopyLinkButtonProps {
  accessCode: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
  className?: string;
}

export const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({
  accessCode,
  variant = 'outline',
  size = 'sm',
  showText = false,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const copyPersonalLink = async () => {
    try {
      const personalLink = persistentStorage.generatePersonalLink(accessCode);
      await navigator.clipboard.writeText(personalLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: 'Link copied!',
        description: 'Personal link copied to clipboard. Bookmark this to always access your data.',
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: 'Copy failed',
        description: 'Could not copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={copyPersonalLink}
      className={className}
      title="Copy personal link"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {showText && (copied ? 'Copied!' : 'Copy Link')}
    </Button>
  );
};