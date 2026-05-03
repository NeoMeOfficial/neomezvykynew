import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * CTASticky — sticky-bottom primary CTA with optional sub-text and skip link.
 *
 * Used at the bottom of onboarding steps and paywalls.
 *
 * <CTASticky
 *   label="Aktivovať Plus · 4,99 €"
 *   sub="prvý mesiac, potom 9,99 € / mesiac"
 *   skipLabel="Pokračovať zdarma"
 *   onClick={…}
 *   onSkip={…}
 * />
 */
export interface CTAStickyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  label: string;
  sub?: React.ReactNode;
  skipLabel?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onSkip?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: 'pill' | 'pillGold';
  tone?: 'cream' | 'dark';
  disabled?: boolean;
}

export const CTASticky = React.forwardRef<HTMLDivElement, CTAStickyProps>(
  ({ className, label, sub, skipLabel, onClick, onSkip, variant = 'pill', tone = 'cream', disabled, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'absolute inset-x-0 bottom-0 px-5 pt-4 pb-7',
        tone === 'cream'
          ? 'bg-gradient-to-t from-cream from-70% to-cream/0'
          : 'bg-gradient-to-t from-ink from-70% to-ink/0',
        className
      )}
      {...props}
    >
      <Button
        variant={variant}
        size="pillLg"
        onClick={onClick}
        disabled={disabled}
        className="w-full"
      >
        {label}
      </Button>
      {sub && (
        <div
          className={cn(
            'text-center mt-2.5 text-[11px] font-sans',
            tone === 'cream' ? 'text-ink/56' : 'text-cream/48'
          )}
        >
          {sub}
        </div>
      )}
      {onSkip && (
        <div className="text-center mt-2.5">
          <button
            type="button"
            onClick={onSkip}
            className={cn(
              'font-sans text-[12px] underline underline-offset-2 cursor-pointer bg-transparent border-0',
              tone === 'cream' ? 'text-ink/56 hover:text-ink' : 'text-cream/72 hover:text-cream'
            )}
          >
            {skipLabel || 'Pokračovať zdarma'}
          </button>
        </div>
      )}
    </div>
  )
);
CTASticky.displayName = 'CTASticky';
