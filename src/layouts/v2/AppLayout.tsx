import { Outlet } from 'react-router-dom';
import BottomNav from '../../components/v2/BottomNav';
import ErrorBoundary from '../../components/v2/ErrorBoundary';
import { colors } from '../../theme/warmDusk';

export default function AppLayout() {
  return (
    <div 
      className="min-h-screen font-sans relative w-full overflow-x-hidden"
      style={{ background: 'linear-gradient(to bottom, #FAF7F2, #F5F1E8)' }}
    >
      
      {/* Main content — redesigned screens handle their own safe-area
          padding via env(safe-area-inset-*). No top/bottom padding here
          so hero photos can full-bleed under the status bar. */}
      <main className="relative z-10 w-full max-w-none mx-auto min-h-screen">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <BottomNav />
    </div>
  );
}
