import { useEffect, useState } from 'react';

/**
 * Install PWA prompt — fires Chromium's beforeinstallprompt + offers
 * a one-tap install button. On iOS (Safari, no beforeinstallprompt)
 * we show a manual instruction instead since Apple requires the user
 * to do it through the Share sheet.
 *
 * Only renders on first qualifying visit and stays dismissed for
 * 14 days after the user closes it, so it doesn't nag.
 */

const DISMISSED_KEY = 'install_prompt_dismissed_v1';
const DISMISS_WINDOW_DAYS = 14;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function dismissedRecently(): boolean {
  try {
    const ts = localStorage.getItem(DISMISSED_KEY);
    if (!ts) return false;
    return Date.now() - parseInt(ts, 10) < DISMISS_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOSSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS/.test(ua);
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone() || dismissedRecently()) return;

    // Chromium / Android path — browser fires this when the PWA meets
    // installability criteria.
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);

    // iOS Safari path — there's no event; just show the hint after
    // a short delay so it doesn't slam in on first load.
    if (isIOSSafari()) {
      const t = setTimeout(() => setShowIosHint(true), 3500);
      return () => {
        clearTimeout(t);
        window.removeEventListener('beforeinstallprompt', handler as EventListener);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setDeferredPrompt(null);
    setShowIosHint(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    dismiss();
  };

  if (!deferredPrompt && !showIosHint) return null;

  const isIOS = !deferredPrompt && showIosHint;

  return (
    <div
      role="dialog"
      aria-label="Pridať na plochu"
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 'calc(env(safe-area-inset-bottom) + 84px)', // sit above BottomNav
        zIndex: 9997,
        background: '#3D2921',
        color: '#fff',
        borderRadius: 18,
        boxShadow: '0 14px 40px rgba(0,0,0,0.35)',
        padding: '16px 16px 14px',
        fontFamily: '"DM Sans", system-ui, sans-serif',
        maxWidth: 520,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: '#B8965A',
          color: '#3D2921',
          display: 'grid',
          placeItems: 'center',
          fontFamily: '"Gilda Display", Georgia, serif',
          fontSize: 18,
          fontStyle: 'italic',
          fontWeight: 500,
          flexShrink: 0,
        }}
      >
        N
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>
          {isIOS ? 'Pridaj NeoMe na plochu' : 'Inštaluj NeoMe'}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.62)', marginTop: 2, lineHeight: 1.4 }}>
          {isIOS
            ? 'Stlač Zdieľať a vyber "Pridať na plochu".'
            : 'Rýchlejší prístup, plnoobrazovková aplikácia.'}
        </div>
      </div>
      {isIOS ? (
        <button
          onClick={dismiss}
          style={{
            all: 'unset',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.10)',
            fontSize: 12,
            fontWeight: 500,
            color: '#fff',
          }}
        >
          OK
        </button>
      ) : (
        <>
          <button
            onClick={install}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '9px 14px',
              borderRadius: 999,
              background: '#fff',
              fontSize: 12.5,
              fontWeight: 500,
              color: '#3D2921',
            }}
          >
            Pridať
          </button>
          <button
            onClick={dismiss}
            aria-label="Zavrieť"
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: 4,
              color: 'rgba(255,255,255,0.55)',
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
}
