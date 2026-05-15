import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NM, Eye } from '../../components/v2/neome';
import { useSubscription } from '../../contexts/SubscriptionContext';

/**
 * Post-checkout confirmation — full-screen celebration + CTA.
 *
 * Stripe redirects here with ?session_id=<id>&type=<subscription|meal>.
 * We poll the relevant Supabase flag (subscriptions.active or
 * profiles.nutrition_plan_purchased) until the webhook updates it, then
 * show:
 *   • Subscription: serif headline + "Vybrať si program" CTA → /onboarding/programs
 *   • Meal plan:    serif headline + two CTAs ("Vyplniť teraz" / "Vyplniť neskôr")
 *
 * Falls back to a "platba sa spracováva" state with manual retry if the
 * webhook hasn't fired within ~30s.
 */

type CheckoutType = 'subscription' | 'meal';
type Phase = 'pending' | 'confirmed' | 'timeout';

const POLL_INTERVAL_MS = 2000;
const POLL_MAX_ATTEMPTS = 15; // ~30s

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { isPremium, hasMealPlanner, refreshSubscription, loading } = useSubscription();

  const type: CheckoutType = useMemo(() => {
    // Default to 'subscription' if the param is missing — that's the
    // more common flow and matches the older success URL behavior.
    const t = params.get('type');
    return t === 'meal' ? 'meal' : 'subscription';
  }, [params]);

  // Dev-only preview: ?dev=confirmed | pending | timeout lets us eyeball
  // each state without flipping the Supabase flag. Disabled in production
  // builds, but the URL also works on Netlify previews and prod since the
  // gating is just on a query param — by design, so Sam can visually QA
  // the confirmation flow without paying anything.
  const devOverride = params.get('dev') as Phase | null;
  const confirmed = type === 'subscription' ? isPremium : hasMealPlanner;
  const [phase, setPhase] = useState<Phase>(
    devOverride && ['confirmed', 'pending', 'timeout'].includes(devOverride)
      ? devOverride
      : confirmed
        ? 'confirmed'
        : 'pending',
  );
  const [attempt, setAttempt] = useState(0);

  // Poll until the relevant flag flips, or until we time out. Skip the
  // poll entirely when a dev override is active so the preview state
  // doesn't shift under us.
  useEffect(() => {
    if (devOverride) return;
    if (phase !== 'pending') return;
    if (confirmed) {
      setPhase('confirmed');
      return;
    }
    if (attempt >= POLL_MAX_ATTEMPTS) {
      setPhase('timeout');
      return;
    }
    const id = setTimeout(() => {
      refreshSubscription();
      setAttempt((n) => n + 1);
    }, POLL_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [phase, confirmed, attempt, refreshSubscription, devOverride]);

  // Once confirmed, scrub the query params so a back-button doesn't
  // re-trigger the flow on a stale session_id. Skip when previewing —
  // we want the dev override to survive a reload.
  useEffect(() => {
    if (devOverride) return;
    if (phase === 'confirmed' && (params.get('session_id') || params.get('type'))) {
      window.history.replaceState(null, '', '/checkout/success');
    }
  }, [phase, params, devOverride]);

  const onRetry = () => {
    setAttempt(0);
    setPhase('pending');
    refreshSubscription();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: NM.BG,
        fontFamily: NM.SANS,
        color: NM.DEEP,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 'calc(env(safe-area-inset-top) + 24px) 22px calc(env(safe-area-inset-bottom) + 28px)',
        }}
      >
        {phase === 'pending' && <Pending />}
        {phase === 'timeout' && <Timeout onRetry={onRetry} onSkip={() => navigate('/domov-new')} />}
        {phase === 'confirmed' && type === 'subscription' && (
          <SubscriptionConfirmed
            onPrimary={() => navigate('/onboarding-plus/program')}
            onSkip={() => navigate('/domov-new')}
            loading={loading}
          />
        )}
        {phase === 'confirmed' && type === 'meal' && (
          <MealConfirmed
            onNow={() => navigate('/jedalnicek/onboarding')}
            onLater={() => navigate('/domov-new')}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

// ─── States ─────────────────────────────────────────────────────────

function Pending() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', maxWidth: 320, marginInline: 'auto' }}>
      <Spinner />
      <div style={{ marginTop: 28, fontFamily: NM.SERIF, fontSize: 26, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
        Spracovávame tvoju platbu
      </div>
      <div style={{ marginTop: 12, fontFamily: NM.SANS, fontSize: 14, color: NM.MUTED, fontWeight: 300, lineHeight: 1.55 }}>
        Trvá to len pár sekúnd. Nezatváraj stránku.
      </div>
    </div>
  );
}

function Timeout({ onRetry, onSkip }: { onRetry: () => void; onSkip: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', maxWidth: 320, marginInline: 'auto' }}>
      <Eye color={NM.GOLD} size={10}>Platba prebieha</Eye>
      <div style={{ marginTop: 14, fontFamily: NM.SERIF, fontSize: 26, lineHeight: 1.15, letterSpacing: '-0.01em' }}>
        Trvá to dlhšie ako zvyčajne
      </div>
      <div style={{ marginTop: 12, fontFamily: NM.SANS, fontSize: 14, color: NM.MUTED, fontWeight: 300, lineHeight: 1.55 }}>
        Tvoja platba je v poriadku. Potvrdenie sa môže oneskoriť o pár minút. Skús obnoviť za chvíľu — alebo pokračuj na hlavnú stránku, prístup sa odomkne automaticky.
      </div>
      <button onClick={onRetry} style={ctaPrimary({ marginTop: 28 })}>
        Skontrolovať znovu
      </button>
      <button onClick={onSkip} style={ctaText({ marginTop: 12 })}>
        Pokračovať na Domov
      </button>
    </div>
  );
}

function SubscriptionConfirmed({ onPrimary, onSkip, loading }: { onPrimary: () => void; onSkip: () => void; loading: boolean }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CheckMark />
        <Eye color={NM.GOLD} size={10} style={{ marginTop: 28 }}>NeoMe Plus · aktivované</Eye>
        <div style={{ marginTop: 14, fontFamily: NM.SERIF, fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.015em' }}>
          Vitaj{' '}
          <em style={{ color: NM.GOLD, fontWeight: 400 }}>doma.</em>
        </div>
        <div style={{ marginTop: 16, fontFamily: NM.SANS, fontSize: 15, color: NM.MUTED, fontWeight: 300, lineHeight: 1.55, maxWidth: 320 }}>
          Plný prístup k cvičeniam, výžive, cyklu aj meditáciám je odomknutý. Vyber si program, ktorý ťa najviac osloví — môžeš ho kedykoľvek zmeniť.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={onPrimary} disabled={loading} style={ctaPrimary()}>
          Vybrať si program
        </button>
        <button onClick={onSkip} style={ctaText()}>
          Preskočiť, prejdem na hlavnú stránku
        </button>
      </div>
    </div>
  );
}

function MealConfirmed({ onNow, onLater, loading }: { onNow: () => void; onLater: () => void; loading: boolean }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CheckMark tint={NM.SAGE} />
        <Eye color={NM.GOLD} size={10} style={{ marginTop: 28 }}>Jedálniček · odomknutý</Eye>
        <div style={{ marginTop: 14, fontFamily: NM.SERIF, fontSize: 38, lineHeight: 1.05, letterSpacing: '-0.015em' }}>
          Tvoj jedálniček{' '}
          <em style={{ color: NM.SAGE, fontWeight: 400 }}>je tvoj.</em>
        </div>
        <div style={{ marginTop: 16, fontFamily: NM.SANS, fontSize: 15, color: NM.MUTED, fontWeight: 300, lineHeight: 1.55, maxWidth: 320 }}>
          Aby sme ti zostavili plán, ktorý ti naozaj sadne, potrebujeme pár detailov — alergie, ciele, veľkosť domácnosti. Vyplnenie trvá približne 3 minúty.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={onNow} disabled={loading} style={ctaPrimary()}>
          Vyplniť teraz
        </button>
        <button onClick={onLater} style={ctaText()}>
          Vyplním neskôr
        </button>
      </div>
    </div>
  );
}

// ─── Atoms ──────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 999,
        border: `2px solid ${NM.HAIR_2}`,
        borderTopColor: NM.GOLD,
        animation: 'neome-spin 0.9s linear infinite',
      }}
    >
      <style>{`@keyframes neome-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function CheckMark({ tint = NM.GOLD }: { tint?: string }) {
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 999,
        background: '#FFFFFF',
        border: `1px solid ${NM.HAIR_2}`,
        display: 'grid',
        placeItems: 'center',
        boxShadow: '0 8px 24px rgba(61,41,33,0.08)',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5L20 7" />
      </svg>
    </div>
  );
}

function ctaPrimary(extra?: React.CSSProperties): React.CSSProperties {
  return {
    width: '100%',
    padding: '15px 22px',
    borderRadius: 999,
    background: NM.DEEP,
    color: '#fff',
    border: 0,
    cursor: 'pointer',
    fontFamily: NM.SANS,
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: '0.02em',
    ...(extra || {}),
  };
}

function ctaText(extra?: React.CSSProperties): React.CSSProperties {
  return {
    background: 'transparent',
    border: 0,
    padding: '12px 6px',
    cursor: 'pointer',
    fontFamily: NM.SANS,
    fontSize: 13,
    color: NM.MUTED,
    fontWeight: 400,
    textDecoration: 'underline',
    textUnderlineOffset: 3,
    ...(extra || {}),
  };
}
