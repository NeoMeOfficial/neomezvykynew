import * as React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';
import { PlusTag } from '@/components/ui/plus-tag';

/**
 * SettingsGroup — labeled group of settings rows.
 *
 * <SettingsGroup label="Účet">
 *   <SettingsRow href="/nastavenia/profil" title="Profil" />
 *   <SettingsRow href="/nastavenia/predplatne" title="Predplatné" hint="Plus" />
 * </SettingsGroup>
 *
 * Group with no label is unstyled-header (used for destructive group at bottom).
 */
export interface SettingsGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export const SettingsGroup = React.forwardRef<HTMLDivElement, SettingsGroupProps>(
  ({ className, label, children, ...props }, ref) => (
    <div ref={ref} className={cn('mb-2', className)} {...props}>
      {label && (
        <Eyebrow tone="muted" className="px-5 mb-2">
          {label}
        </Eyebrow>
      )}
      <div className="bg-white rounded-card border border-ink/[0.08] mx-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
);
SettingsGroup.displayName = 'SettingsGroup';

/* ─────────────────────────────────────────────────────── */

/**
 * SettingsRow — one row inside a SettingsGroup.
 *
 * <SettingsRow href="/nastavenia/profil" title="Profil" />
 * <SettingsRow href="/nastavenia/predplatne" title="Predplatné" hint="Plus" />
 * <SettingsRow href="/odhlasit" title="Odhlásiť sa" tone="danger" />
 *
 * `hint="Plus"` automatically renders as the PlusTag (gold pill).
 */
export interface SettingsRowProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  /** Primary label (preferred). */
  title?: React.ReactNode;
  /** Older API alias for `title`. */
  label?: React.ReactNode;
  /** Sub-line value. */
  value?: React.ReactNode;
  /** Right-aligned hint text. The literal string "Plus" renders as PlusTag. */
  hint?: React.ReactNode;
  /** Custom right slot — overrides `hint`. */
  right?: React.ReactNode;
  /** href makes the row a Link. */
  href?: string;
  tone?: 'default' | 'danger';
  showChevron?: boolean;
}

export const SettingsRow = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, SettingsRowProps>(
  (
    {
      className,
      title,
      label,
      value,
      hint,
      right,
      href,
      tone = 'default',
      showChevron = true,
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const text = title ?? label;
    const rightSlot = right
      ?? (hint === 'Plus' ? <PlusTag /> : (hint ? <BodyText size="sm" tone="muted">{hint}</BodyText> : null));
    const interactive = !!href || !!onClick;

    const inner = (
      <>
        <div className="min-w-0 flex-1">
          <BodyText size="md" tone="primary" className={cn(tone === 'danger' && 'text-danger')}>
            {text}
          </BodyText>
          {value && (
            <BodyText size="sm" tone="muted" className="mt-0.5">
              {value}
            </BodyText>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {rightSlot}
          {interactive && showChevron && (
            <ChevronRight className={cn('size-5', tone === 'danger' ? 'text-danger/60' : 'text-ink/40')} />
          )}
        </div>
      </>
    );

    const baseClasses = cn(
      'w-full px-5 py-3.5 flex items-center justify-between gap-3 text-left',
      'border-b border-ink/[0.06] last:border-b-0',
      'hover:bg-ink/[0.02] transition-colors',
      tone === 'danger' && 'text-danger',
      className
    );

    if (href) {
      return (
        <Link
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          to={href}
          className={baseClasses}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {inner}
        </Link>
      );
    }
    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type={type}
        onClick={onClick}
        className={baseClasses}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {inner}
      </button>
    );
  }
);
SettingsRow.displayName = 'SettingsRow';
