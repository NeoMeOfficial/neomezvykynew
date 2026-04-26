import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';

/**
 * OnbShell — onboarding step scaffold.
 *
 * Provides the consistent chrome for every onboarding step: status-safe top
 * padding, optional back button, progress indicator (step/totalSteps), and
 * children area. CTAs go in the parent screen (typically a CTASticky).
 *
 * <OnbShell step={3} totalSteps={6} onBack={() => nav.back()}>
 *   <SerifHeader>…</SerifHeader>
 *   <BodyText>…</BodyText>
 * </OnbShell>
 */
export interface OnbShellProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  totalSteps?: number;
  onBack?: () => void;
  showBack?: boolean;
}

export const OnbShell = React.forwardRef<HTMLDivElement, OnbShellProps>(
  ({ className, step, totalSteps = 6, onBack, showBack = true, children, ...props }, ref) => (
    <div ref={ref} className={cn('relative h-full bg-cream flex flex-col', className)} {...props}>
      {/* Header — status-safe padding + back + progress */}
      <div className="pt-12 px-5 pb-3 flex items-center gap-3">
        {showBack && onBack && (
          <IconButton size="md" variant="ghost" onClick={onBack} aria-label="Späť">
            <ChevronLeft />
          </IconButton>
        )}
        <div className="flex-1 flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-[3px] flex-1 rounded-full transition-colors duration-300',
                i < step ? 'bg-ink' : 'bg-ink/12'
              )}
            />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 pb-32">{children}</div>
    </div>
  )
);
OnbShell.displayName = 'OnbShell';
