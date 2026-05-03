import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Check } from 'lucide-react';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { PlusTag } from '@/components/ui/plus-tag';

/**
 * RitualCard — daily ritual card on Home.
 *
 * Five fixed slots in fixed order: Body · Nutrition · Mindset · Habits · Reflections.
 * The first three use a pillar accent; the last two (Návyky / Reflexie) use ink.
 *
 * <RitualCard
 *   pillar="telo"
 *   eyebrow="POHYB"
 *   title="Postpartum · 2. týždeň"
 *   subtitle="14 min · jemná mobilita"
 *   status="ready"
 *   duration="14 min"
 *   href="/telo/program"
 * />
 *
 * Status pill copy is derived from `status` automatically (see STATUS_LABEL),
 * but you can override with the `state` prop for one-off labels.
 */
export type PillarKey = 'telo' | 'strava' | 'mysel' | 'cyklus' | 'ink';
export type RitualStatus =
  | 'ready'
  | 'in-progress'
  | 'completed'
  | 'not-started'
  | 'locked';

const PILLAR_BG: Record<PillarKey, string> = {
  telo: 'bg-pillar-telo/10',
  strava: 'bg-pillar-strava/12',
  mysel: 'bg-pillar-mysel/12',
  cyklus: 'bg-pillar-cyklus/12',
  ink: 'bg-ink/[0.06]',
};

const PILLAR_DOT: Record<PillarKey, string> = {
  telo: 'bg-pillar-telo',
  strava: 'bg-pillar-strava',
  mysel: 'bg-pillar-mysel',
  cyklus: 'bg-pillar-cyklus',
  ink: 'bg-ink/60',
};

const STATUS_LABEL: Record<RitualStatus, string> = {
  ready: 'Pripravené',
  'in-progress': 'Rozbehnuté',
  completed: 'Hotovo',
  'not-started': 'Začať',
  locked: 'Plus',
};

export interface RitualCardProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  pillar: PillarKey;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  /** Body copy under the title. Alias: `sub`. */
  subtitle?: React.ReactNode;
  /** @deprecated Use `subtitle`. Kept as alias for older call sites. */
  sub?: React.ReactNode;
  /** Pill copy. If omitted, derived from `status`. */
  state?: React.ReactNode;
  /** Drives default pill copy + completed checkmark. */
  status?: RitualStatus;
  /** Extra meta line shown after subtitle, e.g. "14 min". */
  duration?: React.ReactNode;
  /** Habits-style fractional progress (0–1). Renders a thin progress rule. */
  progress?: number;
  /** Plus-tier inline upsell key. Currently only "sada" (meal plan). */
  upsell?: 'sada' | null;
  /** Plus-tier program fallback key. "navrhnuty-cvik" = suggested exercise. */
  fallback?: 'navrhnuty-cvik' | null;
  /** Free-tier lock — shows Plus chip. */
  locked?: boolean;
  /** If set, renders as <a> instead of <button>. */
  href?: string;
}

export const RitualCard = React.forwardRef<HTMLButtonElement, RitualCardProps>(
  (
    {
      className,
      pillar,
      eyebrow,
      title,
      subtitle,
      sub,
      state,
      status,
      duration,
      progress,
      upsell,
      fallback,
      locked = false,
      href,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const subCopy = subtitle ?? sub;
    const pillCopy = state ?? (status ? STATUS_LABEL[status] : null);
    const isCompleted = status === 'completed';
    const isLocked = locked || status === 'locked';

    const inner = (
      <>
        {/* Pillar accent rail */}
        <div className={cn('h-12 w-1 rounded-full flex-shrink-0', PILLAR_DOT[pillar])} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Eyebrow tone="muted">{eyebrow}</Eyebrow>
            {isLocked && <PlusTag />}
            {upsell === 'sada' && (
              <span className="text-[10px] uppercase tracking-[0.12em] text-pillar-strava font-medium">
                + Sada
              </span>
            )}
            {fallback === 'navrhnuty-cvik' && (
              <span className="text-[10px] uppercase tracking-[0.12em] text-ink/50 font-medium">
                Návrh
              </span>
            )}
          </div>
          <SerifHeader as="div" size="h3" className="leading-snug truncate">
            {title}
          </SerifHeader>
          {subCopy && (
            <BodyText size="sm" tone="muted" className="mt-0.5 truncate">
              {subCopy}
              {duration && <span className="ml-1 text-ink/40">· {duration}</span>}
            </BodyText>
          )}
          {typeof progress === 'number' && (
            <div className="mt-2 h-[2px] w-full rounded-full bg-ink/[0.08] overflow-hidden">
              <div
                className={cn('h-full rounded-full', PILLAR_DOT[pillar])}
                style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
              />
            </div>
          )}
        </div>

        {pillCopy && (
          <div
            className={cn(
              'rounded-full px-3 py-1 text-[11px] font-sans font-medium tracking-wide flex-shrink-0 inline-flex items-center gap-1',
              PILLAR_BG[pillar]
            )}
          >
            {isCompleted && <Check className="size-3" />}
            {pillCopy}
          </div>
        )}
        <ChevronRight className="size-5 text-ink/40 flex-shrink-0" />
      </>
    );

    const baseClass = cn(
      'w-full text-left rounded-card p-5 flex items-center gap-4',
      'border border-ink/[0.08] shadow-nm-sm bg-white',
      'transition-all duration-150 ease-nm-std hover:shadow-nm-md',
      'active:scale-[0.99]',
      className
    );

    if (href) {
      return (
        <a href={href} className={baseClass} {...(props as any)}>
          {inner}
        </a>
      );
    }

    return (
      <button ref={ref} type={type} className={baseClass} {...props}>
        {inner}
      </button>
    );
  }
);
RitualCard.displayName = 'RitualCard';
