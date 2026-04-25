import * as React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { PlusTag } from '@/components/ui/plus-tag';

/**
 * RitualCard — daily ritual card on Home.
 *
 * Five fixed slots in fixed order: Body · Nutrition · Mindset · Habits · Reflections.
 * Pillar="ink" is used for Habits/Reflections (no pillar accent).
 *
 * <RitualCard
 *   pillar="telo"
 *   eyebrow="POHYB"
 *   title="Postpartum · 2. týždeň"
 *   subtitle="14 min · jemná mobilita"
 *   status="not-started"
 *   duration="14 min"
 *   href="/kniznica/telo"
 * />
 */
export type PillarKey = 'telo' | 'strava' | 'mysel' | 'cyklus' | 'ink';
export type RitualStatus = 'not-started' | 'in-progress' | 'done';

const PILLAR_BG: Record<PillarKey, string> = {
  telo:   'bg-pillar-telo/10',
  strava: 'bg-pillar-strava/12',
  mysel:  'bg-pillar-mysel/12',
  cyklus: 'bg-pillar-cyklus/12',
  ink:    'bg-ink/[0.06]',
};

const PILLAR_DOT: Record<PillarKey, string> = {
  telo:   'bg-pillar-telo',
  strava: 'bg-pillar-strava',
  mysel:  'bg-pillar-mysel',
  cyklus: 'bg-pillar-cyklus',
  ink:    'bg-ink/24',
};

const STATUS_LABEL: Record<RitualStatus, string> = {
  'not-started': 'Pripravené',
  'in-progress': 'V priebehu',
  'done':        'Hotové',
};

export interface RitualCardProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  pillar: PillarKey;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  /** Sub-line text. Backwards-compat alias for `sub`. */
  subtitle?: React.ReactNode;
  /** Older API. */
  sub?: React.ReactNode;
  /** Display state pill. If a string-typed status is passed, it maps to a Slovak label. */
  status?: RitualStatus;
  /** Free-text override for the state pill (takes precedence over `status`). */
  state?: React.ReactNode;
  /** Duration like "14 min" — appended to the subtitle when present. */
  duration?: React.ReactNode;
  /** Plus-only content marker. */
  locked?: boolean;
  /** href for navigation; renders as <Link>. If absent, renders as <button>. */
  href?: string;
  /** Inline upsell key — e.g. "sada" shows a SADA upsell label below subtitle. */
  upsell?: 'sada' | string;
  /** Fallback key for users without a program — e.g. "navrhnuty-cvik". */
  fallback?: 'navrhnuty-cvik' | string;
  /** Optional 0–1 progress; renders a small thin progress bar under the title. */
  progress?: number;
}

const UPSELL_COPY: Record<string, string> = {
  'sada': 'Aktivuj SADA — denný plán na mieru',
};

const FALLBACK_COPY: Record<string, string> = {
  'navrhnuty-cvik': 'Bez programu — navrhnutý cvik',
};

const RitualCardInner = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, RitualCardProps & { asLink?: boolean; to?: string }>(
  (
    {
      className,
      pillar,
      eyebrow,
      title,
      subtitle,
      sub,
      status,
      state,
      duration,
      locked = false,
      upsell,
      fallback,
      progress,
      asLink,
      to,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const subText = subtitle ?? sub;
    const stateLabel = state ?? (status ? STATUS_LABEL[status] : undefined);

    // Combine subtitle + duration into one line (subtitle · duration)
    const combinedSub = duration && subText
      ? <>{subText} · {duration}</>
      : subText ?? duration;

    const inner = (
      <>
        <div className={cn('h-12 w-1 rounded-full flex-shrink-0', PILLAR_DOT[pillar])} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Eyebrow tone="muted">{eyebrow}</Eyebrow>
            {locked && <PlusTag />}
          </div>
          <SerifHeader as="div" size="h3" className="leading-snug truncate">
            {title}
          </SerifHeader>
          {combinedSub && (
            <BodyText size="sm" tone="muted" className="mt-0.5 truncate">
              {combinedSub}
            </BodyText>
          )}
          {fallback && FALLBACK_COPY[fallback] && (
            <BodyText size="sm" tone="muted" className="mt-1 italic truncate">
              {FALLBACK_COPY[fallback]}
            </BodyText>
          )}
          {upsell && UPSELL_COPY[upsell] && (
            <BodyText size="sm" tone="muted" className="mt-1 truncate">
              {UPSELL_COPY[upsell]}
            </BodyText>
          )}
          {typeof progress === 'number' && (
            <div className="mt-2 h-1 rounded-full bg-ink/[0.06] overflow-hidden">
              <div
                className={cn('h-full rounded-full', pillar === 'ink' ? 'bg-ink/40' : PILLAR_DOT[pillar])}
                style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
              />
            </div>
          )}
        </div>
        {stateLabel && (
          <div
            className={cn(
              'rounded-full px-3 py-1 text-[11px] font-sans font-medium tracking-wide flex-shrink-0',
              PILLAR_BG[pillar]
            )}
          >
            {stateLabel}
          </div>
        )}
        <ChevronRight className="size-5 text-ink/40 flex-shrink-0" />
      </>
    );

    const baseClasses = cn(
      'w-full text-left rounded-card p-5 flex items-center gap-4',
      'border border-ink/[0.08] shadow-nm-sm bg-white',
      'transition-all duration-150 ease-nm-std hover:shadow-nm-md',
      'active:scale-[0.99]',
      className
    );

    if (asLink && to) {
      return (
        <Link
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          to={to}
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
        className={baseClasses}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {inner}
      </button>
    );
  }
);
RitualCardInner.displayName = 'RitualCardInner';

export const RitualCard = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, RitualCardProps>(
  ({ href, ...props }, ref) =>
    href
      ? <RitualCardInner ref={ref} asLink to={href} {...props} />
      : <RitualCardInner ref={ref} {...props} />
);
RitualCard.displayName = 'RitualCard';
