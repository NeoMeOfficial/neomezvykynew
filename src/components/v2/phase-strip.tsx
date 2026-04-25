import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { Eyebrow } from '@/components/ui/eyebrow';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';

/**
 * PhaseStrip — compact cycle phase strip on Home.
 *
 * Two states:
 *   - "active":  show day, phase name, optional note
 *   - "prompt":  show a setup prompt for users with no cycle data
 *
 * <PhaseStrip
 *   state="active"
 *   phase="follicular"
 *   dayOfCycle={7}
 *   note="Energia rastie. Dobrý deň na intenzívny pohyb."
 *   onClick={…}
 * />
 *
 * <PhaseStrip state="prompt" />
 */
export type CyclePhase =
  | 'menstrual' | 'menstruation'
  | 'folicular' | 'follicular'
  | 'ovulatory' | 'ovulation'
  | 'luteal';

type PhaseKey = 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';

const normalisePhase = (p?: CyclePhase): PhaseKey | undefined => {
  if (!p) return undefined;
  if (p === 'menstrual' || p === 'menstruation') return 'menstrual';
  if (p === 'folicular' || p === 'follicular') return 'follicular';
  if (p === 'ovulatory' || p === 'ovulation') return 'ovulatory';
  if (p === 'luteal') return 'luteal';
  return undefined;
};

const PHASE_LABEL: Record<PhaseKey, string> = {
  menstrual:  'Menštruácia',
  follicular: 'Folikulárna',
  ovulatory:  'Ovulácia',
  luteal:     'Luteálna',
};

const PHASE_COLOR: Record<PhaseKey, { dot: string; bg: string; text: string }> = {
  menstrual:  { dot: 'bg-pillar-cyklus', bg: 'bg-pillar-cyklus/12', text: 'text-pillar-cyklus-700' },
  follicular: { dot: 'bg-pillar-strava', bg: 'bg-pillar-strava/12', text: 'text-pillar-strava-700' },
  ovulatory:  { dot: 'bg-gold',          bg: 'bg-gold/12',          text: 'text-gold' },
  luteal:     { dot: 'bg-pillar-mysel',  bg: 'bg-pillar-mysel/12',  text: 'text-pillar-mysel-700' },
};

export interface PhaseStripProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  state?: 'active' | 'prompt';
  /** Active state. */
  phase?: CyclePhase;
  phaseName?: string;
  /** Active state — current day in the cycle (preferred). */
  dayOfCycle?: number;
  /** Active state — alias for `dayOfCycle`. */
  day?: number;
  total?: number;
  note?: React.ReactNode;
  /** Prompt state — text override. */
  promptLabel?: React.ReactNode;
}

export const PhaseStrip = React.forwardRef<HTMLButtonElement, PhaseStripProps>(
  (
    {
      className,
      state = 'active',
      phase,
      phaseName,
      dayOfCycle,
      day,
      total = 28,
      note,
      promptLabel = 'Nastav cyklus a získaj prehľad',
      type = 'button',
      ...props
    },
    ref
  ) => {
    if (state === 'prompt') {
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
          <div className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 bg-pillar-cyklus/10">
            <span className="font-serif text-h3 text-pillar-cyklus-700">·</span>
          </div>
          <div className="flex-1 min-w-0">
            <Eyebrow tone="muted" className="mb-0.5">CYKLUS</Eyebrow>
            <SerifHeader as="div" size="h3" className="leading-snug">
              {promptLabel}
            </SerifHeader>
            <BodyText size="sm" tone="muted" className="mt-0.5">
              Pridaj svoju menštruáciu a uvidíš svoju aktuálnu fázu.
            </BodyText>
          </div>
          <ChevronRight className="size-5 text-ink/40 flex-shrink-0" />
        </button>
      );
    }

    const phaseKey = normalisePhase(phase);
    const dayNum = dayOfCycle ?? day ?? 1;
    const colors = phaseKey ? PHASE_COLOR[phaseKey] : PHASE_COLOR.follicular;
    const label = phaseName ?? (phaseKey ? PHASE_LABEL[phaseKey] : '');

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
        <div className={cn('h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0', colors.bg)}>
          <span className={cn('font-serif text-h3', colors.text)}>{dayNum}</span>
        </div>
        <div className="flex-1 min-w-0">
          <Eyebrow tone="muted" className="mb-0.5">
            Cyklus · deň {dayNum}/{total}
          </Eyebrow>
          <SerifHeader as="div" size="h3" className="leading-snug">
            {label}
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
