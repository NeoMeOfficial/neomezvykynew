import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, Sparkles } from 'lucide-react';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';

/**
 * UpgradeBanner — inline Plus upgrade affordance for Free users.
 *
 * Subtle gold-tinted card with headline + sub + chevron. Sits between
 * sections on Home / pillar hubs. Never obstructs core flow.
 *
 * <UpgradeBanner
 *   headline="Odomkni Plus"
 *   subline="Programy, jedálniček, plná knižnica."
 *   href="/plus"
 * />
 *
 * `subline` is the screen-side spelling; `sub` is preserved for any
 * earlier callsites.
 */
export interface UpgradeBannerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  headline?: string;
  sub?: React.ReactNode;
  subline?: React.ReactNode;
  href?: string;
}

export const UpgradeBanner = React.forwardRef<HTMLButtonElement, UpgradeBannerProps>(
  (
    {
      className,
      headline = 'Odomkni Plus',
      sub,
      subline,
      href,
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const navigate = useNavigate();
    const subText = subline ?? sub ?? 'Programy, jedálniček, plná knižnica.';
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      if (onClick) onClick(e);
      if (!e.defaultPrevented && href) navigate(href);
    };
    return (
      <button
        ref={ref}
        type={type}
        onClick={handleClick}
        className={cn(
          'w-full text-left rounded-card p-4 flex items-center gap-3',
          'bg-gold/[0.08] border border-gold/30',
          'transition-all duration-150 ease-nm-std hover:bg-gold/[0.12]',
          'active:scale-[0.99]',
          className
        )}
        {...props}
      >
        <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="size-4 text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <SerifHeader as="div" size="h3" className="leading-snug">
            {headline}
          </SerifHeader>
          <BodyText size="sm" tone="muted" className="mt-0.5">
            {subText}
          </BodyText>
        </div>
        <ChevronRight className="size-5 text-gold flex-shrink-0" />
      </button>
    );
  }
);
UpgradeBanner.displayName = 'UpgradeBanner';
