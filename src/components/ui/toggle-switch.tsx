import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({ checked, onChange, disabled, className }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-[28px] w-[48px] flex-shrink-0 cursor-pointer rounded-full',
        'border-2 border-transparent transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-ink' : 'bg-ink/20',
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white shadow-nm-xs',
          'transform transition-transform duration-200 mt-[2px]',
          checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
        )}
      />
    </button>
  );
}
