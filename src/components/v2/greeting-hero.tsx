import * as React from 'react';
import { cn } from '@/lib/utils';
import { SerifHeader } from '@/components/ui/serif-header';
import { Eyebrow } from '@/components/ui/eyebrow';

/**
 * GreetingHero — the personalized hello at the top of Home.
 *
 * Date eyebrow + "Dobré ráno, Eva" serif greeting + optional right slot
 * (avatar, notifications icon, etc).
 *
 * <GreetingHero
 *   date="Pondelok · 21. apríl"
 *   greeting="Dobré ráno"
 *   name="Eva"
 *   right={<Avatar src="…" />}
 * />
 */
export interface GreetingHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: React.ReactNode;
  greeting?: string;
  name: string;
  right?: React.ReactNode;
}

export const GreetingHero = React.forwardRef<HTMLDivElement, GreetingHeroProps>(
  ({ className, date, greeting = 'Dobré ráno', name, right, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('pt-14 px-5 pb-4 flex justify-between items-start gap-4', className)}
      {...props}
    >
      <div className="min-w-0">
        {date && <Eyebrow tone="muted" className="mb-1.5">{date}</Eyebrow>}
        <SerifHeader as="h1" size="hero" className="leading-[1.05]">
          {greeting}, {name}
        </SerifHeader>
      </div>
      {right && <div className="flex-shrink-0 pt-1">{right}</div>}
    </div>
  )
);
GreetingHero.displayName = 'GreetingHero';
