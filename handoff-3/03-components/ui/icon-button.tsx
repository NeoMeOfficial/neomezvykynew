import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * IconButton — circular icon button (back, close, menu, share).
 *
 * <IconButton aria-label="Späť"><ChevronLeft /></IconButton>
 * <IconButton variant="filled" aria-label="Pridať"><Plus /></IconButton>
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'filled' | 'outline';
}

const sizeClass = {
  sm: 'h-8 w-8 [&_svg]:size-4',
  md: 'h-9 w-9 [&_svg]:size-[18px]',
  lg: 'h-11 w-11 [&_svg]:size-5',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'md', variant = 'ghost', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-full ' +
          'text-ink transition-all duration-150 ease-nm-std cursor-pointer ' +
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
          'disabled:opacity-50 disabled:pointer-events-none ' +
          'active:scale-95',
        sizeClass[size],
        variant === 'ghost' && 'bg-transparent hover:bg-ink/[0.06]',
        variant === 'filled' && 'bg-cream-200 hover:bg-cream-300',
        variant === 'outline' && 'border border-ink/14 hover:bg-ink/[0.04]',
        className
      )}
      {...props}
    />
  )
);
IconButton.displayName = 'IconButton';
