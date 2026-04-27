import { useNavigate } from 'react-router-dom';
import { useReferral } from '../../hooks/useReferral';
import { Page, BackHeader, Eye, Ser, NM } from '../../components/v2/neome';

/**
 * Points rewards catalog — R10
 *
 * Header w/ current balance card, list of rewards (image + cost +
 * Získať CTA or 'Ešte N bodov' state).
 *
 * Wired:
 * - Balance from useReferral.credits.total_credits
 *
 * FEATURE-NEEDED-REWARDS-CATALOG: server-managed reward catalog
 * (admin-set thresholds + active flag + Stripe coupon integration
 * for discount rewards). Currently 5 hardcoded entries.
 * FEATURE-NEEDED-REWARDS-REDEEM: actual redemption flow that debits
 * the balance and applies the coupon. Currently 'Získať' is static.
 *
 * Mounted at /body/odmeny.
 */

interface Reward {
  id: string;
  t: string;
  cost: number;
  c: string;
  img: string;
}

const REWARDS: Reward[] = [
  { id: 'plus-month', t: 'Mesiac Plus zdarma', cost: 500, c: NM.GOLD, img: 'hero-yoga.jpg' },
  { id: 'mealplan-20', t: '20% zľava na jedálniček', cost: 250, c: NM.SAGE, img: 'section-nutrition.jpg' },
  { id: 'plus-15', t: '15% na ďalšiu platbu Plus', cost: 150, c: NM.TERRA, img: 'section-body.jpg' },
  { id: 'partner-yoga', t: 'Partnerská zľava · jóga štúdio', cost: 100, c: NM.DUSTY, img: 'lifestyle-yoga-pose.jpg' },
  { id: 'partner-recipes', t: 'Partnerská zľava · recepty', cost: 80, c: NM.MAUVE, img: 'testimonial-recipe.jpg' },
];

export default function PointsRewards() {
  const navigate = useNavigate();
  const { credits } = useReferral();
  const balance = credits?.total_credits ?? 0;

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
        {REWARDS.map((r) => {
          const avail = balance >= r.cost;
          return (
            <div key={r.id} style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: 110, backgroundImage: `url(/images/r9/${r.img})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
              <div style={{ padding: '14px 16px', flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: r.c, fontWeight: 600 }}>{r.cost} bodov</div>
                <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: NM.DEEP, marginTop: 5, letterSpacing: '-0.005em', lineHeight: 1.25 }}>{r.t}</div>
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
                  {avail ? 'Získať' : `Ešte ${r.cost - balance} bodov`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
}
