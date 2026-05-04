import * as React from 'react';
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

export interface NumberStepperProps {
  label?: string;
  unit?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function NumberStepper({ label, unit, value, onChange, min = 0, max = 100, className }: NumberStepperProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="font-sans text-[13px] text-ink/56 font-medium uppercase tracking-[0.1em]">
          {label}
        </label>
      )}
      <div className="flex items-center justify-between px-4 py-3 rounded-card bg-white border border-ink/[0.08]">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          className="h-8 w-8 rounded-full bg-ink/[0.06] flex items-center justify-center disabled:opacity-30 transition-opacity"
        >
          <Minus className="size-4 text-ink" />
        </button>
        <span className="font-serif text-h2 text-ink tabular-nums">
          {value}{unit && <span className="font-sans text-md text-ink/56 ml-1">{unit}</span>}
        </span>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          className="h-8 w-8 rounded-full bg-ink/[0.06] flex items-center justify-center disabled:opacity-30 transition-opacity"
        >
          <Plus className="size-4 text-ink" />
        </button>
      </div>
    </div>
  );
}
