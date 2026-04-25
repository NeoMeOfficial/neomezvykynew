import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * NeoMe Input — re-skinned shadcn Input.
 *
 * Visual changes vs default:
 *   - Cream-200 background instead of transparent
 *   - 16px radius (rounded-md → rounded-card on focus is too aggressive; we go md)
 *   - Hairline border, ink-tinted
 *   - DM Sans, body weight
 *   - 48px tall by default (more touch-friendly than shadcn's 40px)
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-12 w-full rounded-md ' +
            'bg-cream-200 px-4 py-3 ' +
            'border border-ink/[0.08] ' +
            'font-sans text-md text-ink ' +
            'placeholder:text-ink/40 ' +
            'transition-colors duration-150 ease-nm-std ' +
            'focus-visible:outline-none focus-visible:bg-white focus-visible:border-ink/30 ' +
            'disabled:cursor-not-allowed disabled:opacity-50 ' +
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
