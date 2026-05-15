import { Outlet } from 'react-router-dom';
import BottomNav from '../../components/v2/BottomNav';
import ErrorBoundary from '../../components/v2/ErrorBoundary';
import { useAppVersion } from '../../hooks/useAppVersion';

async function flushAndReload() {
  try {
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    // Best-effort — fall through to reload regardless.
  }
  // Hard reload bypassing any remaining HTTP cache.
  window.location.replace(window.location.pathname + '?_r=' + Date.now());
}

function UpdateBanner() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#3D2921',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 18px',
        paddingTop: 'calc(env(safe-area-inset-top) + 10px)',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 13,
      }}
    >
      <span>K dispozícii je nová verzia</span>
      <button
        onClick={() => { void flushAndReload(); }}
        style={{
          all: 'unset',
          cursor: 'pointer',
          background: '#B8864A',
          color: '#fff',
          padding: '6px 14px',
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        Obnoviť
      </button>
    </div>
  );
}

export default function AppLayout() {
  const { updateAvailable } = useAppVersion();

  return (
    <div
      className="min-h-screen font-sans relative w-full overflow-x-hidden"
      style={{ background: 'linear-gradient(to bottom, #FAF7F2, #F5F1E8)' }}
    >
      {updateAvailable && <UpdateBanner />}

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
