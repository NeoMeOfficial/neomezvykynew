import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * NumberStepper — labelled +/− stepper with min/max clamps.
 *
 * <NumberStepper
 *   label="Priemerná dĺžka cyklu"
 *   unit="dní"
 *   value={cycleLength}
 *   onChange={setCycleLength}
 *   min={20}
 *   max={45}
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
  className?: string;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  label, unit, value, onChange, min = -Infinity, max = Infinity, step = 1, className,
}) => {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <span className="font-sans text-sm text-ink/72 tracking-wide">{label}</span>
      <div className="flex items-center justify-between h-12 px-1 rounded-card bg-cream-200 border border-ink/[0.08]">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          aria-label="Znížiť"
          className={cn(
            'flex items-center justify-center h-10 w-10 rounded-full',
            'text-ink hover:bg-ink/[0.04]',
            'disabled:opacity-30 disabled:hover:bg-transparent',
            'transition-colors'
          )}
        >
          <Minus className="h-4 w-4" strokeWidth={2} />
        </button>
        <div className="flex items-baseline gap-1.5 px-3">
          <span className="font-serif text-h2 text-ink leading-none tabular-nums">{value}</span>
          {unit && <span className="font-sans text-sm text-ink/56">{unit}</span>}
        </div>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          aria-label="Zvýšiť"
          className={cn(
            'flex items-center justify-center h-10 w-10 rounded-full',
            'text-ink hover:bg-ink/[0.04]',
            'disabled:opacity-30 disabled:hover:bg-transparent',
            'transition-colors'
          )}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
NumberStepper.displayName = 'NumberStepper';
