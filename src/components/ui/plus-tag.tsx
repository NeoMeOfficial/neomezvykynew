import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * PlusTag — small gold "Plus" chip.
 *
 * Marks affordances/features that require Plus tier. Always inline next to
 * the affordance label, never as a standalone CTA.
 *
 * <span>Jedálniček <PlusTag /></span>
 */
export interface PlusTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm';
}

export const PlusTag = React.forwardRef<HTMLSpanElement, PlusTagProps>(
  ({ className, size = 'xs', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full font-sans font-semibold uppercase ' +
          'border border-gold text-gold bg-gold/[0.12] tracking-[0.12em]',
        size === 'xs' ? 'px-[7px] py-[2px] text-[10px]' : 'px-2 py-[3px] text-[11px]',
        className
      )}
      {...props}
    >
      Plus
    </span>
  )
);
PlusTag.displayName = 'PlusTag';
