import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { SerifHeader } from '@/components/ui/serif-header';
import { Eyebrow } from '@/components/ui/eyebrow';
import { PlusTag } from '@/components/ui/plus-tag';

/**
 * ProfileHero — centered profile header.
 *
 * Avatar + name + tier marker + "since" date. Top of the Profil screen.
 *
 * <ProfileHero
 *   name="Sam Drobová"
 *   tier="plus"
 *   since="apríl 2026"
 *   avatar="/avatars/sam.jpg"
 *   initial="S"
 * />
 */
export interface ProfileHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  tier?: 'free' | 'plus';
  since?: string;
  avatar?: string;
  initial?: string;
}

export const ProfileHero = React.forwardRef<HTMLDivElement, ProfileHeroProps>(
  ({ className, name, tier = 'free', since, avatar, initial = '?', ...props }, ref) => (
    <div ref={ref} className={cn('pt-16 px-6 pb-7 text-center', className)} {...props}>
      <Avatar src={avatar} initial={initial} size={84} pillar="strava" className="mx-auto mb-4" />
      <SerifHeader as="h1" size="h1" className="mb-1">
        {name}
      </SerifHeader>
      <div className="flex items-center justify-center gap-2">
        {tier === 'plus' && <PlusTag />}
        {since && <Eyebrow tone="muted">člen od {since}</Eyebrow>}
      </div>
    </div>
  )
);
ProfileHero.displayName = 'ProfileHero';
