import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initSentry } from '@/lib/sentry';

/**
 * Cookie / storage consent banner.
 *
 * EU ePrivacy Directive (and Slovak Act 351/2011) require informed
 * consent before any non-essential storage. localStorage counts under
 * most interpretations; PWA caches don't (strictly necessary for the
 * app to function).
 *
 * Banner appears on first visit, sticks until the user accepts or
 * declines. Decision persisted under `cookie_consent_v1` so future
 * visits skip it. If the user declines, we still let the app run —
 * essential storage (auth session, app shell cache) is permitted under
 * "strictly necessary" exemption; only third-party analytics / Sentry
 * marketing tracking should be gated.
 *
 * Design follows NeoMe tokens (cream surface, INK text, GOLD accent).
 */

const CONSENT_KEY = 'cookie_consent_v1';
type Consent = 'accepted' | 'declined' | null;

function getStoredConsent(): Consent {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'accepted' || v === 'declined' ? v : null;
  } catch {
    return null;
  }
}

function setStoredConsent(v: 'accepted' | 'declined') {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {
    // Private-mode fallback — banner will re-appear next session.
  }
}

export default function CookieBanner() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  if (!visible) return null;

  const accept = () => {
    setStoredConsent('accepted');
    setVisible(false);
    // Start optional tooling immediately — main.tsx only initialises
    // Sentry when consent was already stored at boot.
    initSentry();
  };
  const decline = () => {
    setStoredConsent('declined');
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Súhlas s cookies"
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 'calc(env(safe-area-inset-bottom) + 12px)',
        zIndex: 9998,
        background: '#F8F5F0',
        color: '#3D2921',
        borderRadius: 18,
        border: '1px solid rgba(61,41,33,0.12)',
        boxShadow: '0 14px 40px rgba(61,41,33,0.22)',
        padding: '18px 18px 16px',
        fontFamily: '"DM Sans", system-ui, sans-serif',
        maxWidth: 520,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          fontFamily: '"Gilda Display", Georgia, serif',
          fontSize: 17,
          fontWeight: 500,
          letterSpacing: '-0.005em',
          marginBottom: 6,
        }}
      >
        Súhlas s ukladaním údajov
      </div>
      <div style={{ fontSize: 12.5, color: 'rgba(61,41,33,0.72)', lineHeight: 1.55 }}>
        Používame nutné cookies a lokálne úložisko prehliadača pre prihlásenie
        a chod aplikácie. Voliteľné je analytické sledovanie chýb (Sentry),
        ktoré nám pomáha rýchlejšie opravovať problémy. Viac v{' '}
        <button
          onClick={() => navigate('/privacy')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            color: '#3D2921',
            textDecoration: 'underline',
            textUnderlineOffset: 2,
          }}
        >
          Zásadách ochrany súkromia
        </button>
        .
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button
          onClick={decline}
          style={{
            all: 'unset',
            cursor: 'pointer',
            flex: 1,
            textAlign: 'center',
            padding: '11px 0',
            borderRadius: 999,
            background: 'transparent',
            border: '1px solid rgba(61,41,33,0.14)',
            fontSize: 12.5,
            fontWeight: 500,
            color: '#3D2921',
          }}
        >
          Iba nutné
        </button>
        <button
          onClick={accept}
          style={{
            all: 'unset',
            cursor: 'pointer',
            flex: 1,
            textAlign: 'center',
            padding: '11px 0',
            borderRadius: 999,
            background: '#3D2921',
            border: 0,
            fontSize: 12.5,
            fontWeight: 500,
            color: '#fff',
          }}
        >
          Súhlasím so všetkým
        </button>
      </div>
    </div>
  );
}

/**
 * Helper for downstream code (Sentry init, analytics scripts) to
 * check the user's choice before doing anything optional.
 */
export function hasOptionalConsent(): boolean {
  return getStoredConsent() === 'accepted';
}
