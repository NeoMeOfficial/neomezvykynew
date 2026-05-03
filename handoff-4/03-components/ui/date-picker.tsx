import * as React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * DatePicker — labeled date input.
 *
 * Visually a tap-target row that opens the native date picker on press.
 * For richer calendar UX (cycle setup with phase preview) you'll want to
 * swap the underlying control for a real picker (e.g. react-day-picker)
 * styled with our tokens — but the prop shape stays the same.
 *
 * <DatePicker
 *   label="Prvý deň poslednej menštruácie"
 *   value={lastPeriod}
 *   onChange={setLastPeriod}
 *   max="today"
 * />
 */
export interface DatePickerProps {
  label: React.ReactNode;
  /** ISO yyyy-mm-dd or empty string. */
  value: string;
  onChange: (next: string) => void;
  /** "today" or ISO string. */
  min?: string | 'today';
  /** "today" or ISO string. */
  max?: string | 'today';
  hint?: React.ReactNode;
  className?: string;
}

const isoToday = () => new Date().toISOString().slice(0, 10);

const formatDisplay = (iso: string): string => {
  if (!iso) return 'Vyber dátum';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const days = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];
  const months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'máj',
    'jún',
    'júl',
    'aug',
    'sep',
    'okt',
    'nov',
    'dec',
  ];
  return `${days[d.getDay()]} · ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export function DatePicker({
  label,
  value,
  onChange,
  min,
  max,
  hint,
  className,
}: DatePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const minIso = min === 'today' ? isoToday() : min;
  const maxIso = max === 'today' ? isoToday() : max;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div>
        <div className="font-sans text-[14px] text-ink/70">{label}</div>
        {hint && (
          <div className="font-sans text-[12px] text-ink/45 mt-0.5">{hint}</div>
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.showPicker?.() ?? inputRef.current?.click()}
        className={cn(
          'flex items-center justify-between gap-3',
          'rounded-card border border-ink/[0.1] bg-white px-4 py-3.5',
          'hover:border-ink/[0.2] transition-colors'
        )}
      >
        <span
          className={cn(
            'font-sans text-[15px]',
            value ? 'text-ink' : 'text-ink/40'
          )}
        >
          {formatDisplay(value)}
        </span>
        <Calendar className="size-4 text-ink/45" />
      </button>

      <input
        ref={inputRef}
        type="date"
        value={value}
        min={minIso}
        max={maxIso}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </div>
  );
}
