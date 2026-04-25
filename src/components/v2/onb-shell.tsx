import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
 * <OnbShell step={3} totalSteps={3} backHref="/onboarding/cycle">
 *   <SerifHeader>…</SerifHeader>
 * </OnbShell>
 */
export interface OnbShellProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
  totalSteps?: number;
  /** Either backHref (Link-style) or onBack (callback) — backHref preferred. */
  backHref?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export const OnbShell = React.forwardRef<HTMLDivElement, OnbShellProps>(
  ({ className, step, totalSteps = 6, backHref, onBack, showBack = true, children, ...props }, ref) => {
    const navigate = useNavigate();
    const handleBack = () => {
      if (onBack) onBack();
      else if (backHref) navigate(backHref);
    };
    const showButton = showBack && (backHref || onBack);
    return (
      <div ref={ref} className={cn('relative min-h-screen bg-cream flex flex-col', className)} {...props}>
        {/* Header — status-safe padding + back + progress */}
        <div className="pt-[max(env(safe-area-inset-top),48px)] px-5 pb-3 flex items-center gap-3">
          {showButton && (
            <IconButton size="md" variant="ghost" onClick={handleBack} aria-label="Späť">
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
        <div className="flex-1 pb-40">{children}</div>
      </div>
    );
  }
);
OnbShell.displayName = 'OnbShell';
