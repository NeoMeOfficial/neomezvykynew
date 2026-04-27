import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { usePointsLedger } from '../../hooks/usePointsLedger';
import { Page, BackHeader, Eye, Ser, NM } from '../../components/v2/neome';

/**
 * Points rewards catalog — R10
 *
 * Header w/ current balance card, list of rewards (image + cost +
 * Získať CTA or 'Ešte N bodov' state).
 *
 * Wired (F-017 / F-020):
 * - Balance from usePointsLedger
 * - Catalog from public.rewards (active only, sort_order asc); falls
 *   back to the original 5 hardcoded rows pre-migration.
 *
 * FEATURE-NEEDED-REWARDS-REDEEM (F-021): actual redemption flow that
 * debits the balance via points_ledger and calls Stripe to attach a
 * Promotion Code to the user's customer. Currently the 'Získať' CTA
 * still navigates to /profil as a placeholder.
 *
 * Mounted at /body/odmeny.
 */

interface Reward {
  slug: string;
  name: string;
  point_cost: number;
  color_token: string;
  image_key: string | null;
}

const FALLBACK: Reward[] = [
  { slug: 'plus-month',      name: 'Mesiac Plus zdarma',                point_cost: 500, color_token: 'GOLD',  image_key: 'hero-yoga.jpg' },
  { slug: 'mealplan-20',     name: '20% zľava na jedálniček',           point_cost: 250, color_token: 'SAGE',  image_key: 'section-nutrition.jpg' },
  { slug: 'plus-15',         name: '15% na ďalšiu platbu Plus',         point_cost: 150, color_token: 'TERRA', image_key: 'section-body.jpg' },
  { slug: 'partner-yoga',    name: 'Partnerská zľava · jóga štúdio',    point_cost: 100, color_token: 'DUSTY', image_key: 'lifestyle-yoga-pose.jpg' },
  { slug: 'partner-recipes', name: 'Partnerská zľava · recepty',        point_cost: 80,  color_token: 'MAUVE', image_key: 'testimonial-recipe.jpg' },
];

const NM_COLORS: Record<string, string> = {
  TERRA: NM.TERRA,
  SAGE: NM.SAGE,
  DUSTY: NM.DUSTY,
  MAUVE: NM.MAUVE,
  GOLD: NM.GOLD,
};

export default function PointsRewards() {
  const navigate = useNavigate();
  const { balance } = usePointsLedger();
  const [rewards, setRewards] = useState<Reward[]>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('rewards')
        .select('slug, name, point_cost, color_token, image_key')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      if (!cancelled && data && data.length > 0) {
        setRewards(data as Reward[]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
        {rewards.map((r) => {
          const avail = balance >= r.point_cost;
          const tone = NM_COLORS[r.color_token] ?? NM.TERRA;
          return (
            <div key={r.slug} style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: 110, backgroundImage: `url(/images/r9/${r.image_key ?? 'hero-yoga.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
              <div style={{ padding: '14px 16px', flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: tone, fontWeight: 600 }}>{r.point_cost} bodov</div>
                <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: NM.DEEP, marginTop: 5, letterSpacing: '-0.005em', lineHeight: 1.25 }}>{r.name}</div>
                <button
                  onClick={() => {
                    if (avail) {
                      // FEATURE-NEEDED-REWARDS-REDEEM
                      navigate('/profil');
                    }
                  }}
                  disabled={!avail}
                  style={{
                    all: 'unset',
                    cursor: avail ? 'pointer' : 'not-allowed',
                    marginTop: 10,
                    padding: '7px 14px',
                    background: avail ? NM.DEEP : NM.CREAM_2 ?? '#F1ECE3',
                    color: avail ? '#fff' : NM.TERTIARY,
                    borderRadius: 999,
                    fontFamily: NM.SANS,
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  {avail ? 'Získať' : `Ešte ${r.point_cost - balance} bodov`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
}
