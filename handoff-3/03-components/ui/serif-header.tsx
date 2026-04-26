import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * SerifHeader — Gilda Display heading.
 *
 * Use for screen titles, hero copy, card titles. NEVER for body or eyebrow.
 *
 * <SerifHeader as="h1" size="display">Vitaj späť, Eva</SerifHeader>
 * <SerifHeader as="h2" size="h1">Tvoja kniha</SerifHeader>
 */
type SerifSize = 'display' | 'hero' | 'h1' | 'h2' | 'h3';

const sizeClass: Record<SerifSize, string> = {
  display: 'text-display',  // 42px
  hero:    'text-hero',     // 34px
  h1:      'text-h1',       // 28px
  h2:      'text-h2',       // 22px
  h3:      'text-h3',       // 18px
};

export interface SerifHeaderProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  size?: SerifSize;
  italic?: boolean;
}

export const SerifHeader = React.forwardRef<HTMLHeadingElement, SerifHeaderProps>(
  ({ className, as: Comp = 'h2', size = 'h1', italic = false, ...props }, ref) => (
    <Comp
      ref={ref as any}
      className={cn(
        'font-serif text-ink leading-tight tracking-hero',
        sizeClass[size],
        italic && 'italic',
        className
      )}
      {...props}
    />
  )
);
SerifHeader.displayName = 'SerifHeader';
