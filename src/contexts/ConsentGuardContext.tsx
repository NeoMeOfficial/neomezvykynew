import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { NM } from '../components/v2/neome';
import { useConsents } from '../hooks/useConsents';
import { CONSENT_LABELS, CONSENT_TYPES, ConsentType } from '../lib/consents';

/**
 * Contextual GDPR consent guard.
 *
 * Usage:
 *   const requireConsent = useConsentGuard();
 *   const onSave = async () => {
 *     const ok = await requireConsent(CONSENT_TYPES.HEALTH_DATA);
 *     if (!ok) return;
 *     // …proceed with save
 *   };
 *
 * If the user has already granted the consent (under the current policy
 * version), resolves true immediately without showing UI. Otherwise opens
 * a Slovak bottom sheet explaining the consent and waits for the user's
 * decision. Accept → records consent_event(granted=true) + resolves true.
 * Decline → resolves false; nothing is recorded (Article 7(4) — refusal
 * to consent must not have consequences other than losing the function).
 *
 * Per-call copy lets the prompt explain the immediate action: e.g.
 *   await requireConsent(CONSENT_TYPES.COMMUNITY, {
 *     actionLabel: 'Zverejniť príspevok',
 *   });
 */

interface GuardCopy {
  /** Custom title; defaults to CONSENT_LABELS[type].title */
  title?: string;
  /** Custom description; defaults to CONSENT_LABELS[type].description */
  description?: string;
  /** Custom accept-button label; defaults to "Súhlasím a pokračovať" */
  acceptLabel?: string;
  /** Custom decline-button label; defaults to "Teraz nie" */
  declineLabel?: string;
}

type RequireConsentFn = (type: ConsentType, copy?: GuardCopy) => Promise<boolean>;

const ConsentGuardCtx = createContext<RequireConsentFn | null>(null);

interface PendingPrompt {
  type: ConsentType;
  copy?: GuardCopy;
  resolve: (granted: boolean) => void;
}

export function ConsentGuardProvider({ children }: { children: ReactNode }) {
  const { isGranted, grant, reload } = useConsents();
  const [pending, setPending] = useState<PendingPrompt | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Stable ref so the requireConsent callback doesn't churn on every
  // re-render (which would re-run effects in consumers that include it
  // in dep arrays).
  const isGrantedRef = useRef(isGranted);
  isGrantedRef.current = isGranted;

  const requireConsent = useCallback<RequireConsentFn>(
    async (type, copy) => {
      // Fast path — already granted, no UI.
      if (isGrantedRef.current(type)) return true;
      // Make sure we have fresh consent state (avoid showing the sheet
      // for a consent that was granted in another tab a second ago).
      await reload();
      if (isGrantedRef.current(type)) return true;
      return new Promise<boolean>((resolve) => {
        setPending({ type, copy, resolve });
      });
    },
    [reload]
  );

  const onAccept = async () => {
    if (!pending || submitting) return;
    setSubmitting(true);
    const { error } = await grant(pending.type, 'app');
    setSubmitting(false);
    if (error) {
      // Leave the sheet open — user can retry.
      return;
    }
    pending.resolve(true);
    setPending(null);
  };

  const onDecline = () => {
    if (!pending) return;
    pending.resolve(false);
    setPending(null);
  };

  return (
    <ConsentGuardCtx.Provider value={requireConsent}>
      {children}
      {pending && (
        <ConsentSheet
          type={pending.type}
          copy={pending.copy}
          submitting={submitting}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      )}
    </ConsentGuardCtx.Provider>
  );
}

export function useConsentGuard(): RequireConsentFn {
  const ctx = useContext(ConsentGuardCtx);
  if (!ctx) {
    throw new Error('useConsentGuard must be used inside <ConsentGuardProvider>');
  }
  return ctx;
}

// ─── Sheet ──────────────────────────────────────────────────────

interface SheetProps {
  type: ConsentType;
  copy?: GuardCopy;
  submitting: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

function ConsentSheet({ type, copy, submitting, onAccept, onDecline }: SheetProps) {
  const def = CONSENT_LABELS[type];
  const title = copy?.title ?? def.title;
  const description = copy?.description ?? def.description;
  const acceptLabel = copy?.acceptLabel ?? 'Súhlasím a pokračovať';
  const declineLabel = copy?.declineLabel ?? 'Teraz nie';
  const isHealthData = type === CONSENT_TYPES.HEALTH_DATA;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'rgba(20, 12, 8, 0.45)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        // Dismiss on backdrop tap = decline (same as the "Teraz nie" btn).
        if (e.target === e.currentTarget) onDecline();
      }}
    >
      <div
        style={{
          background: '#fff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: '22px 22px calc(env(safe-area-inset-bottom) + 22px)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: NM.HAIR_2, margin: '0 auto 16px' }} />

        <div
          style={{
            fontFamily: NM.SANS,
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: NM.GOLD,
            fontWeight: 500,
            marginBottom: 6,
          }}
        >
          GDPR · Súhlas
        </div>
        <div
          style={{
            fontFamily: NM.SERIF,
            fontSize: 22,
            lineHeight: 1.2,
            color: NM.DEEP,
            marginBottom: 12,
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontFamily: NM.SANS,
            fontSize: 14,
            lineHeight: 1.6,
            color: NM.MUTED,
            fontWeight: 300,
            marginBottom: 14,
          }}
        >
          {description}
        </div>

        {isHealthData && (
          <div
            style={{
              background: NM.BG,
              borderRadius: 12,
              padding: '12px 14px',
              fontFamily: NM.SANS,
              fontSize: 12.5,
              color: NM.MUTED,
              lineHeight: 1.6,
              marginBottom: 14,
              border: `1px solid ${NM.HAIR}`,
            }}
          >
            <strong style={{ color: NM.DEEP, fontWeight: 500 }}>Čl. 9 ods. 2 písm. a) GDPR.</strong>{' '}
            Údaje o zdraví ukladáme šifrovane a sú dostupné iba tebe. Súhlas
            môžeš kedykoľvek odvolať v Nastaveniach → Súkromie.
          </div>
        )}

        <a
          href="/privacy"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block',
            fontFamily: NM.SANS,
            fontSize: 12.5,
            color: NM.DEEP,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            fontWeight: 500,
            marginBottom: 18,
          }}
        >
          Viac v Zásadách ochrany osobných údajov →
        </a>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onAccept}
            disabled={submitting}
            style={{
              all: 'unset',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.5 : 1,
              textAlign: 'center',
              padding: '15px 22px',
              borderRadius: 999,
              background: NM.DEEP,
              color: '#fff',
              fontFamily: NM.SANS,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '0.03em',
            }}
          >
            {submitting ? 'Spracovávam…' : acceptLabel}
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
            {declineLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
