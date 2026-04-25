import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow } from './eyebrow';
import { SerifHeader } from './serif-header';

/**
 * SectionHeader — eyebrow + serif title + optional right-aligned link.
 *
 * Used above every list, grid, or card row in NeoMe screens.
 *
 * <SectionHeader eyebrow="Dnešný rituál" title="Pohyb" link="Zobraziť" onLinkClick={...} />
 */
export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  size?: 'h2' | 'h1';
  link?: React.ReactNode;
  onLinkClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, eyebrow, title, size = 'h2', link, onLinkClick, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-end justify-between mb-3', className)}
      {...props}
    >
      <div>
        {eyebrow && <Eyebrow className="mb-1.5">{eyebrow}</Eyebrow>}
        <SerifHeader size={size}>{title}</SerifHeader>
      </div>
      {link && (
        <button
          type="button"
          onClick={onLinkClick}
          className="inline-flex items-center gap-1 font-sans text-[12px] text-ink/56 hover:text-ink transition-colors"
        >
          {link}
          <span aria-hidden>›</span>
        </button>
      )}
    </div>
  )
);
SectionHeader.displayName = 'SectionHeader';
