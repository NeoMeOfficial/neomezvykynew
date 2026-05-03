import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * PillarChip — pillar-themed chip used as filter or tag.
 *
 * <PillarChip pillar="telo">Telo</PillarChip>
 * <PillarChip pillar="strava" active>Výživa</PillarChip>
 */
export type PillarKey = 'telo' | 'strava' | 'mysel' | 'cyklus';

const PILLAR_FILL: Record<PillarKey, string> = {
  telo:   'bg-pillar-telo text-white border-pillar-telo',
  strava: 'bg-pillar-strava text-white border-pillar-strava',
  mysel:  'bg-pillar-mysel text-white border-pillar-mysel',
  cyklus: 'bg-pillar-cyklus text-white border-pillar-cyklus',
};

export interface PillarChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pillar: PillarKey;
  active?: boolean;
}

export const PillarChip = React.forwardRef<HTMLButtonElement, PillarChipProps>(
  ({ className, pillar, active = false, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-[7px] ' +
          'font-sans text-[12px] whitespace-nowrap ' +
          'transition-all duration-150 ease-nm-std cursor-pointer ' +
          'border',
        active
          ? `${PILLAR_FILL[pillar]} font-medium`
          : 'bg-transparent text-ink/72 border-ink/14 hover:bg-ink/[0.04]',
        className
      )}
      {...props}
    />
  )
);
PillarChip.displayName = 'PillarChip';
