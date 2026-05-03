import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * PriceDisplay — large serif price with period + optional strikethrough.
 *
 * <PriceDisplay amount="4,99 €" period="prvý mesiac" strike="9,99 €" />
 */
export interface PriceDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: string;
  period?: string;
  strike?: string;
  tone?: 'ink' | 'onDark';
  size?: 'lg' | 'md';
}

export const PriceDisplay = React.forwardRef<HTMLDivElement, PriceDisplayProps>(
  ({ className, amount, period, strike, tone = 'ink', size = 'lg', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-baseline gap-2', className)}
      {...props}
    >
      <span
        className={cn(
          'font-serif leading-none',
          size === 'lg' ? 'text-[44px]' : 'text-h1',
          tone === 'ink' ? 'text-ink' : 'text-cream'
        )}
      >
        {amount}
      </span>
      {period && (
        <span className={cn('font-sans text-sm', tone === 'ink' ? 'text-ink/56' : 'text-cream/60')}>
          {period}
        </span>
      )}
      {strike && (
        <span className={cn('font-sans text-sm line-through', tone === 'ink' ? 'text-ink/40' : 'text-cream/48')}>
          {strike}
        </span>
      )}
    </div>
  )
);
PriceDisplay.displayName = 'PriceDisplay';
