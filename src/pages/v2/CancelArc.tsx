import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Page, BackHeader, Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Cancel arc — R10 (BC-1, 3-step warm flow)
 *
 * Single component renders three internal steps:
 *   0. Retention offer — survey + 50% discount + pause alternative
 *   1. Confirm — list of what you'd lose + confirm CTA
 *   2. Farewell — photo hero + 'what stays yours' card
 *
 * Internal step state; no separate routes (per design BC-1: it's
 * one continuous arc, not a multi-page navigation).
 *
 * FEATURE-NEEDED-CANCEL-RETENTION-COUPON: 'Prijať ponuku' should
 * apply a 50%-for-3-months Stripe coupon to the active subscription.
 * Currently navigates back to /profil.
 *
 * FEATURE-NEEDED-CANCEL-PAUSE: Stripe subscription pause flow (Stripe
 * supports pausing collection). Currently the row is a static UI.
 *
 * FEATURE-NEEDED-CANCEL-CONFIRM: actually call cancelSubscription
 * from useSubscription on confirm. Currently advances to farewell
 * step without persisting the cancellation.
 *
 * Mounted at /settings/cancel.
 */

const SK_MONTHS = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];

const REASONS = [
  'Je to pre mňa priveľa',
  'Nenašla som, čo som hľadala',
  'Cenovo mi to nesedí',
  'Aktuálne nemám čas',
  'Niečo iné',
];

const LOSS_BENEFITS = [
  { t: 'Všetky programy', c: NM.TERRA },
  { t: 'Jedálniček a recepty', c: NM.SAGE },
  { t: 'Plný cyklus tracker', c: NM.MAUVE },
  { t: 'Všetky meditácie', c: NM.DUSTY },
];

const KEPT = ['Denník a zápisy', 'Návyky a pokrok', 'Komunita a priateľstvá', 'Body a odznaky'];

export default function CancelArc() {
  const navigate = useNavigate();
  const { subscription, cancelSubscription } = useSubscription();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [reason, setReason] = useState<number | null>(null);

  const periodEnd = subscription?.current_period_end ? new Date(subscription.current_period_end * 1000) : null;
  const periodEndLabel = periodEnd ? `${periodEnd.getDate()}. ${SK_MONTHS[periodEnd.getMonth()]} ${periodEnd.getFullYear()}` : 'koniec platnosti';

  const onConfirm = async () => {
    // FEATURE-NEEDED-CANCEL-CONFIRM
    try {
      await cancelSubscription?.();
    } catch {
      /* swallow — visual flow continues */
    }
    setStep(2);
  };

  if (step === 0) {
    return (
      <Page paddingBottom={40}>
        <BackHeader title="Zrušenie Plus" showSearch={false} onBack={() => navigate('/profil')} />
        <div style={{ padding: '0 18px' }}>
          <Ser size={34}>
            Škoda, že
            <br />
            <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>odchádzaš</em>.
          </Ser>
          <Body size={14} color={NM.DEEP} weight={400} style={{ marginTop: 14 }}>
            Predtým než klikneš ďalej — chceme si overiť, či ti vieme pomôcť inak.
          </Body>
        </div>

        <div style={{ margin: '24px 18px 0' }}>
          <Eye size={10} style={{ marginBottom: 10 }}>Prečo odchádzaš?</Eye>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {REASONS.map((r, i) => {
              const sel = reason === i;
              return (
                <button
                  key={r}
                  onClick={() => setReason(i)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '13px 16px',
                    background: '#fff',
                    borderRadius: 12,
                    border: `1px solid ${sel ? NM.TERRA : NM.HAIR_2}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ width: 18, height: 18, borderRadius: 999, border: `1.5px solid ${sel ? NM.TERRA : NM.HAIR_2}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sel && <div style={{ width: 9, height: 9, borderRadius: 999, background: NM.TERRA }} />}
                  </div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 400 }}>{r}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Retention "50% off" and "Pause subscription" alternatives were
            empty promises — both buttons navigated to /profil without
            applying a coupon or initiating a pause. Removed until the
            real Stripe coupon + pause flows are wired (FEATURE-NEEDED-
            CANCEL-RETENTION-COUPON / -CANCEL-PAUSE). */}

        <div style={{ margin: '24px 18px 0', textAlign: 'center' }}>
          <button onClick={() => setStep(1)} style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12.5, color: NM.MUTED, textDecoration: 'underline', fontWeight: 400 }}>
            Napriek tomu zrušiť
          </button>
        </div>
      </Page>
    );
  }

  if (step === 1) {
    return (
      <Page paddingBottom={120}>
        <BackHeader title="Posledný krok" showSearch={false} onBack={() => setStep(0)} />
        <div style={{ padding: '20px 18px 0' }}>
          <Ser size={32}>
            Stratíš
            <br />
            <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>toto</em>
          </Ser>

          <div style={{ marginTop: 24, background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
            {LOSS_BENEFITS.map((b, i, arr) => (
              <div key={b.t} style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: i < arr.length - 1 ? `1px solid ${NM.HAIR}` : 'none' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: b.c, flexShrink: 0 }} />
                <div style={{ flex: 1, fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 400, textDecoration: 'line-through', opacity: 0.8 }}>{b.t}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 20, padding: '14px 16px', background: NM.CREAM_2 ?? '#F1ECE3', borderRadius: 14, fontFamily: NM.SANS, fontSize: 11.5, color: NM.MUTED, lineHeight: 1.5, fontWeight: 400 }}>
            Plus ti zostane aktívne do <strong style={{ color: NM.DEEP, fontWeight: 500 }}>{periodEndLabel}</strong>. Do tej doby sa môžeš kedykoľvek vrátiť.
          </div>
        </div>

        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: `16px 18px calc(env(safe-area-inset-bottom) + 16px)`, background: 'rgba(248,245,240,0.95)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${NM.HAIR}` }}>
          <button onClick={onConfirm} style={{ width: '100%', padding: '14px 20px', background: 'transparent', color: NM.TERRA, border: `1px solid ${NM.TERRA}`, borderRadius: 999, fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            Potvrdiť zrušenie
          </button>
          <button onClick={() => navigate('/profil')} style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', marginTop: 10, fontFamily: NM.SANS, fontSize: 12, color: NM.DEEP, textAlign: 'center', fontWeight: 500 }}>
            Nie, vrátiť sa
          </button>
        </div>
      </Page>
    );
  }

  // Farewell
  return (
    <Page paddingBottom={40}>
      <div style={{ height: 340, position: 'relative', backgroundImage: 'url(/images/r9/hero-yoga.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(42,26,20,0.2), rgba(248,245,240,1))' }} />
        <div style={{ position: 'absolute', bottom: 20, left: 18, right: 18 }}>
          <Eye color={NM.GOLD}>Vidíme sa</Eye>
          <Ser size={36} style={{ marginTop: 10 }}>
            Ďakujeme, že
            <br />
            si bola s <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>nami</em>.
          </Ser>
        </div>
      </div>

      <div style={{ padding: '0 18px' }}>
        <Body size={15} color={NM.DEEP} weight={400} style={{ maxWidth: 340 }}>
          Plus ti zostane do <strong style={{ color: NM.DEEP, fontWeight: 500 }}>{periodEndLabel}</strong>. Tvoj denník, návyky a komunita ostávajú — môžeš ich navštíviť kedykoľvek.
        </Body>
      </div>

      <div style={{ margin: '24px 18px 0', padding: '18px 20px', background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}` }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Čo ostáva tvoje</Eye>
        {KEPT.map((t) => (
          <div key={t} style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.SAGE} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
            <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 400 }}>{t}</div>
          </div>
        ))}
      </div>

      <div style={{ margin: '24px 18px 0' }}>
        <button onClick={() => navigate('/domov-new')} style={{ width: '100%', padding: '14px 20px', background: NM.DEEP, color: '#fff', border: 'none', borderRadius: 999, fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          Späť na Domov
        </button>
        <button onClick={() => navigate('/paywall')} style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', marginTop: 14, fontFamily: NM.SANS, fontSize: 12, color: NM.TERRA, textAlign: 'center', fontWeight: 500 }}>
          Obnoviť Plus
        </button>
      </div>
    </Page>
  );
}
