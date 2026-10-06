import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NM, Eye, Ser } from '../../components/v2/neome';
import { SUBSCRIPTION_PLANS, type SubscriptionTierKey } from '../../lib/stripe';

/**
 * /onboarding/plan — first screen of the new-user onboarding.
 *
 * Tabbed Free vs Plus comparison. Tapping a tab (or swiping on touch
 * devices) switches the view. Each tab lists every feature in the
 * product, with the ones included in the selected plan visually
 * highlighted and the ones excluded greyed/struck-through. The sticky
 * CTA at the bottom simply confirms the selected plan.
 *
 * Free  → email signup → /domov-new
 * Plus  → email signup → Stripe checkout
 * Plan choice survives the email-confirmation round-trip via
 * post_signup_route in localStorage (consumed by AuthReal).
 */

const POST_SIGNUP_ROUTE_KEY = 'post_signup_route';
const INTENDED_PLAN_KEY = 'intended_plan';
// CheckoutLauncher reads this on /checkout to pick the right Stripe
// price id for the user's chosen billing period.
const INTENDED_PRICE_ID_KEY = 'intended_price_id';

type Plan = 'free' | 'plus';

// One ordered list of every feature in the product. Each row marks
// whether each plan includes it. Order matters — read top to bottom.
const FEATURES: { label: string; free: boolean; plus: boolean }[] = [
  { label: 'Knižnica cvičení, receptov, meditácií', free: true,  plus: true },
  { label: 'Reflexia a denník (7 dní histórie)',     free: true,  plus: true },
  { label: 'Predpoveď cyklu (náhľad)',                free: true,  plus: true },
  { label: '4 programy na výber',                     free: false, plus: true },
  { label: 'Cyklus s odporúčaniami',                  free: false, plus: true },
  { label: 'Vlastné návyky (bez limitu)',             free: false, plus: true },
  { label: 'Reflexia s celou históriou',              free: false, plus: true },
  { label: 'Plný prístup ku knižnici',                free: false, plus: true },
];

const TIERS = SUBSCRIPTION_PLANS.premium.tiers;

const eur = (n: number) => (n % 1 === 0 ? `${n} €` : `${n.toFixed(2).replace('.', ',')} €`);

// The Plus offer, copied from the website's pricing card (source of
// truth, Sam 2026-10-06) — one price on screen, website bullets.
const PLUS_FEATURES: string[] = [
  'Štyri programy, 130 cvičení — od základov po jednoručky. Každé 15 minút.',
  'Extra 15-minútové aj 5-minútové cvičenia a strečingy',
  '120+ vyvážených receptov bez diét',
  '60+ meditácií od 3 do 15 minút — aj päťminútové',
  'Sledovanie cyklu s tipmi pre každú fázu a možnosťou zapisovať symptómy',
  'Denník, reflexia, návyky a ciele',
  'Komunita a Q&A s Gabi',
  'Získavanie bodov a zľavy u partnerov',
];

// Anchor = what the same thing costs without the deal (monthly's full
// price, or the equivalent months bought one by one), shown struck
// through next to the real price (Sam 2026-10-06).
const OFFER: Record<SubscriptionTierKey, { anchor: number; price: number; unit: string; note: string }> = {
  monthly:   { anchor: 29,  price: 19,  unit: 'prvý mesiac',   note: 'Potom 29 € mesačne · zrušíš kedykoľvek' },
  quarterly: { anchor: 87,  price: 69,  unit: 'za 12 týždňov', note: 'Po 12 týždňoch sa obnoví automaticky · zrušíš kedykoľvek' },
  yearly:    { anchor: 348, price: 199, unit: '/ rok',         note: 'Obnoví sa raz ročne · zrušíš kedykoľvek' },
};

export default function OnboardingPlan() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan>('plus');
  // Billing-period selector only shown for Plus. Default monthly.
  const [billing, setBilling] = useState<SubscriptionTierKey>('quarterly');
  const touchStartX = useRef<number | null>(null);

  const activeTier = TIERS[billing];

  const onConfirm = () => {
    localStorage.setItem(INTENDED_PLAN_KEY, plan);
    if (plan === 'plus') {
      localStorage.setItem(INTENDED_PRICE_ID_KEY, activeTier.priceId);
      localStorage.setItem(POST_SIGNUP_ROUTE_KEY, '/checkout');
    } else {
      localStorage.removeItem(INTENDED_PRICE_ID_KEY);
      localStorage.setItem(POST_SIGNUP_ROUTE_KEY, '/domov-new');
    }
    navigate('/auth?mode=register');
  };

  // Touch swipe — 50px threshold, horizontal only.
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0 && plan === 'free') setPlan('plus');
    if (dx > 0 && plan === 'plus') setPlan('free');
  };

  const accent = plan === 'plus' ? NM.GOLD : NM.SAGE;
  const includedCount = FEATURES.filter((f) => f[plan]).length;

  return (
    <div style={{ background: NM.BG, minHeight: '100vh', position: 'relative', paddingBottom: 160, fontFamily: NM.SANS, color: NM.DEEP }}>
      {/* Top bar */}
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 16px) 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Eye>Vyber si režim</Eye>
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
          Tvoja cesta,
          <br />
          tvoj <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>režim.</em>
        </Ser>
      </div>

      {/* Segmented tab control */}
      <div style={{ padding: '22px 22px 0' }}>
        <div
          role="tablist"
          style={{
            display: 'flex',
            padding: 4,
            background: '#fff',
            border: `1px solid ${NM.HAIR}`,
            borderRadius: 999,
            position: 'relative',
          }}
        >
          {(['free', 'plus'] as Plan[]).map((p) => {
            const active = plan === p;
            const pAccent = p === 'plus' ? NM.GOLD : NM.SAGE;
            return (
              <button
                key={p}
                role="tab"
                aria-selected={active}
                onClick={() => setPlan(p)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  flex: 1,
                  textAlign: 'center',
                  padding: '11px 0',
                  borderRadius: 999,
                  background: active ? NM.DEEP : 'transparent',
                  color: active ? '#fff' : NM.DEEP,
                  fontFamily: NM.SANS,
                  fontSize: 13.5,
                  fontWeight: 500,
                  transition: 'all .18s',
                  position: 'relative',
                }}
              >
                {p === 'free' ? 'Free' : 'Plus'}
                {p === 'plus' && (
                  <span
                    style={{
                      marginLeft: 7,
                      fontSize: 9.5,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase' as const,
                      color: active ? pAccent : NM.EYEBROW,
                      fontWeight: 600,
                    }}
                  >
                    Odporúčané
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Swipable plan card */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ padding: '20px 22px 0' }}
      >
        <div
          style={{
            position: 'relative',
            padding: '24px 22px 22px',
            background: plan === 'plus' ? NM.DEEP_2 : '#fff',
            color: plan === 'plus' ? '#fff' : NM.DEEP,
            borderRadius: 22,
            border: plan === 'plus' ? 'none' : `1px solid ${NM.HAIR}`,
            overflow: 'hidden',
            transition: 'background .25s, color .25s',
          }}
        >
          {plan === 'plus' && (
            <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 999, background: `radial-gradient(circle, ${NM.GOLD}40, transparent 70%)` }} />
          )}

          {/* Price block */}
          <div style={{ position: 'relative' }}>
            <Eye color={accent} size={10}>
              {plan === 'plus' ? 'NeoMe Plus' : 'NeoMe Free'}
            </Eye>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 }}>
              {plan === 'plus' && (
                <span style={{ fontFamily: NM.SERIF, fontSize: 21, fontWeight: 400, textDecoration: 'line-through', opacity: 0.45 }}>
                  {eur(OFFER[billing].anchor)}
                </span>
              )}
              <span style={{ fontFamily: NM.SERIF, fontSize: 40, fontWeight: 500, letterSpacing: '-0.02em' }}>
                {plan === 'plus' ? eur(OFFER[billing].price) : '0 €'}
              </span>
              <span style={{ fontFamily: NM.SANS, fontSize: 11.5, opacity: 0.65, fontWeight: 400 }}>
                {plan === 'plus' ? OFFER[billing].unit : 'navždy'}
              </span>
            </div>
            <div style={{ fontFamily: NM.SANS, fontSize: 11, opacity: 0.65, marginTop: 4, fontWeight: 400 }}>
              {plan === 'plus' ? OFFER[billing].note : 'Bez kreditnej karty'}
            </div>
          </div>

          {/* Billing period selector — Plus only. Tiers with no priceId
              configured yet (env var empty) are disabled so we can't
              accidentally start a checkout that 404s. */}
          {plan === 'plus' && (
            <div style={{ marginTop: 16, display: 'flex', width: '100%', boxSizing: 'border-box', gap: 4, padding: 4, borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
              {(['quarterly', 'monthly', 'yearly'] as SubscriptionTierKey[]).map((k) => {
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
          )}

          {/* Feature list — every row shown for both tabs. Included rows
              get an accent check; excluded rows are dim + strike-through
              so the user can see *exactly* what they're missing. */}
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {plan === 'plus' && PLUS_FEATURES.map((label) => (
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
            {plan === 'free' && FEATURES.map((feat) => {
              const included = feat.free;
              const muted = NM.TERTIARY;
              const fg = NM.DEEP;
              return (
                <div
                  key={feat.label}
                  style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}
                >
                  <div
                    style={{
                      width: 20, height: 20, borderRadius: 999, flexShrink: 0,
                      background: included ? `${accent}28` : 'transparent',
                      border: included ? 'none' : `1px solid ${muted}`,
                      display: 'grid', placeItems: 'center',
                      marginTop: 1,
                    }}
                  >
                    {included ? (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2.5" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: NM.SANS,
                      fontSize: 13,
                      lineHeight: 1.45,
                      color: included ? fg : muted,
                      textDecoration: included ? 'none' : 'line-through',
                      fontWeight: included ? 500 : 400,
                    }}
                  >
                    {feat.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 18, paddingTop: 14,
              borderTop: `1px solid ${plan === 'plus' ? 'rgba(255,255,255,0.12)' : NM.HAIR}`,
              fontFamily: NM.SANS, fontSize: 11.5, opacity: plan === 'plus' ? 0.85 : 0.7, fontWeight: 400,
              display: 'flex', gap: 8, alignItems: 'flex-start',
            }}
          >
            {plan === 'plus' ? (
              <>
                <span style={{ color: NM.GOLD, flexShrink: 0 }}>★</span>
                <span><b>7-dňová záruka vrátenia peňazí.</b> Napíš nám do siedmich dní od aktivácie a vrátime ti celú sumu. Bez otázok.</span>
              </>
            ) : (
              <span>Zahrnuté: {includedCount} z {FEATURES.length} funkcií</span>
            )}
          </div>
        </div>

        {/* Swipe hint — only on first paint, no animation needed */}
        <div
          style={{
            marginTop: 12,
            textAlign: 'center',
            fontFamily: NM.SANS,
            fontSize: 11,
            color: NM.MUTED,
            fontWeight: 300,
          }}
        >
          Potiahni alebo prepni vyššie
        </div>
      </div>

      {/* Sticky confirm CTA */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '18px 22px 28px',
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
          <span>{plan === 'plus' ? 'Chcem sa pridať' : 'Pokračovať s Free'}</span>
          {plan === 'plus' && (
            <span style={{ fontWeight: 400, opacity: 0.7 }}>
              · {eur(OFFER[billing].price)}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
