import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { usePointsLedger } from '../../hooks/usePointsLedger';
import { useAuthContext } from '../../contexts/AuthContext';
import { Page, BackHeader, Eye, Ser, NM } from '../../components/v2/neome';

/**
 * Points rewards catalog — /body/odmeny
 *
 * Balance card, reward rows with live cooldown state, confirm sheet,
 * and code/confirmation reveal after redemption.
 *
 * Redemption calls the `redeem-reward` Supabase Edge Function which:
 * - Verifies balance, enforces per-reward cooldown + max cap
 * - For subscription rewards: applies Stripe coupon automatically
 * - For partner rewards: serves a code from the partner_reward_codes pool
 * - Deducts points from points_ledger and logs reward_redemptions
 */

interface Reward {
  slug: string;
  name: string;
  description: string;
  point_cost: number;
  color_token: string;
  stripe_coupon_id: string | null;
  image_key: string | null;
}

interface Redemption {
  reward_slug: string;
  next_eligible_at: string;
}

const EARN_RULES: { a: string; p: string }[] = [
  { a: 'Dokončené cvičenie', p: '+10' },
  { a: 'Meditácia', p: '+8' },
  { a: 'Reflexia / denník', p: '+6' },
  { a: 'Záznam cyklu', p: '+4' },
  { a: 'Dokončený návyk', p: '+3' },
  { a: 'Lajk v komunite', p: '+1 (max 5/deň)' },
  { a: 'Príspevok v komunite', p: '+20' },
  { a: 'Odporúčanie · registrácia', p: '+50' },
  { a: 'Odporúčanie · predplatné', p: '+300' },
];

const REWARDS_PREVIEW_COUNT = 3;

const FALLBACK: Reward[] = [
  { slug: 'sub-50pct',        name: '50% zľava na ďalší mesiac',       description: 'Tvoja ďalšia platba NeoMe Plus bude o polovicu lacnejšia. Aplikuje sa automaticky.', point_cost: 2000, color_token: 'TERRA', stripe_coupon_id: 'NEOME_50PCT',    image_key: 'section-body.jpg' },
  { slug: 'sub-month-free',   name: 'Mesiac NeoMe Plus zadarmo',        description: 'Tvoja ďalšia platba bude plne odpustená. Aplikuje sa automaticky na Stripe.',       point_cost: 3500, color_token: 'GOLD',  stripe_coupon_id: 'NEOME_MONTH_FREE', image_key: 'hero-yoga.jpg' },
  { slug: 'partner-gymwear',  name: '20% zľava na športové oblečenie',  description: 'Jednorázový zľavový kód poslaný priamo do apky.',                                    point_cost: 800,  color_token: 'SAGE',  stripe_coupon_id: null,               image_key: 'section-nutrition.jpg' },
  { slug: 'partner-wellness', name: 'Vstup do wellness zadarmo',        description: 'Jednorázový kód pre partnerskú saunu / wellness centrum.',                           point_cost: 1200, color_token: 'DUSTY', stripe_coupon_id: null,               image_key: 'lifestyle-yoga-pose.jpg' },
];

const NM_COLORS: Record<string, string> = {
  TERRA: NM.TERRA, SAGE: NM.SAGE, DUSTY: NM.DUSTY, MAUVE: NM.MAUVE, GOLD: NM.GOLD,
};

type ModalState =
  | { type: 'idle' }
  | { type: 'confirm'; reward: Reward }
  | { type: 'loading'; reward: Reward }
  | { type: 'success'; reward: Reward; code: string | null; isStripe: boolean }
  | { type: 'error'; message: string };

export default function PointsRewards() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { balance, refresh: refreshBalance } = usePointsLedger();
  const [rewards, setRewards] = useState<Reward[]>(FALLBACK);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [modal, setModal] = useState<ModalState>({ type: 'idle' });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('rewards')
        .select('slug, name, description, point_cost, color_token, stripe_coupon_id, image_key')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      if (!cancelled && data && data.length > 0) setRewards(data as Reward[]);
    })();
    return () => { cancelled = true; };
  }, []);

  const loadRedemptions = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('reward_redemptions')
      .select('reward_slug, next_eligible_at')
      .eq('user_id', user.id)
      .order('redeemed_at', { ascending: false });
    if (data) {
      // Keep only the most recent redemption per slug
      const seen = new Set<string>();
      const deduped: Redemption[] = [];
      for (const row of data) {
        if (!seen.has(row.reward_slug)) {
          seen.add(row.reward_slug);
          deduped.push(row);
        }
      }
      setRedemptions(deduped);
    }
  }, [user?.id]);

  useEffect(() => { loadRedemptions(); }, [loadRedemptions]);

  const cooldownFor = (slug: string): Date | null => {
    const r = redemptions.find(d => d.reward_slug === slug);
    if (!r) return null;
    const d = new Date(r.next_eligible_at);
    return d > new Date() ? d : null;
  };

  const formatCooldown = (d: Date): string => {
    const diffMs = d.getTime() - Date.now();
    const days = Math.ceil(diffMs / 86400000);
    if (days > 30) return `${Math.ceil(days / 30)} mes.`;
    return `${days} d`;
  };

  const onRedeem = async (reward: Reward) => {
    setModal({ type: 'loading', reward });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setModal({ type: 'error', message: 'Nie si prihlásená.' });
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/redeem-reward`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ reward_slug: reward.slug }),
        }
      );

      const body = await res.json();

      if (!res.ok) {
        const msg =
          body.error === 'insufficient_points' ? `Nemáš dostatok bodov. Zostatok: ${body.balance}` :
          body.error === 'cooldown_active' ? 'Tento reward si už uplatnila. Počkaj na koniec cooldownu.' :
          body.error === 'no_active_subscription' ? 'Zľava sa vzťahuje len na aktívne predplatné.' :
          body.error === 'no_codes_available' ? 'Momentálne nie sú dostupné žiadne kódy. Skús neskôr.' :
          body.error === 'max_redemptions_reached' ? 'Dosiahla si maximálny počet uplatnení tohto rewardu.' :
          'Niečo sa pokazilo. Skús znova.';
        setModal({ type: 'error', message: msg });
        return;
      }

      await Promise.all([refreshBalance?.(), loadRedemptions()]);
      setModal({
        type: 'success',
        reward,
        code: body.code ?? null,
        isStripe: !!reward.stripe_coupon_id,
      });
    } catch {
      setModal({ type: 'error', message: 'Chyba siete. Skontroluj pripojenie.' });
    }
  };

  return (
    <Page>
      <BackHeader title="Odmeny" showSearch={false} />

      <div style={{ padding: '0 18px' }}>
        <Ser size={30}>
          Vymeň body za
          <br />
          <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>odmeny</em>
        </Ser>
        <div style={{ marginTop: 12, padding: '12px 16px', background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eye size={11.5}>Tvoj zostatok</Eye>
          <div style={{ fontFamily: NM.SERIF, fontSize: 22, color: NM.GOLD, fontWeight: 500, letterSpacing: '-0.01em' }}>{balance} bodov</div>
        </div>
      </div>

      <div style={{ margin: '24px 18px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(expanded ? rewards : rewards.slice(0, REWARDS_PREVIEW_COUNT)).map((r) => {
          const tone = NM_COLORS[r.color_token] ?? NM.TERRA;
          const canAfford = balance >= r.point_cost;
          const cooldown = cooldownFor(r.slug);
          const isOnCooldown = !!cooldown;
          const isAvailable = canAfford && !isOnCooldown;

          return (
            <div key={r.slug} style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: 100, minHeight: 110, backgroundImage: `url(/images/r9/${r.image_key ?? 'hero-yoga.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
                <div style={{ padding: '14px 16px', flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: tone, fontWeight: 600 }}>{r.point_cost} bodov</div>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: NM.DEEP, marginTop: 5, letterSpacing: '-0.005em', lineHeight: 1.25 }}>{r.name}</div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED, marginTop: 4, lineHeight: 1.4 }}>{r.description}</div>
                  <button
                    onClick={() => isAvailable && setModal({ type: 'confirm', reward: r })}
                    disabled={!isAvailable}
                    style={{
                      all: 'unset',
                      cursor: isAvailable ? 'pointer' : 'not-allowed',
                      marginTop: 10,
                      padding: '7px 14px',
                      background: isOnCooldown ? `${tone}18` : isAvailable ? NM.DEEP : '#F1ECE3',
                      color: isOnCooldown ? tone : isAvailable ? '#fff' : NM.TERTIARY,
                      border: isOnCooldown ? `1px solid ${tone}40` : 'none',
                      borderRadius: 999,
                      fontFamily: NM.SANS,
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  >
                    {isOnCooldown
                      ? `Znovu za ${formatCooldown(cooldown!)}`
                      : canAfford
                        ? 'Získať'
                        : `Ešte ${r.point_cost - balance} bodov`}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expand / collapse rewards */}
      {rewards.length > REWARDS_PREVIEW_COUNT && (
        <div style={{ margin: '14px 18px 0', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 18px',
              borderRadius: 999,
              background: '#fff',
              border: `1px solid ${NM.HAIR_2}`,
              fontFamily: NM.SANS,
              fontSize: 12.5,
              fontWeight: 500,
              color: NM.DEEP,
              letterSpacing: '0.02em',
            }}
          >
            {expanded
              ? 'Zobraziť menej'
              : `Zobraziť viac (${rewards.length - REWARDS_PREVIEW_COUNT})`}
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke={NM.DEEP}
              strokeWidth="2"
              strokeLinecap="round"
              style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms' }}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* How to earn points — moved from /body */}
      <div style={{ margin: '32px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 12 }}>Ako zarobiť body</Eye>
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
          {EARN_RULES.map((r, i) => (
            <div
              key={r.a}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 18px',
                alignItems: 'center',
                borderBottom: i < EARN_RULES.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
              }}
            >
              <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 400 }}>{r.a}</div>
              <div style={{ fontFamily: NM.SERIF, fontSize: 15, color: NM.GOLD, fontWeight: 500, letterSpacing: '-0.005em' }}>{r.p}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/body/odznaky')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            marginTop: 14,
            fontFamily: NM.SANS,
            fontSize: 12,
            color: NM.GOLD,
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          Pozri odznaky a hodnosti →
        </button>
      </div>

      {/* ── Modal sheet ───────────────────────────────────────────── */}
      {modal.type !== 'idle' && (
        <div
          onClick={() => modal.type !== 'loading' && setModal({ type: 'idle' })}
          style={{ position: 'fixed', inset: 0, background: 'rgba(42,26,20,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', background: '#FDFAF7', borderRadius: '24px 24px 0 0', padding: '28px 24px 40px', boxShadow: '0 -8px 40px rgba(42,26,20,0.18)' }}
          >
            {modal.type === 'confirm' && (
              <>
                <div style={{ fontFamily: NM.SERIF, fontSize: 22, color: NM.DEEP, fontWeight: 500, marginBottom: 8 }}>{modal.reward.name}</div>
                <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, lineHeight: 1.5, marginBottom: 20 }}>{modal.reward.description}</div>
                <div style={{ padding: '12px 16px', background: '#fff', borderRadius: 12, border: `1px solid ${NM.HAIR}`, display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <span style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED }}>Cena</span>
                  <span style={{ fontFamily: NM.SERIF, fontSize: 16, color: NM.GOLD, fontWeight: 500 }}>{modal.reward.point_cost} bodov</span>
                </div>
                <button
                  onClick={() => onRedeem(modal.reward)}
                  style={{ all: 'unset', cursor: 'pointer', width: '100%', textAlign: 'center', padding: '14px 0', background: NM.DEEP, color: '#fff', borderRadius: 999, fontFamily: NM.SANS, fontSize: 14, fontWeight: 500, boxSizing: 'border-box', display: 'block' }}
                >
                  Potvrdiť výmenu
                </button>
                <button
                  onClick={() => setModal({ type: 'idle' })}
                  style={{ all: 'unset', cursor: 'pointer', width: '100%', textAlign: 'center', marginTop: 12, fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, display: 'block' }}
                >
                  Zrušiť
                </button>
              </>
            )}

            {modal.type === 'loading' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 14, color: NM.MUTED }}>Spracovávam…</div>
              </div>
            )}

            {modal.type === 'success' && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 26, color: NM.TERRA, fontWeight: 500, marginBottom: 6 }}>Hotovo!</div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, lineHeight: 1.5 }}>{modal.reward.name}</div>
                </div>

                {modal.isStripe ? (
                  <div style={{ padding: '16px', background: `${NM.GOLD}12`, borderRadius: 14, border: `1px solid ${NM.GOLD}30`, marginBottom: 20, textAlign: 'center' }}>
                    <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.GOLD, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Zľava aplikovaná</div>
                    <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, lineHeight: 1.5 }}>Zľava bola automaticky aplikovaná na tvoje predplatné. Uvidíš ju na najbližšej platbe.</div>
                  </div>
                ) : (
                  <div style={{ padding: '16px', background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, marginBottom: 20, textAlign: 'center' }}>
                    <div style={{ fontFamily: NM.SANS, fontSize: 10, color: NM.EYEBROW, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>Tvoj kód</div>
                    <div style={{ fontFamily: NM.SERIF, fontSize: 24, color: NM.DEEP, fontWeight: 600, letterSpacing: '0.08em' }}>{modal.code ?? '—'}</div>
                    <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED, marginTop: 8 }}>Platnosť 7 dní · jednorazové použitie</div>
                  </div>
                )}

                <button
                  onClick={() => setModal({ type: 'idle' })}
                  style={{ all: 'unset', cursor: 'pointer', width: '100%', textAlign: 'center', padding: '14px 0', background: NM.DEEP, color: '#fff', borderRadius: 999, fontFamily: NM.SANS, fontSize: 14, fontWeight: 500, boxSizing: 'border-box', display: 'block' }}
                >
                  Zavrieť
                </button>
              </>
            )}

            {modal.type === 'error' && (
              <>
                <div style={{ fontFamily: NM.SERIF, fontSize: 20, color: NM.DEEP, fontWeight: 500, marginBottom: 10 }}>Ups</div>
                <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, marginBottom: 24, lineHeight: 1.5 }}>{modal.message}</div>
                <button
                  onClick={() => setModal({ type: 'idle' })}
                  style={{ all: 'unset', cursor: 'pointer', width: '100%', textAlign: 'center', padding: '14px 0', background: NM.DEEP, color: '#fff', borderRadius: 999, fontFamily: NM.SANS, fontSize: 14, fontWeight: 500, boxSizing: 'border-box', display: 'block' }}
                >
                  Zavrieť
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Page>
  );
}
