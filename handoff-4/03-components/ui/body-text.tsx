import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * BodyText — DM Sans body copy.
 *
 * Use for paragraphs, descriptions, list items. Never style with `italic`
 * (italic is reserved for editorial pull quotes in the blog).
 *
 * <BodyText>Krátky úvodný text…</BodyText>
 * <BodyText size="lg" tone="primary">Dôležitejší text.</BodyText>
 * <BodyText size="sm" tone="muted">Vedľajšia poznámka.</BodyText>
 */
type BodySize = 'lg' | 'md' | 'sm' | 'xs';
type BodyTone = 'primary' | 'secondary' | 'muted' | 'onDark';

const sizeClass: Record<BodySize, string> = {
  lg: 'text-lg',
  md: 'text-md',
  sm: 'text-sm',
  xs: 'text-[11px] leading-snug',
};

const toneClass: Record<BodyTone, string> = {
  primary:   'text-ink',
  secondary: 'text-ink/72',
  muted:     'text-ink/56',
  onDark:    'text-cream',
};

export interface BodyTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: BodySize;
  tone?: BodyTone;
  weight?: 'light' | 'regular' | 'medium';
}

export const BodyText = React.forwardRef<HTMLParagraphElement, BodyTextProps>(
  ({ className, size = 'md', tone = 'secondary', weight = 'light', ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'font-sans',
        sizeClass[size],
        toneClass[tone],
        weight === 'light' && 'font-light',
        weight === 'regular' && 'font-normal',
        weight === 'medium' && 'font-medium',
        className
      )}
      {...props}
    />
  )
);
BodyText.displayName = 'BodyText';
