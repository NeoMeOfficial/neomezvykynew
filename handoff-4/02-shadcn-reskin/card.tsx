import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * NeoMe Card — re-skinned shadcn Card.
 *
 * VARIANT ADDITIONS:
 *   variant="ritual"   → daily ritual card on Home (white, hairline border, soft shadow)
 *   variant="hero"     → large hero card (28px radius, accent-tinted background)
 *   variant="pillar"   → pillar-themed card (uses pillar={key} prop, tinted bg)
 *   variant="inset"    → pressed/inset feel (cream-300 bg, no border)
 *   variant="dark"     → ink background, white text (paywall, completion)
 *   variant="hairline" → just a hairline border on cream, no shadow
 *
 *   pillar={'telo'|'strava'|'mysel'|'cyklus'} — colors the left accent.
 *
 * Existing usages of <Card> stay valid — default variant matches old shadcn.
 */
const cardVariants = cva(
  'overflow-hidden transition-shadow duration-200',
  {
    variants: {
      variant: {
        // shadcn default — preserved
        default: 'rounded-lg border bg-card text-card-foreground shadow-sm',

        // NeoMe additions
        ritual:
          'rounded-card bg-white text-ink ' +
          'border border-ink/[0.08] shadow-nm-sm',
        hero:
          'rounded-hero bg-cream-50 text-ink ' +
          'border border-ink/[0.08] shadow-nm-md',
        inset:
          'rounded-card bg-cream-300 text-ink',
        dark:
          'rounded-card bg-ink text-cream',
        hairline:
          'rounded-card bg-cream text-ink ' +
          'border border-ink/[0.08]',
        pillar:
          // bg colored by pillar prop via inline style; this just sets the shape.
          'rounded-card text-ink border border-ink/[0.08] shadow-nm-sm',
      },
      pad: {
        default: 'p-5',     // 20px — card default
        sm: 'p-4',          // 16px
        lg: 'p-6',          // 24px — hero
        none: 'p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      pad: 'default',
    },
  }
);

const PILLAR_BG: Record<string, string> = {
  telo:   'rgba(193, 133, 106, 0.10)',  // terracotta soft
  strava: 'rgba(139, 158, 136, 0.12)',  // sage soft
  mysel:  'rgba(163, 149, 172, 0.12)',  // mauve soft
  cyklus: 'rgba(176, 138, 154, 0.12)',  // dusty rose soft
};

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  pillar?: 'telo' | 'strava' | 'mysel' | 'cyklus';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, pad, pillar, style, ...props }, ref) => {
    const pillarStyle =
      variant === 'pillar' && pillar
        ? { background: PILLAR_BG[pillar], ...style }
        : style;
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, pad, className }))}
        style={pillarStyle}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'font-serif text-h2 leading-snug tracking-tight',
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-ink/56', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
