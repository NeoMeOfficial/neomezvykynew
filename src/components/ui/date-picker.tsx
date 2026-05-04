import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  maxDate?: Date;
  className?: string;
}

export function DatePicker({ label, value, onChange, maxDate, className }: DatePickerProps) {
  const toInputValue = (d: Date | null) => {
    if (!d) return '';
    return d.toISOString().split('T')[0];
  };

  const maxStr = maxDate ? maxDate.toISOString().split('T')[0] : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="font-sans text-[13px] text-ink/56 font-medium uppercase tracking-[0.1em]">
          {label}
        </label>
      )}
      <input
        type="date"
        value={toInputValue(value)}
        max={maxStr}
        onChange={e => onChange(e.target.value ? new Date(e.target.value) : null)}
        className={cn(
          'w-full px-4 py-3.5 rounded-card bg-white border border-ink/[0.08]',
          'font-sans text-[15px] text-ink',
          'focus:outline-none focus:ring-2 focus:ring-ink/20',
          'transition-colors duration-150'
        )}
      />
    </div>
  );
}
