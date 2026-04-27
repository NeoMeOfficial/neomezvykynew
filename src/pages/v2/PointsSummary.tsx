import { useNavigate } from 'react-router-dom';
import { useReferral } from '../../hooks/useReferral';
import { Page, BackHeader, Eye, NM } from '../../components/v2/neome';

/**
 * Points summary — R10
 *
 * Big balance hero, next-milestone progress card, badges row,
 * 'how to earn' table, recent activity history.
 *
 * Wired:
 * - Balance from useReferral.credits.total_credits (or stats.availableCredits)
 *
 * FEATURE-NEEDED-POINTS-LEDGER: dedicated points_ledger table
 * tracking every credit event (post / comment / heart / program /
 * journal / redemption). Currently only referral credits exist.
 * FEATURE-NEEDED-POINTS-MILESTONE: server-side rule engine for
 * 'next reward' threshold lookup.
 * FEATURE-NEEDED-POINTS-BADGES: badge issuance service tied to
 * milestones (first post, week streak, first month, 50 comments,
 * year anniversary). Currently 5 hardcoded states.
 *
 * Mounted at /body.
 */

const BADGES = [
  { id: 'first-post', t: 'Prvý príspevok', c: NM.TERRA, on: true },
  { id: 'week-streak', t: 'Týždeň v rade', c: NM.SAGE, on: true },
  { id: 'first-month', t: 'Prvý mesiac', c: NM.DUSTY, on: true },
  { id: '50-comments', t: '50 komentárov', c: NM.MAUVE, on: false },
  { id: 'year', t: 'Rok s NeoMe', c: NM.GOLD, on: false },
];

const EARN_RULES = [
  { a: 'Príspevok v komunite', p: '+10' },
  { a: 'Komentár', p: '+5' },
  { a: 'Prejavenie srdcom', p: '+2' },
  { a: 'Dokončený program', p: '+50' },
  { a: 'Denný zápis v denníku', p: '+3' },
];

// FEATURE-NEEDED-POINTS-LEDGER: replace with real ledger entries
const RECENT_ACTIVITY = [
  { a: 'Príspevok · „Postpartum návrat"', d: 'dnes', p: '+10', positive: true },
  { a: 'Komentár · Ročný thread', d: 'včera', p: '+5', positive: true },
  { a: 'Dokončený týždeň 3', d: '2 dni', p: '+12', positive: true },
  { a: 'Zľava získaná · Partner', d: 'min. týždeň', p: '−100', positive: false },
];

const NEXT_MILESTONE = { name: '20% zľava na jedálniček', cost: 500 };

export default function PointsSummary() {
  const navigate = useNavigate();
  const { credits } = useReferral();
  const balance = credits?.total_credits ?? 0;
  const remaining = Math.max(0, NEXT_MILESTONE.cost - balance);
  const pct = Math.min(100, Math.round((balance / NEXT_MILESTONE.cost) * 100));

  return (
    <Page>
      <BackHeader title="Moje body" showSearch={false} />

      <div style={{ padding: '0 18px', textAlign: 'center' }}>
        <Eye color={NM.GOLD}>Aktuálny zostatok</Eye>
        <div style={{ fontFamily: NM.SERIF, fontSize: 72, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 10 }}>{balance}</div>
        <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 4, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500 }}>
          Bodov · {BADGES.filter((b) => b.on).length} odznaky
        </div>
      </div>

      <div style={{ margin: '26px 18px 0', background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Eye size={10}>Nasledujúca odmena</Eye>
          <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED, fontWeight: 400 }}>{remaining} bodov</div>
        </div>
        <div style={{ fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, color: NM.DEEP, marginTop: 8, letterSpacing: '-0.005em' }}>{NEXT_MILESTONE.name}</div>
        <div style={{ marginTop: 12, height: 5, borderRadius: 999, background: NM.HAIR, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: NM.GOLD }} />
        </div>
      </div>

      <div style={{ margin: '24px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 12 }}>Odznaky</Eye>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
          {BADGES.map((b) => (
            <div key={b.id} style={{ flexShrink: 0, width: 92, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 999, margin: '0 auto', background: b.on ? b.c : NM.CREAM_2 ?? '#F1ECE3', border: `1px solid ${b.on ? 'transparent' : NM.HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: b.on ? 1 : 0.55 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={b.on ? '#fff' : NM.TERTIARY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.4 5 5.6.8-4 4 1 5.6L12 14.8 6.8 17.4l1-5.6-4-4 5.6-.8L12 2z" />
                </svg>
              </div>
              <div style={{ marginTop: 8, fontFamily: NM.SANS, fontSize: 10.5, color: b.on ? NM.DEEP : NM.TERTIARY, fontWeight: 500 }}>{b.t}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: '26px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 12 }}>Ako zarobiť body</Eye>
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
          {EARN_RULES.map((r, i) => (
            <div key={r.a} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', alignItems: 'center', borderBottom: i < EARN_RULES.length - 1 ? `1px solid ${NM.HAIR}` : 'none' }}>
              <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 400 }}>{r.a}</div>
              <div style={{ fontFamily: NM.SERIF, fontSize: 15, color: NM.GOLD, fontWeight: 500, letterSpacing: '-0.005em' }}>{r.p}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: '26px 18px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <Eye size={10}>Posledná aktivita</Eye>
          <button onClick={() => navigate('/body/odmeny')} style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 11, color: NM.TERRA, fontWeight: 500 }}>
            Vymeniť ›
          </button>
        </div>
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
          {RECENT_ACTIVITY.map((r, i) => (
            <div key={r.a} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', alignItems: 'center', borderBottom: i < RECENT_ACTIVITY.length - 1 ? `1px solid ${NM.HAIR}` : 'none' }}>
              <div>
                <div style={{ fontFamily: NM.SANS, fontSize: 12.5, color: NM.DEEP, fontWeight: 400 }}>{r.a}</div>
                <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, marginTop: 2, fontWeight: 400 }}>{r.d}</div>
              </div>
              <div style={{ fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, color: r.positive ? NM.GOLD : NM.TERTIARY }}>{r.p}</div>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}
