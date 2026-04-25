import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { PlusTag } from '@/components/ui/plus-tag';

/**
 * RitualCard — daily ritual card on Home.
 *
 * Five fixed slots in fixed order: Body · Nutrition · Mindset · Habits · Reflections.
 * Each card has eyebrow + title + sub + optional state pill + optional Plus tag.
 *
 * <RitualCard
 *   pillar="telo"
 *   eyebrow="Pohyb"
 *   title="Postpartum · 2. týždeň"
 *   sub="14 min · jemná mobilita"
 *   state="Pripravené"
 *   onClick={…}
 * />
 */
export type PillarKey = 'telo' | 'strava' | 'mysel' | 'cyklus';

const PILLAR_BG: Record<PillarKey, string> = {
  telo:   'bg-pillar-telo/10',
  strava: 'bg-pillar-strava/12',
  mysel:  'bg-pillar-mysel/12',
  cyklus: 'bg-pillar-cyklus/12',
};

const PILLAR_DOT: Record<PillarKey, string> = {
  telo:   'bg-pillar-telo',
  strava: 'bg-pillar-strava',
  mysel:  'bg-pillar-mysel',
  cyklus: 'bg-pillar-cyklus',
};

export interface RitualCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pillar: PillarKey;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  sub?: React.ReactNode;
  state?: React.ReactNode;
  locked?: boolean;
}

export const RitualCard = React.forwardRef<HTMLButtonElement, RitualCardProps>(
  ({ className, pillar, eyebrow, title, sub, state, locked = false, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'w-full text-left rounded-card p-5 flex items-center gap-4',
        'border border-ink/[0.08] shadow-nm-sm bg-white',
        'transition-all duration-150 ease-nm-std hover:shadow-nm-md',
        'active:scale-[0.99]',
        className
      )}
      {...props}
    >
      {/* Pillar accent dot */}
      <div className={cn('h-12 w-1 rounded-full flex-shrink-0', PILLAR_DOT[pillar])} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Eyebrow tone="muted">{eyebrow}</Eyebrow>
          {locked && <PlusTag />}
        </div>
        <SerifHeader as="div" size="h3" className="leading-snug truncate">
          {title}
        </SerifHeader>
        {sub && (
          <BodyText size="sm" tone="muted" className="mt-0.5 truncate">
            {sub}
          </BodyText>
        )}
      </div>

      {state && (
        <div className={cn(
          'rounded-full px-3 py-1 text-[11px] font-sans font-medium tracking-wide flex-shrink-0',
          PILLAR_BG[pillar]
        )}>
          {state}
        </div>
      )}
      <ChevronRight className="size-5 text-ink/40 flex-shrink-0" />
    </button>
  )
);
RitualCard.displayName = 'RitualCard';
