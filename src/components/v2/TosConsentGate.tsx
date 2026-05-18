import { ReactNode, useEffect, useState } from 'react';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useConsents } from '../../hooks/useConsents';
import { CONSENT_TYPES } from '../../lib/consents';
import { NM } from './neome';

/**
 * Universal TOS + Privacy consent gate.
 *
 * Closes the Google-OAuth-signup-without-consent hole: a user who
 * authenticates via Google from the "choose" screen (login surface)
 * never sees the signup form and so never ticks the GDPR box. Without
 * this gate, they would enter the app with no recorded tos_privacy
 * consent and no signal in consent_events that they ever accepted the
 * privacy policy.
 *
 * Behavior:
 *   • Loading consents → spinner
 *   • tos_privacy granted under current policy version → renders children
 *   • Otherwise → full-screen blocker with accept / sign-out
 *
 * Also re-prompts every user when the policy version is bumped
 * (CONSENT_POLICY_VERSION change in src/lib/consents.ts) — required by
 * Art. 7(3) GDPR for any material change to the terms of consent.
 */
export function TosConsentGate({ children }: { children: ReactNode }) {
  const { signOut } = useSupabaseAuth();
  const { isGranted, grant, loading } = useConsents();
  const [submitting, setSubmitting] = useState(false);
  const blocking = !loading && !isGranted(CONSENT_TYPES.TOS_PRIVACY);

  useEffect(() => {
    if (!blocking) return;
    window.dispatchEvent(new CustomEvent('neome:consent-gate', { detail: { active: true } }));
    return () => {
      window.dispatchEvent(new CustomEvent('neome:consent-gate', { detail: { active: false } }));
    };
  }, [blocking]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: NM.BG }}>
        <div style={{ fontFamily: NM.SANS, color: NM.MUTED, fontSize: 13 }}>Načítavam…</div>
      </div>
    );
  }

  if (isGranted(CONSENT_TYPES.TOS_PRIVACY)) {
    return <>{children}</>;
  }

  const onAccept = async () => {
    if (submitting) return;
    setSubmitting(true);
    const { error } = await grant(CONSENT_TYPES.TOS_PRIVACY, 'app');
    setSubmitting(false);
    if (error) return; // stay on the blocker; retry possible
  };

  const onDecline = async () => {
    if (submitting) return;
    setSubmitting(true);
    await signOut();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: NM.BG,
        padding: 'calc(env(safe-area-inset-top) + 32px) 22px calc(env(safe-area-inset-bottom) + 32px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        fontFamily: NM.SANS,
        color: NM.DEEP,
      }}
    >
      <div
        style={{
          fontFamily: NM.SANS,
          fontSize: 11,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: NM.GOLD,
          fontWeight: 500,
          marginBottom: 10,
        }}
      >
        GDPR · Súhlas
      </div>
      <div
        style={{
          fontFamily: NM.SERIF,
          fontSize: 30,
          lineHeight: 1.15,
          letterSpacing: '-0.015em',
          color: NM.DEEP,
          marginBottom: 16,
          fontWeight: 500,
        }}
      >
        Pred pokračovaním potrebujeme tvoj súhlas
      </div>

      <div
        style={{
          background: '#fff',
          border: `1px solid ${NM.HAIR}`,
          borderRadius: 16,
          padding: 16,
          marginBottom: 22,
        }}
      >
        <div style={{ fontFamily: NM.SANS, fontSize: 14, color: NM.DEEP, lineHeight: 1.65, fontWeight: 400, marginBottom: 12 }}>
          Aby si mohla používať NeoMe, potrebujeme tvoj súhlas s našimi <strong style={{ fontWeight: 500 }}>Podmienkami používania</strong> a so spracovaním osobných údajov podľa <strong style={{ fontWeight: 500 }}>Zásad ochrany osobných údajov</strong>.
        </div>
        <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, lineHeight: 1.65, fontWeight: 300 }}>
          Súhlas zahŕňa iba základné údaje účtu (e-mail, meno). Údaje o cykle, marketing a komunitné príspevky si vyžiadame zvlášť — a iba vtedy, keď ich budeš chcieť používať.
        </div>
        <a
          href="/privacy"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block',
            marginTop: 12,
            fontFamily: NM.SANS,
            fontSize: 12.5,
            color: NM.DEEP,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            fontWeight: 500,
          }}
        >
          Prečítať Zásady ochrany osobných údajov →
        </a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={onAccept}
          disabled={submitting}
          style={{
            all: 'unset',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.5 : 1,
            textAlign: 'center',
            padding: '16px 22px',
            borderRadius: 999,
            background: NM.DEEP,
            color: '#fff',
            fontFamily: NM.SANS,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.03em',
          }}
        >
          {submitting ? 'Spracovávam…' : 'Súhlasím a pokračovať'}
        </button>
        <button
          onClick={onDecline}
          disabled={submitting}
          style={{
            all: 'unset',
            cursor: submitting ? 'not-allowed' : 'pointer',
            textAlign: 'center',
            padding: '13px 22px',
            borderRadius: 999,
            background: 'transparent',
            color: NM.MUTED,
            border: `1px solid ${NM.HAIR_2}`,
            fontFamily: NM.SANS,
            fontSize: 13.5,
            fontWeight: 400,
          }}
        >
          Nesúhlasím — odhlásiť sa
        </button>
      </div>
    </div>
  );
}
