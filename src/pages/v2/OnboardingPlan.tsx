import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { NM, Eye, Ser } from '../../components/v2/neome';
import { SUBSCRIPTION_PLANS, formatPrice, type SubscriptionTierKey } from '../../lib/stripe';

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

export default function OnboardingPlan() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan>('plus');
  // Billing-period selector only shown for Plus. Default monthly.
  const [billing, setBilling] = useState<SubscriptionTierKey>('monthly');
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
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 10 }}>
              <span style={{ fontFamily: NM.SERIF, fontSize: 36, fontWeight: 500, letterSpacing: '-0.02em' }}>
                {plan === 'plus' ? `${activeTier.perMonth.toFixed(2).replace('.', ',')} €` : '0 €'}
              </span>
              <span style={{ fontFamily: NM.SANS, fontSize: 11, opacity: 0.65, fontWeight: 400 }}>
                {plan === 'plus' ? '/ mesiac' : 'navždy'}
              </span>
            </div>
            <div style={{ fontFamily: NM.SANS, fontSize: 11, opacity: 0.65, marginTop: 2, fontWeight: 400 }}>
              {plan === 'plus'
                ? (billing === 'monthly'
                    ? 'Zrušíš kedykoľvek'
                    : `${formatPrice(activeTier.price)} ${billing === 'quarterly' ? 'za 3 mesiace' : 'ročne'} · zrušíš kedykoľvek`)
                : 'Bez kreditnej karty'}
            </div>
          </div>

          {/* Billing period selector — Plus only. Tiers with no priceId
              configured yet (env var empty) are disabled so we can't
              accidentally start a checkout that 404s. */}
          {plan === 'plus' && (
            <div style={{ marginTop: 18, display: 'flex', gap: 6 }}>
              {(['monthly', 'quarterly', 'yearly'] as SubscriptionTierKey[]).map((k) => {
                const t = TIERS[k];
                const active = billing === k;
                const disabled = !t.priceId;
                return (
                  <button
                    key={k}
                    onClick={() => !disabled && setBilling(k)}
                    disabled={disabled}
                    title={disabled ? 'Čoskoro dostupné' : undefined}
                    style={{
                      all: 'unset',
                      flex: 1,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      textAlign: 'center',
                      padding: '12px 6px',
                      borderRadius: 14,
                      background: active ? `${NM.GOLD}24` : 'rgba(255,255,255,0.06)',
                      border: active ? `1.5px solid ${NM.GOLD}` : `1px solid rgba(255,255,255,0.12)`,
                      opacity: disabled ? 0.35 : 1,
                      position: 'relative',
                      transition: 'all .15s',
                    }}
                  >
                    <div style={{ fontFamily: NM.SANS, fontSize: 11, fontWeight: 500, color: active ? NM.GOLD : 'rgba(255,255,255,0.78)', letterSpacing: '0.02em' }}>
                      {t.label}
                    </div>
                    <div style={{ marginTop: 4, fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: '#fff' }}>
                      {t.perMonth.toFixed(2).replace('.', ',')} €
                    </div>
                    <div style={{ marginTop: 1, fontFamily: NM.SANS, fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>
                      /mes
                    </div>
                    {t.savingsPct != null && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: 6,
                          padding: '2px 7px',
                          borderRadius: 999,
                          background: NM.GOLD,
                          color: NM.DEEP,
                          fontFamily: NM.SANS,
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase' as const,
                        }}
                      >
                        −{t.savingsPct}%
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Feature list — every row shown for both tabs. Included rows
              get an accent check; excluded rows are dim + strike-through
              so the user can see *exactly* what they're missing. */}
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FEATURES.map((feat) => {
              const included = feat[plan];
              const muted = plan === 'plus' ? 'rgba(255,255,255,0.35)' : NM.TERTIARY;
              const fg = plan === 'plus' ? '#fff' : NM.DEEP;
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
              fontFamily: NM.SANS, fontSize: 11.5, opacity: 0.7, fontWeight: 400,
            }}
          >
            Zahrnuté: {includedCount} z {FEATURES.length} funkcií
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
          <span>Pokračovať s {plan === 'plus' ? 'Plus' : 'Free'}</span>
          {plan === 'plus' && (
            <span style={{ fontWeight: 400, opacity: 0.7 }}>
              · {activeTier.perMonth.toFixed(2).replace('.', ',')} €/mes
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
