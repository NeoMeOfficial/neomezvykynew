import * as React from 'react';
import * as Switch from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

/**
 * ToggleRow — labelled row with a switch on the right.
 *
 * <ToggleRow
 *   title="Ranná zostava"
 *   subtitle="Krátky prehľad dňa o 8:00"
 *   checked={morning}
 *   onChange={setMorning}
 * />
 */
export interface ToggleRowProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const ToggleRow = React.forwardRef<HTMLDivElement, ToggleRowProps>(
  ({ title, subtitle, checked, onChange, disabled, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-4 py-3 px-4 rounded-card bg-white border border-ink/[0.08]',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="font-sans text-md text-ink leading-tight">{title}</div>
        {subtitle && (
          <div className="font-sans text-sm text-ink/56 mt-0.5 leading-snug">
            {subtitle}
          </div>
        )}
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className={cn(
          'relative h-6 w-11 rounded-full bg-ink/14 outline-none',
          'data-[state=checked]:bg-ink',
          'transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <Switch.Thumb
          className={cn(
            'block h-5 w-5 rounded-full bg-white shadow-nm-xs',
            'translate-x-0.5 data-[state=checked]:translate-x-[22px]',
            'transition-transform'
          )}
        />
      </Switch.Root>
    </div>
  )
);
ToggleRow.displayName = 'ToggleRow';
