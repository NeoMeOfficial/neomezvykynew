import { Outlet } from 'react-router-dom';
import BottomNav from '../../components/v2/BottomNav';
import { colors } from '../../theme/warmDusk';

export default function AppLayout() {
  return (
    <div className="min-h-screen font-lufga relative w-full overflow-x-hidden" style={{ background: colors.bgFlat }}>
      {/* Full-screen warm dusk gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: colors.bgGradient }}
      />
      {/* Ambient glows - Mobile optimized */}
      <div className="pointer-events-none fixed top-[10%] left-[5%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] rounded-full opacity-[0.12] z-0"
        style={{ background: `radial-gradient(circle, ${colors.periodka} 0%, transparent 70%)`, filter: 'blur(80px)' }} />
      <div className="pointer-events-none fixed top-[50%] right-[0%] w-[150px] h-[150px] sm:w-[250px] sm:h-[250px] rounded-full opacity-[0.08] z-0"
        style={{ background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`, filter: 'blur(70px)' }} />
      <div className="pointer-events-none fixed bottom-[10%] left-[30%] w-[120px] h-[120px] sm:w-[200px] sm:h-[200px] rounded-full opacity-[0.08] z-0"
        style={{ background: `radial-gradient(circle, ${colors.strava} 0%, transparent 70%)`, filter: 'blur(60px)' }} />
      
      {/* Mobile-optimized main content */}
      <main className="relative z-10 pb-28 w-full max-w-lg mx-auto px-4 sm:px-5 pt-4 sm:pt-6 min-h-screen safe-area-padding">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
