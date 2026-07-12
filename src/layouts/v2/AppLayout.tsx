import { Outlet, useLocation } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import BottomNav from '../../components/v2/BottomNav';
import ErrorBoundary from '../../components/v2/ErrorBoundary';

/**
 * Routes where the layout BottomNav should be hidden so the screen
 * gets a distraction-free "focus mode". Any path matching one of
 * these prefixes suppresses the nav.
 *
 * Includes deep screens under the five top-level tabs
 * (/domov-new, /kniznica, /komunita, /spravy, /profil) — those are
 * detail / compose / thread / player pages where a text input or
 * action sheet at the bottom of the viewport would otherwise be
 * covered by the BottomNav. Top-level tab roots themselves are
 * matched by exact-path checks below, not by these prefixes, so the
 * tab still shows the nav.
 */
const FOCUS_ROUTE_PREFIXES = [
  // Admin panel has its own sidebar — the consumer BottomNav floated over it.
  '/admin',
  '/jedalnicek/onboarding',
  '/onboarding-plus/',
  // Deep screens under top-level tabs (compose, detail, thread,
  // player, history, settings)
  '/komunita/',
  '/spravy/',
  '/kniznica/',
  '/profil/',
  // Stand-alone deep screens reachable from various tabs
  '/program/',
  '/recepty/',
  '/recept/',
  '/meditacie/',
  '/workout/',
  '/reflection/',
  '/cyklus/',
  '/navyky/',
  '/settings/',
  '/checkout',
  '/paywall',
];

/**
 * PWA update banner.
 *
 * Uses vite-plugin-pwa's `useRegisterSW`, which talks to the actual
 * service worker:
 *
 *   • `needRefresh` flips to true when a new SW has been installed and
 *     is waiting to take over (autoUpdate strategy).
 *   • `updateServiceWorker()` sends SKIP_WAITING to the waiting SW,
 *     waits for the `controllerchange` event, and reloads — the
 *     canonical path that works reliably on iOS standalone PWAs
 *     where manual unregister/cache-clear sometimes hangs.
 *
 * Replaces the previous home-grown hash-compare + flushAndReload
 * approach which had two failure modes on iOS:
 *   1. The hash check raced the SW and could oscillate (auto-reload
 *      loop, fixed earlier).
 *   2. Manual SW unregister + caches.delete sometimes hung in
 *      standalone mode, leaving the user with a button that did
 *      nothing.
 */
function UpdateBanner({ onRefresh }: { onRefresh: () => void }) {
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
        onClick={onRefresh}
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
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // Poll for updates every 15 minutes so users on long-lived
      // sessions still get prompted to refresh after a deploy.
      if (registration) {
        setInterval(() => {
          registration.update().catch(() => {});
        }, 15 * 60 * 1000);
      }
    },
  });

  const onRefresh = () => {
    void updateServiceWorker(true);
  };

  const { pathname } = useLocation();
  const focusMode = FOCUS_ROUTE_PREFIXES.some((p) => pathname.startsWith(p));

  return (
    <div
      className="min-h-screen font-sans relative w-full overflow-x-hidden"
      style={{ background: 'linear-gradient(to bottom, #FAF7F2, #F5F1E8)' }}
    >
      {needRefresh && <UpdateBanner onRefresh={onRefresh} />}

      <main className="relative z-10 w-full max-w-none mx-auto min-h-screen">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      {!focusMode && <BottomNav />}
    </div>
  );
}
