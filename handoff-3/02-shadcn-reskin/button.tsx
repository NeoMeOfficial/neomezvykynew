import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * NeoMe Button — re-skinned shadcn Button.
 *
 * VARIANT ADDITIONS (NeoMe-specific):
 *   variant="pill"       → primary action, ink-on-cream, fully rounded
 *   variant="pillGold"   → Plus tier upsell action (gold)
 *   variant="pillOutline"→ secondary, hairline border
 *   variant="link-muted" → de-emphasized text link (e.g. "Pokračovať zdarma")
 *
 *   size="lg"  → 52px tall — primary CTA on paywall / onboarding
 *   size="md"  → 44px tall — default
 *   size="sm"  → 36px tall — chips, secondary
 *
 * Existing variants (default, destructive, outline, secondary, ghost, link)
 * remain untouched so existing screens keep compiling.
 */
const buttonVariants = cva(
  // Base — applies to every variant.
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium ' +
  'transition-all duration-200 ease-nm ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50 ' +
  '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // shadcn defaults — preserved
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-md',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md',
        ghost: 'hover:bg-accent hover:text-accent-foreground rounded-md',
        link: 'text-primary underline-offset-4 hover:underline',

        // NeoMe additions — these are what new screens should use.
        pill:
          'rounded-full bg-ink text-cream tracking-wide ' +
          'shadow-nm-sm hover:shadow-nm-md hover:bg-ink-700 ' +
          'active:scale-[0.98]',
        pillGold:
          'rounded-full bg-gold text-white tracking-wide ' +
          'shadow-nm-sm hover:shadow-nm-md hover:bg-gold/90 ' +
          'active:scale-[0.98]',
        pillOutline:
          'rounded-full border border-ink/14 bg-transparent text-ink ' +
          'hover:bg-ink/[0.04] active:scale-[0.98]',
        pillCream:
          'rounded-full bg-cream-200 text-ink ' +
          'hover:bg-cream-300 active:scale-[0.98]',
        'link-muted':
          'text-ink/56 underline underline-offset-4 hover:text-ink ' +
          'text-sm font-normal',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-13 px-7 text-md',  // h-13 = 52px when configured; falls back to 48px
        icon: 'h-10 w-10',

        // NeoMe pill sizes — match the visual rhythm of the prototypes.
        md: 'h-11 px-6 text-md',          // 44px tall
        pillLg: 'h-13 px-8 text-md',      // 52px tall — primary CTA
        pillSm: 'h-9 px-4 text-sm',       // 36px tall — chips
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
