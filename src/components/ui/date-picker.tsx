import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * DatePicker — labelled native date input, NeoMe-styled.
 *
 * <DatePicker
 *   label="Prvý deň poslednej menštruácie"
 *   value={lastPeriod}
 *   onChange={setLastPeriod}
 *   maxDate={new Date()}
 * />
 *
 * Uses the native `<input type="date">` for accessibility and OS-level
 * pickers. We restyle the wrapper but keep the platform behavior.
 */
export interface DatePickerProps {
  label: React.ReactNode;
  value: Date | null;
  onChange: (next: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

function fmt(d: Date | null): string {
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, minDate, maxDate, className }) => (
  <label className={cn('flex flex-col gap-2', className)}>
    <span className="font-sans text-sm text-ink/72 tracking-wide">{label}</span>
    <input
      type="date"
      value={fmt(value)}
      min={fmt(minDate ?? null) || undefined}
      max={fmt(maxDate ?? null) || undefined}
      onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
      className={cn(
        'h-12 px-4 rounded-card font-sans text-md text-ink',
        'bg-cream-200 border border-ink/[0.08] outline-none',
        'focus:border-ink/24 focus:ring-2 focus:ring-ink/[0.04]',
        'transition-colors'
      )}
    />
  </label>
);
DatePicker.displayName = 'DatePicker';
