import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NM, Eye, Ser } from '../../components/v2/neome';
import { SUBSCRIPTION_PLANS, type SubscriptionTierKey } from '../../lib/stripe';

/**
 * /onboarding/plan — first screen of the new-user onboarding.
 *
 * Plus-only (Sam 2026-10-15: the free tier is gone). One plan, NeoMe Plus,
 * with three billing periods (monthly / 12 weeks / yearly). The sticky CTA
 * goes straight to checkout — it works without a login and creates the
 * account at payment time; the password is set on the success screen.
 */

const INTENDED_PLAN_KEY = 'intended_plan';
// CheckoutLauncher reads this on /checkout to pick the right Stripe
// price id for the user's chosen billing period.
const INTENDED_PRICE_ID_KEY = 'intended_price_id';

const TIERS = SUBSCRIPTION_PLANS.premium.tiers;

const eur = (n: number) => (n % 1 === 0 ? `${n} €` : `${n.toFixed(2).replace('.', ',')} €`);

// Website pricing bullets (source of truth, Sam 2026-10-06).
const PLUS_FEATURES: string[] = [
  'Štyri programy, 130 cvičení — od základov po jednoručky. Každé 15 minút.',
  'Extra 15-minútové aj 5-minútové cvičenia a strečingy',
  '120+ vyvážených receptov bez diét',
  '5-minútové meditácie, žiadna ezoterika',
  'Sledovanie cyklu s tipmi pre každú fázu a možnosťou zapisovať symptómy',
  'Budovanie návykov, zápisky do denníka, reflexia',
  'Články o zdraví, cvičení, vyváženom stravovaní, materstve, sebarozvoji',
  'Komunita a Q&A s Gabi',
  'Získavanie bodov a zľavy u partnerov',
];

// Anchor = what the same thing costs without the deal, shown struck
// through next to the real price (Sam 2026-10-06).
const OFFER: Record<SubscriptionTierKey, { anchor: number | null; price: number; unit: string; note: string; chip: string }> = {
  monthly:   { anchor: null, price: 29,  unit: '/ mesiac',      note: 'Zrušíš kedykoľvek',                                         chip: 'Ideálna na vyskúšanie' },
  quarterly: { anchor: 87,   price: 69,  unit: 'za 12 týždňov', note: 'Po 12 týždňoch sa obnoví automaticky · zrušíš kedykoľvek', chip: 'Špeciálna ponuka' },
  yearly:    { anchor: 348,  price: 199, unit: '/ rok',         note: 'Obnoví sa raz ročne · zrušíš kedykoľvek',                   chip: 'Pre skutočnú zmenu' },
};

export default function OnboardingPlan() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<SubscriptionTierKey>('quarterly');
  const accent = NM.GOLD;
  const activeTier = TIERS[billing];

  const onConfirm = () => {
    localStorage.setItem(INTENDED_PLAN_KEY, 'plus');
    localStorage.setItem(INTENDED_PRICE_ID_KEY, activeTier.priceId);
    navigate(`/checkout/plus?price=${encodeURIComponent(activeTier.priceId)}`);
  };

  return (
    <div style={{ background: NM.BG, minHeight: '100vh', position: 'relative', paddingBottom: 160, fontFamily: NM.SANS, color: NM.DEEP }}>
      {/* Top bar */}
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 16px) 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Eye>NeoMe Plus</Eye>
        <button
          onClick={() => navigate('/')}
          aria-label="Zavrieť"
          style={{
            all: 'unset',
            cursor: 'pointer',
            width: 36, height: 36, borderRadius: 999,
            background: '#fff', border: `1px solid ${NM.HAIR}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div style={{ padding: '18px 22px 0' }}>
        <Ser size={32}>
          Celá NeoMe,
          <br />
          jeden <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>prístup.</em>
        </Ser>
        <div style={{ marginTop: 10, maxWidth: 320, fontFamily: NM.SANS, fontSize: 13.5, color: NM.MUTED, lineHeight: 1.5, fontWeight: 400 }}>
          Vyber si, ako dlho chceš ísť s nami — a všetko sa ti odomkne naraz.
        </div>
      </div>

      {/* Plan card (dark, premium) */}
      <div style={{ padding: '22px 22px 0' }}>
        <div
          style={{
            position: 'relative',
            padding: '24px 22px 22px',
            background: NM.DEEP_2,
            color: '#fff',
            borderRadius: 22,
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 999, background: `radial-gradient(circle, ${NM.GOLD}40, transparent 70%)` }} />

          {/* Price block */}
          <div style={{ position: 'relative' }}>
            <Eye color={accent} size={10}>NeoMe Plus</Eye>
            <div
              style={{
                display: 'inline-block', marginTop: 12, padding: '4px 11px', borderRadius: 999,
                background: billing === 'quarterly' ? NM.GOLD : 'transparent',
                border: billing === 'quarterly' ? '1px solid transparent' : '1px solid rgba(255,255,255,0.25)',
                color: billing === 'quarterly' ? NM.DEEP : 'rgba(255,255,255,0.75)',
                fontFamily: NM.SANS, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}
            >
              {OFFER[billing].chip}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 }}>
              <span style={{ fontFamily: NM.SERIF, fontSize: 21, fontWeight: 400, textDecoration: 'line-through', opacity: 0.45, minWidth: 1 }}>
                {OFFER[billing].anchor != null ? eur(OFFER[billing].anchor!) : ' '}
              </span>
              <span style={{ fontFamily: NM.SERIF, fontSize: 40, fontWeight: 500, letterSpacing: '-0.02em' }}>
                {eur(OFFER[billing].price)}
              </span>
              <span style={{ fontFamily: NM.SANS, fontSize: 11.5, opacity: 0.65, fontWeight: 400 }}>
                {OFFER[billing].unit}
              </span>
            </div>
            <div style={{ fontFamily: NM.SANS, fontSize: 11, opacity: 0.65, marginTop: 4, fontWeight: 400 }}>
              {OFFER[billing].note}
            </div>
          </div>

          {/* Billing period selector. Tiers with no priceId configured yet
              (env var empty) are disabled so we can't start a 404 checkout. */}
          <div style={{ marginTop: 16, display: 'flex', width: '100%', boxSizing: 'border-box', gap: 4, padding: 4, borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
            {(['monthly', 'quarterly', 'yearly'] as SubscriptionTierKey[]).map((k) => {
              const active = billing === k;
              const disabled = !TIERS[k].priceId;
              const label = k === 'quarterly' ? '12 týždňov' : k === 'monthly' ? 'Mesačne' : 'Ročne';
              return (
                <button
                  key={k}
                  onClick={() => !disabled && setBilling(k)}
                  disabled={disabled}
                  style={{
                    all: 'unset',
                    flex: 1,
                    textAlign: 'center',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    padding: '9px 0',
                    borderRadius: 999,
                    fontFamily: NM.SANS,
                    fontSize: 11.5,
                    fontWeight: active ? 600 : 400,
                    color: active ? NM.DEEP : 'rgba(255,255,255,0.7)',
                    background: active ? NM.GOLD : 'transparent',
                    opacity: disabled ? 0.35 : 1,
                    transition: 'all .15s',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* What's included */}
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PLUS_FEATURES.map((label) => (
              <div key={label} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: 999, flexShrink: 0, background: `${accent}28`, display: 'grid', placeItems: 'center', marginTop: 1 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <div style={{ fontFamily: NM.SANS, fontSize: 13, lineHeight: 1.45, color: '#fff', fontWeight: 500 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 18, paddingTop: 14,
              borderTop: `1px solid rgba(255,255,255,0.12)`,
              fontFamily: NM.SANS, fontSize: 11.5, opacity: 0.85, fontWeight: 400,
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}
          >
            <span style={{ color: NM.GOLD, flexShrink: 0 }}>★</span>
            <span><b>7-dňová záruka vrátenia peňazí.</b> Napíš nám do siedmich dní od aktivácie a vrátime ti celú sumu. Bez otázok.</span>
          </div>
        </div>
      </div>

      {/* Sticky confirm CTA */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '18px 22px calc(env(safe-area-inset-bottom, 0px) + 28px)',
          background: 'linear-gradient(180deg, rgba(248,245,240,0) 0%, rgba(248,245,240,0.98) 30%, rgba(248,245,240,1) 100%)',
        }}
      >
        <button
          onClick={onConfirm}
          style={{
            all: 'unset',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%',
            boxSizing: 'border-box',
            padding: '16px',
            background: NM.DEEP,
            color: '#fff',
            borderRadius: 999,
            fontFamily: NM.SANS, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em',
            cursor: 'pointer',
          }}
        >
          <span>Chcem sa pridať</span>
          <span style={{ fontWeight: 400, opacity: 0.7 }}>· {eur(OFFER[billing].price)}</span>
        </button>
      </div>
    </div>
  );
}
