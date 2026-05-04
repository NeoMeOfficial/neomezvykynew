import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@/components/ui/icon-button';
import { SerifHeader } from '@/components/ui/serif-header';

export interface TopBarProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  backHref?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

export const TopBar = React.forwardRef<HTMLDivElement, TopBarProps>(
  ({ className, title, backHref, onBack, right, ...props }, ref) => {
    const navigate = useNavigate();
    const handleBack = onBack ?? (() => backHref ? navigate(backHref) : navigate(-1));

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 px-3 pt-12 pb-3 bg-cream',
          className
        )}
        {...props}
      >
        <IconButton variant="ghost" onClick={handleBack} aria-label="Späť">
          <ChevronLeft />
        </IconButton>
        <SerifHeader as="h1" size="h2" className="flex-1 truncate">
          {title}
        </SerifHeader>
        {right && <div className="flex-shrink-0">{right}</div>}
      </div>
    );
  }
);
TopBar.displayName = 'TopBar';
