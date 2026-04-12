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
      
      {/* Mobile-optimized main content */}
      <main className="relative z-10 pb-28 w-full max-w-none mx-auto px-0 sm:px-2 pt-4 sm:pt-6 min-h-screen safe-area-padding">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <BottomNav />
    </div>
  );
}
