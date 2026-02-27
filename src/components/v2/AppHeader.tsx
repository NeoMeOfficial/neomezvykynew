import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Settings } from 'lucide-react';
import { colors, glassButton } from '../../theme/warmDusk';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: 'bell' | 'settings';
  onRightAction?: () => void;
  transparent?: boolean;
}

export default function AppHeader({ title, showBack, rightAction, onRightAction, transparent = true }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 pt-[env(safe-area-inset-top)] ${transparent ? '' : ''}`}
      style={transparent ? {} : { background: 'rgba(240,230,218,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
      <div className="flex items-center justify-between px-5 py-4 max-w-lg mx-auto">
        <div className="w-10">
          {showBack && (
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95" style={glassButton}>
              <ChevronLeft size={20} style={{ color: colors.telo }} strokeWidth={1.5} />
            </button>
          )}
        </div>
        {title && <h1 className="text-lg font-medium tracking-tight" style={{ color: colors.telo }}>{title}</h1>}
        <div className="w-10">
          {rightAction && (
            <button onClick={onRightAction} className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95" style={glassButton}>
              {rightAction === 'bell'
                ? <Bell size={20} style={{ color: colors.telo }} strokeWidth={1.5} />
                : <Settings size={20} style={{ color: colors.telo }} strokeWidth={1.5} />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
