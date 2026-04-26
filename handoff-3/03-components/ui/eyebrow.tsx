import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Eyebrow — small uppercase tracked label, used above serif headers.
 *
 * <Eyebrow>Pondelok · 21. apríl</Eyebrow>
 * <Eyebrow tone="muted">Z tvojej knižnice</Eyebrow>
 */
export interface EyebrowProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'default' | 'muted' | 'gold';
  size?: 'xs' | 'sm';
}

export const Eyebrow = React.forwardRef<HTMLDivElement, EyebrowProps>(
  ({ className, tone = 'default', size = 'xs', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'font-sans uppercase tracking-eyebrow font-medium',
        size === 'xs' ? 'text-[11px]' : 'text-[13px]',
        tone === 'default' && 'text-ink/56',
        tone === 'muted' && 'text-ink/40',
        tone === 'gold' && 'text-gold',
        className
      )}
      {...props}
    />
  )
);
Eyebrow.displayName = 'Eyebrow';
