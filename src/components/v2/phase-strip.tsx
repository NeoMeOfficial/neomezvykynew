import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';

/**
 * PhaseStrip — compact cycle phase strip on Home.
 *
 * Shows current cycle day, phase name, and a brief contextual note.
 * Tappable — leads to the Cyklus tab.
 *
 * <PhaseStrip
 *   day={7}
 *   total={28}
 *   phaseName="Folikulárna"
 *   phase="folicular"
 *   note="Energia rastie. Dobrý deň na intenzívny pohyb."
 *   onClick={…}
 * />
 */
export type CyclePhase = 'menstrual' | 'folicular' | 'ovulatory' | 'luteal';

const PHASE_COLOR: Record<CyclePhase, { dot: string; bg: string; text: string }> = {
  menstrual:  { dot: 'bg-pillar-cyklus', bg: 'bg-pillar-cyklus/12', text: 'text-pillar-cyklus-700' },
  folicular:  { dot: 'bg-pillar-strava', bg: 'bg-pillar-strava/12', text: 'text-pillar-strava-700' },
  ovulatory:  { dot: 'bg-gold',          bg: 'bg-gold/12',          text: 'text-gold' },
  luteal:     { dot: 'bg-pillar-mysel',  bg: 'bg-pillar-mysel/12',  text: 'text-pillar-mysel-700' },
};

export interface PhaseStripProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  day: number;
  total?: number;
  phaseName: string;
  phase: CyclePhase;
  note?: React.ReactNode;
}

export const PhaseStrip = React.forwardRef<HTMLButtonElement, PhaseStripProps>(
  ({ className, day, total = 28, phaseName, phase, note, type = 'button', ...props }, ref) => {
    const colors = PHASE_COLOR[phase];
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'w-full text-left rounded-card p-4 flex items-center gap-4',
          'border border-ink/[0.08] bg-white shadow-nm-sm',
          'transition-all duration-150 ease-nm-std hover:shadow-nm-md',
          'active:scale-[0.99]',
          className
        )}
        {...props}
      >
        {/* Day number with phase-tinted disc */}
        <div className={cn('h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0', colors.bg)}>
          <span className={cn('font-serif text-h3', colors.text)}>{day}</span>
        </div>

        <div className="flex-1 min-w-0">
          <Eyebrow tone="muted" className="mb-0.5">
            Cyklus · deň {day}/{total}
          </Eyebrow>
          <SerifHeader as="div" size="h3" className="leading-snug">
            {phaseName}
          </SerifHeader>
          {note && (
            <BodyText size="sm" tone="muted" className="mt-0.5 truncate">
              {note}
            </BodyText>
          )}
        </div>

        <ChevronRight className="size-5 text-ink/40 flex-shrink-0" />
      </button>
    );
  }
);
PhaseStrip.displayName = 'PhaseStrip';
