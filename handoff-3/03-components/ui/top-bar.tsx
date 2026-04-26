import * as React from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * TopBar — generic screen header.
 *
 * Centered serif title with optional left back-arrow and optional right slot.
 * Used on every secondary/tertiary screen (settings, library detail, etc).
 *
 * <TopBar title="Upozornenia" backHref="/nastavenia" />
 * <TopBar title="Profil" right={<button>…</button>} />
 */
export interface TopBarProps {
  title: React.ReactNode;
  /** If set, renders a left back arrow as <a href>. */
  backHref?: string;
  /** Or pass a click handler instead of href. */
  onBack?: () => void;
  /** Right-side content (icon button, action link, etc). */
  right?: React.ReactNode;
  className?: string;
}

export const TopBar = React.forwardRef<HTMLDivElement, TopBarProps>(
  ({ title, backHref, onBack, right, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        'sticky top-0 z-20 bg-cream/90 backdrop-blur-sm',
        'h-14 px-2 flex items-center justify-between',
        'border-b border-ink/[0.06]',
        className
      )}
    >
      <div className="w-12 flex items-center justify-start">
        {(backHref || onBack) &&
          (backHref ? (
            <a
              href={backHref}
              className="size-10 inline-flex items-center justify-center rounded-full hover:bg-ink/[0.04]"
              aria-label="Späť"
            >
              <ChevronLeft className="size-5 text-ink" />
            </a>
          ) : (
            <button
              type="button"
              onClick={onBack}
              className="size-10 inline-flex items-center justify-center rounded-full hover:bg-ink/[0.04]"
              aria-label="Späť"
            >
              <ChevronLeft className="size-5 text-ink" />
            </button>
          ))}
      </div>

      <h1 className="font-serif text-[17px] text-ink truncate">{title}</h1>

      <div className="w-12 flex items-center justify-end">{right}</div>
    </div>
  )
);
TopBar.displayName = 'TopBar';
