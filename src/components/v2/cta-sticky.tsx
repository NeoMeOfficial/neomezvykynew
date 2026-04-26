import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * CTASticky — sticky-bottom primary CTA, supports two API styles:
 *
 *   Object-based (preferred for screens):
 *     <CTASticky
 *       primary={{ label: "Pokračovať", href: "/onboarding/cycle", onClick: save, disabled: false }}
 *       secondary={{ label: "Preskočiť", href: "/onboarding/notifications" }}
 *       legalNote="Pokračovaním súhlasíš s podmienkami."
 *     />
 *
 *   Flat (one-button quick form):
 *     <CTASticky label="Aktivovať" sub="prvý mesiac, potom 9,99 €" onClick={…} skipLabel="Pokračovať zdarma" onSkip={…} />
 */
export interface CTAAction {
  label: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export interface CTAStickyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  // Object-based API (screens)
  primary?: CTAAction;
  secondary?: CTAAction;
  legalNote?: React.ReactNode;
  // Flat API (kept for backwards compatibility)
  label?: string;
  sub?: React.ReactNode;
  skipLabel?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onSkip?: React.MouseEventHandler<HTMLButtonElement>;
  // Shared
  variant?: 'pill' | 'pillGold';
  tone?: 'cream' | 'dark';
  disabled?: boolean;
}

export const CTASticky = React.forwardRef<HTMLDivElement, CTAStickyProps>(
  (
    {
      className,
      primary,
      secondary,
      legalNote,
      label,
      sub,
      skipLabel,
      onClick,
      onSkip,
      variant = 'pill',
      tone = 'cream',
      disabled,
      ...props
    },
    ref
  ) => {
    const navigate = useNavigate();

    // Resolve primary action: prefer object-form, fall back to flat props.
    const primaryLabel = primary?.label ?? label ?? '';
    const primaryDisabled = primary?.disabled ?? disabled ?? false;
    const primaryOnClick: React.MouseEventHandler<HTMLButtonElement> | undefined = (e) => {
      if (primary?.onClick) primary.onClick(e);
      else if (onClick) onClick(e);
      if (!e.defaultPrevented && primary?.href) navigate(primary.href);
    };

    // Secondary action — only render if either explicit secondary (object) or flat skip exists.
    const showSecondary = !!secondary || !!onSkip || !!skipLabel;
    const secondaryLabel = secondary?.label ?? skipLabel ?? 'Pokračovať zdarma';
    const secondaryOnClick: React.MouseEventHandler<HTMLButtonElement> | undefined = (e) => {
      if (secondary?.onClick) secondary.onClick(e);
      else if (onSkip) onSkip(e);
      if (!e.defaultPrevented && secondary?.href) navigate(secondary.href);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-x-0 bottom-0 px-5 pt-4 pb-[max(env(safe-area-inset-bottom),28px)] z-30',
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
          onClick={primaryOnClick}
          disabled={primaryDisabled}
          className="w-full"
        >
          {primaryLabel}
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
        {showSecondary && (
          <div className="text-center mt-2.5">
            <button
              type="button"
              onClick={secondaryOnClick}
              className={cn(
                'font-sans text-[12px] underline underline-offset-2 cursor-pointer bg-transparent border-0',
                tone === 'cream' ? 'text-ink/56 hover:text-ink' : 'text-cream/72 hover:text-cream'
              )}
            >
              {secondaryLabel}
            </button>
          </div>
        )}
        {legalNote && (
          <div
            className={cn(
              'text-center mt-3 text-[11px] font-sans leading-snug',
              tone === 'cream' ? 'text-ink/40' : 'text-cream/40'
            )}
          >
            {legalNote}
          </div>
        )}
      </div>
    );
  }
);
CTASticky.displayName = 'CTASticky';
