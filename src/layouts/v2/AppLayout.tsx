import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Users, MessageCircle, User } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import BottomNav from '../../components/v2/BottomNav';
import ErrorBoundary from '../../components/v2/ErrorBoundary';
import { useEffect, useRef, useState } from 'react';

/**
 * Real status-bar inset. iOS standalone PWAs with status-bar-style
 * "default" let content scroll under the clock yet report
 * env(safe-area-inset-top) as 0 — so we measure env() with a probe and,
 * when it lies (0 in standalone), estimate from the device's logical
 * screen height (Dynamic Island ≈59pt, notch ≈48pt, classic ≈20pt).
 */
function useStatusBarInset(): string {
  const [px, setPx] = useState<number | null>(null);
  useEffect(() => {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;top:0;height:env(safe-area-inset-top,0px);width:1px;pointer-events:none;visibility:hidden;';
    document.body.appendChild(probe);
    const envH = probe.getBoundingClientRect().height;
    document.body.removeChild(probe);
    if (envH > 0) { setPx(envH); return; }
    const standalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (!standalone) { setPx(0); return; }
    const h = Math.max(window.screen.height, window.screen.width);
    // Tight estimates — just enough to clear the clock, no wasted screen.
    setPx(h >= 852 ? 7 : h >= 812 ? 6 : 3);
  }, []);
  return px === null ? 'env(safe-area-inset-top, 0px)' : `${px}px`;
}

/**
 * BottomNav shows ONLY on the five top-level tab roots (Gabi 2026-07-26:
 * one rule across the whole app). Every screen the user opens from
 * there — detail, player, compose, settings — is focus mode: no nav,
 * back arrow top-left (guaranteed by the 2026-07-26 back-arrow audit).
 */
const TAB_ROOTS = ['/domov-new', '/new-home', '/kniznica', '/komunita', '/spravy', '/profil'];

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
function UpdateBanner({ onRefresh, topInset }: { onRefresh: () => void; topInset: string }) {
  return (
    <div
      style={{
        // Sticky, not fixed: takes up layout space (content is pushed
        // down instead of being covered) while staying pinned on scroll.
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        background: '#3D2921',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 18px',
        paddingTop: `calc(${topInset} + 10px)`,
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

// Mid-session auto-reload would lose playback position here — on these
// routes the update waits for the next app open instead.
const PLAYER_ROUTES = ['/meditacia/', '/exercise-player', '/stretch/', '/exercise/'];
const isPlayerRoute = (p: string) => PLAYER_ROUTES.some((r) => p.startsWith(r));

const DESKTOP_MIN = 900;

function useIsDesktop(): boolean {
  const [desk, setDesk] = useState(
    typeof window !== 'undefined' ? window.matchMedia(`(min-width:${DESKTOP_MIN}px)`).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(min-width:${DESKTOP_MIN}px)`);
    const on = () => setDesk(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return desk;
}

const NAV = [
  { path: '/domov-new', icon: Home,          label: 'Domov' },
  { path: '/kniznica',  icon: BookOpen,       label: 'Knižnica' },
  { path: '/komunita',  icon: Users,          label: 'Komunita' },
  { path: '/spravy',    icon: MessageCircle,  label: 'Správy' },
  { path: '/profil',    icon: User,           label: 'Profil' },
];

// Desktop web-app chrome: a persistent left sidebar replacing the mobile
// bottom bar (Sam 2026-10-06). It scrolls with the page (not fixed over
// content) and the content sits in a comfortable centred column.
function DesktopSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <aside
      style={{
        width: 236, flexShrink: 0, alignSelf: 'stretch',
        borderRight: '1px solid rgba(61,41,33,0.08)',
        padding: '28px 18px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}
    >
      <div style={{ fontFamily: '"Gilda Display", Georgia, serif', fontSize: 24, color: '#3D2921', padding: '2px 12px 22px' }}>
        Neo<span style={{ color: '#B8864A' }}>Me</span>
      </div>
      {NAV.map((t) => {
        const active = pathname.startsWith(t.path);
        const Icon = t.icon;
        return (
          <button
            key={t.path}
            onClick={() => navigate(t.path)}
            style={{
              all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 12px', borderRadius: 12,
              background: active ? 'rgba(184,134,74,0.12)' : 'transparent',
              color: active ? '#3D2921' : 'rgba(61,41,33,0.62)',
              fontFamily: '"DM Sans", sans-serif', fontSize: 14, fontWeight: active ? 600 : 400,
            }}
          >
            <Icon size={19} strokeWidth={active ? 2.2 : 1.8} color={active ? '#B8864A' : 'currentColor'} />
            {t.label}
          </button>
        );
      })}
    </aside>
  );
}

export default function AppLayout() {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      registrationRef.current = registration ?? null;
      // Long-lived visible sessions (desktop tabs) still learn about
      // deploys without a foreground/background cycle.
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

  // Deploys reach users without any action on their part. iOS freezes
  // timers in backgrounded PWAs, so the interval above never fires for
  // short daily sessions — instead: every return to foreground fetches
  // the deployed SW, and the moment the user LEAVES the app any waiting
  // update applies itself (the reload happens while the app is hidden,
  // so the next open simply starts on the new version).
  const needRefreshRef = useRef(needRefresh);
  needRefreshRef.current = needRefresh;
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const applyingRef = useRef(false);
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        registrationRef.current?.update().catch(() => {});
      } else if (needRefreshRef.current && !applyingRef.current && !isPlayerRoute(pathnameRef.current)) {
        applyingRef.current = true;
        void updateServiceWorker(true);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [updateServiceWorker]);
  const topInset = useStatusBarInset();
  const focusMode = !TAB_ROOTS.includes(pathname.replace(/\/+$/, '') || '/');

  const isDesktop = useIsDesktop();

  if (isDesktop) {
    // Web-app layout: sidebar + centred cream content column on the
    // brown/gold backdrop (painted by #root media query).
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '28px 20px' }}>
        <div
          style={{
            width: '100%', maxWidth: 1100, display: 'flex',
            background: '#F8F5F0', borderRadius: 22, overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(42,26,20,0.28)', minHeight: 'calc(100vh - 56px)',
          }}
        >
          {!focusMode && <DesktopSidebar />}
          <main className="relative z-10" style={{ flex: 1, minWidth: 0, maxWidth: focusMode ? '100%' : 760, margin: focusMode ? 0 : '0 auto', width: '100%' }}>
            {needRefresh && <UpdateBanner onRefresh={onRefresh} topInset="0px" />}
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-sans relative w-full overflow-x-hidden"
      style={{ background: 'linear-gradient(to bottom, #FAF7F2, #F5F1E8)' }}
    >
      {needRefresh && <UpdateBanner onRefresh={onRefresh} topInset={topInset} />}

      {/* Opaque status-bar dock — the top mirror of the BottomNav zone:
          scrolling content visually ends under the clock/battery strip
          instead of colliding with it. Height comes from the device's
          safe-area inset, so on phones without a notch it's invisible. */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: topInset,
          zIndex: 60,
          background: 'rgba(248,245,240,0.92)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          // Soft bottom edge — reads as air, not as a bar.
          WebkitMaskImage: 'linear-gradient(to bottom, #000 72%, transparent)',
          maskImage: 'linear-gradient(to bottom, #000 72%, transparent)',
        }}
      />

      {/* When the floating BottomNav is visible, reserve space for it here
          once — pages then never scroll their last content behind it. */}
      <main
        className="relative z-10 w-full max-w-none mx-auto min-h-screen"
        style={!focusMode ? { paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)' } : undefined}
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      {!focusMode && <BottomNav />}
    </div>
  );
}
