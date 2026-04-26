import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * TopBar — title + back arrow, status-safe top bar.
 *
 * <TopBar title="Nastavenia" backHref="/profil" />
 */
export interface TopBarProps {
  title: React.ReactNode;
  backHref?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ title, backHref, onBack, right, className }) => (
  <div
    className={cn(
      'sticky top-0 z-20 bg-cream/90 backdrop-blur-sm',
      'pt-[max(env(safe-area-inset-top),16px)] pb-3 px-[18px]',
      'flex items-center gap-3',
      className
    )}
  >
    {(backHref || onBack) && (
      backHref ? (
        <Link
          to={backHref}
          aria-label="Späť"
          className="flex items-center justify-center h-10 w-10 -ml-2 rounded-full hover:bg-ink/[0.04] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-ink" strokeWidth={1.75} />
        </Link>
      ) : (
        <button
          type="button"
          onClick={onBack}
          aria-label="Späť"
          className="flex items-center justify-center h-10 w-10 -ml-2 rounded-full hover:bg-ink/[0.04] transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-ink" strokeWidth={1.75} />
        </button>
      )
    )}
    <div className="flex-1 font-serif text-h3 text-ink leading-snug">{title}</div>
    {right && <div className="flex-shrink-0">{right}</div>}
  </div>
);
TopBar.displayName = 'TopBar';
