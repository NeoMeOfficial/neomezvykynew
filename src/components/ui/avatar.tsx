import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Avatar — circular user avatar.
 *
 * Use `src` for an image, or `initial` for a typographic fallback.
 *
 * <Avatar src="/avatars/eva.jpg" size={40} />
 * <Avatar initial="E" pillar="strava" />
 */
type PillarKey = 'telo' | 'strava' | 'mysel' | 'cyklus';

const PILLAR_BG: Record<PillarKey, { bg: string; text: string }> = {
  telo:   { bg: 'bg-pillar-telo-100',   text: 'text-pillar-telo-700' },
  strava: { bg: 'bg-pillar-strava-100', text: 'text-pillar-strava-700' },
  mysel:  { bg: 'bg-pillar-mysel-100',  text: 'text-pillar-mysel-700' },
  cyklus: { bg: 'bg-pillar-cyklus-100', text: 'text-pillar-cyklus-700' },
};

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initial?: string;
  size?: number;
  pillar?: PillarKey;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, initial, size = 36, pillar = 'strava', style, ...props }, ref) => {
    const colors = PILLAR_BG[pillar];
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0',
          !src && colors.bg,
          !src && colors.text,
          className
        )}
        style={{ width: size, height: size, fontSize: size * 0.42, ...style }}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || ''}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-serif">{initial}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';
