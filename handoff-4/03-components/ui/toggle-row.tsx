import * as React from 'react';
import { cn } from '@/lib/utils';
import { ToggleSwitch } from '@/components/ui/toggle-switch';

/**
 * ToggleRow — settings list row with a switch on the right.
 *
 * Title + optional subtitle on the left, value on the right.
 * Stack inside <SettingsGroup> for grouped lists.
 *
 * <ToggleRow
 *   title="Ranná zostava"
 *   subtitle="Krátky prehľad dňa o 8:00"
 *   checked={prefs.morning}
 *   onChange={(v) => update({ morning: v })}
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

export function ToggleRow({
  title,
  subtitle,
  checked,
  onChange,
  disabled,
  className,
}: ToggleRowProps) {
  return (
    <label
      className={cn(
        'flex items-center justify-between gap-4 py-3.5 px-4',
        'cursor-pointer select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="font-sans text-[15px] text-ink leading-tight">{title}</div>
        {subtitle && (
          <div className="font-sans text-[13px] text-ink/55 leading-tight mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} disabled={disabled} />
    </label>
  );
}
