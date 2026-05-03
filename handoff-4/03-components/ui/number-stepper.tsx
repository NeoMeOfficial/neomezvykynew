import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * NumberStepper — labeled +/- numeric input.
 *
 * Used for cycle length, period length, etc. Centered numeric value with
 * unit label, large hit targets (44×44), clamped to min/max.
 *
 * <NumberStepper
 *   label="Priemerná dĺžka cyklu"
 *   unit="dní"
 *   value={cycleLength}
 *   onChange={setCycleLength}
 *   min={21} max={45} default={28}
 * />
 */
export interface NumberStepperProps {
  label: React.ReactNode;
  unit?: React.ReactNode;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Hint shown under the label, e.g. the typical default. */
  hint?: React.ReactNode;
  className?: string;
}

export function NumberStepper({
  label,
  unit,
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  hint,
  className,
}: NumberStepperProps) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div>
        <div className="font-sans text-[14px] text-ink/70">{label}</div>
        {hint && (
          <div className="font-sans text-[12px] text-ink/45 mt-0.5">{hint}</div>
        )}
      </div>

      <div
        className={cn(
          'flex items-center justify-between',
          'rounded-card border border-ink/[0.1] bg-white px-2 py-2'
        )}
      >
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          aria-label="Znížiť"
          className={cn(
            'size-11 inline-flex items-center justify-center rounded-full',
            'hover:bg-ink/[0.04] disabled:opacity-30 disabled:hover:bg-transparent'
          )}
        >
          <Minus className="size-4 text-ink" />
        </button>

        <div className="flex items-baseline gap-1.5">
          <span className="font-serif text-[28px] text-ink leading-none tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="font-sans text-[13px] text-ink/55">{unit}</span>
          )}
        </div>

        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          aria-label="Zvýšiť"
          className={cn(
            'size-11 inline-flex items-center justify-center rounded-full',
            'hover:bg-ink/[0.04] disabled:opacity-30 disabled:hover:bg-transparent'
          )}
        >
          <Plus className="size-4 text-ink" />
        </button>
      </div>
    </div>
  );
}
