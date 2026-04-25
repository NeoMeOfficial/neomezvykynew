import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BodyText } from '@/components/ui/body-text';

/**
 * SettingsGroup — labeled group of settings rows.
 *
 * <SettingsGroup label="Účet">
 *   <SettingsRow label="E-mail" value="sam@example.com" />
 *   <SettingsRow label="Predplatné" value="Plus" right={<PlusTag />} />
 * </SettingsGroup>
 */
export interface SettingsGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export const SettingsGroup = React.forwardRef<HTMLDivElement, SettingsGroupProps>(
  ({ className, label, children, ...props }, ref) => (
    <div ref={ref} className={cn('mb-7', className)} {...props}>
      {label && (
        <Eyebrow tone="muted" className="px-5 mb-2">
          {label}
        </Eyebrow>
      )}
      <div className="bg-white rounded-card border border-ink/[0.08] mx-5 overflow-hidden">
        {children}
      </div>
    </div>
  )
);
SettingsGroup.displayName = 'SettingsGroup';

/* ─────────────────────────────────────────────────────── */

/**
 * SettingsRow — one row inside a SettingsGroup.
 *
 * <SettingsRow label="Notifikácie" right={<ToggleSwitch on={true} />} />
 * <SettingsRow label="Údaje" value="2 GB" onClick={…} />
 * <SettingsRow label="Vymazať účet" tone="danger" onClick={…} />
 */
export interface SettingsRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: React.ReactNode;
  value?: React.ReactNode;
  right?: React.ReactNode;
  tone?: 'default' | 'danger';
  showChevron?: boolean;
}

export const SettingsRow = React.forwardRef<HTMLButtonElement, SettingsRowProps>(
  ({ className, label, value, right, tone = 'default', showChevron = true, onClick, type = 'button', ...props }, ref) => {
    const isInteractive = !!onClick && !right;
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        className={cn(
          'w-full px-5 py-3.5 flex items-center justify-between gap-3 text-left',
          'border-b border-ink/[0.06] last:border-b-0',
          'hover:bg-ink/[0.02] transition-colors',
          tone === 'danger' && 'text-danger',
          className
        )}
        {...props}
      >
        <div className="min-w-0 flex-1">
          <BodyText
            size="md"
            tone={tone === 'danger' ? 'primary' : 'primary'}
            className={cn(tone === 'danger' && 'text-danger')}
          >
            {label}
          </BodyText>
          {value && (
            <BodyText size="sm" tone="muted" className="mt-0.5">
              {value}
            </BodyText>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {right}
          {isInteractive && showChevron && (
            <ChevronRight className="size-5 text-ink/40" />
          )}
        </div>
      </button>
    );
  }
);
SettingsRow.displayName = 'SettingsRow';
