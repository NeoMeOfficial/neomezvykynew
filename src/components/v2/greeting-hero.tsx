import * as React from 'react';
import { cn } from '@/lib/utils';
import { SerifHeader } from '@/components/ui/serif-header';
import { BodyText } from '@/components/ui/body-text';
import { Eyebrow } from '@/components/ui/eyebrow';
import { PlusTag } from '@/components/ui/plus-tag';

/**
 * GreetingHero — the personalized hello at the top of Home.
 *
 * Date eyebrow + "Dobré ráno, Eva" serif greeting + optional tier badge,
 * tagline, and right slot.
 *
 * <GreetingHero
 *   date="Pondelok · 21. apríl"
 *   greeting="Dobré ráno"
 *   name="Eva"
 *   tier="plus"
 *   tagline="Silné telo vzniká z malých rozhodnutí"
 *   right={<Avatar src="…" />}
 * />
 */
export interface GreetingHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: React.ReactNode;
  greeting?: string;
  name: string;
  tier?: 'free' | 'plus';
  tagline?: React.ReactNode;
  right?: React.ReactNode;
}

export const GreetingHero = React.forwardRef<HTMLDivElement, GreetingHeroProps>(
  ({ className, date, greeting = 'Dobré ráno', name, tier, tagline, right, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('pt-14 px-5 pb-4 flex justify-between items-start gap-4', className)}
      {...props}
    >
      <div className="min-w-0">
        {date && <Eyebrow tone="muted" className="mb-1.5">{date}</Eyebrow>}
        <div className="flex items-center gap-2 flex-wrap">
          <SerifHeader as="h1" size="hero" className="leading-[1.05]">
            {greeting}, {name}
          </SerifHeader>
          {tier === 'plus' && <PlusTag />}
        </div>
        {tagline && (
          <BodyText size="md" tone="secondary" className="mt-2 max-w-[320px] leading-snug">
            {tagline}
          </BodyText>
        )}
      </div>
      {right && <div className="flex-shrink-0 pt-1">{right}</div>}
    </div>
  )
);
GreetingHero.displayName = 'GreetingHero';
