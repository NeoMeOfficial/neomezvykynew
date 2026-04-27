import { useNavigate } from 'react-router-dom';
import { usePointsLedger, useNextMilestone, useUserBadges } from '../../hooks/usePointsLedger';
import { Page, BackHeader, Eye, NM } from '../../components/v2/neome';

/**
 * Points summary — R10
 *
 * Big balance hero, next-milestone progress card, badges row,
 * 'how to earn' table, recent activity history.
 *
 * Wired (F-017 / F-018 / F-019):
 * - Balance + recent activity from usePointsLedger
 * - Next milestone from useNextMilestone (server-driven, fallback to local)
 * - Badges from useUserBadges (catalog + per-user earned map)
 *
 * FEATURE-NEEDED-POINTS-BADGE-ISSUANCE: server triggers/cron that
 * issue user_badges rows on milestones (first post, 7-day streak,
 * first month, 50 comments, year). Currently no auto-issuance — only
 * already-earned rows render as filled.
 *
 * Mounted at /body.
 */

const EARN_RULES = [
  { a: 'Príspevok v komunite', p: '+10' },
  { a: 'Komentár', p: '+5' },
  { a: 'Prejavenie srdcom', p: '+2' },
  { a: 'Dokončený program', p: '+50' },
  { a: 'Denný zápis v denníku', p: '+3' },
];

const ACTIVITY_LABELS: Record<string, string> = {
  workout_completed: 'Dokončené cvičenie',
  program_completed: 'Dokončený program',
  post_published: 'Príspevok v komunite',
  comment_published: 'Komentár',
  heart_received: 'Prejavenie srdcom',
  journal_entry: 'Zápis v denníku',
  referral_approved: 'Pozvaná priateľka · schválené',
  reward_redeemed: 'Vymenená odmena',
};

const NM_COLORS: Record<string, string> = {
  TERRA: NM.TERRA,
  SAGE: NM.SAGE,
  DUSTY: NM.DUSTY,
  MAUVE: NM.MAUVE,
  GOLD: NM.GOLD,
};

function relativeDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = diffMs / (1000 * 60 * 60);
  if (diffH < 1) return 'pred chvíľou';
  if (diffH < 24) return 'dnes';
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return 'včera';
  if (diffD < 7) return `${diffD} dni`;
  if (diffD < 30) return 'min. týždeň';
  return 'starší';
}

export default function PointsSummary() {
  const navigate = useNavigate();
  const { entries, balance } = usePointsLedger();
  const milestone = useNextMilestone(balance);
  const { badges } = useUserBadges();

  const earnedCount = badges.filter((b) => b.earned).length;
  const recent = entries.slice(0, 6);

  return (
    <Page>
      <BackHeader title="Moje body" showSearch={false} />

      <div style={{ padding: '0 18px', textAlign: 'center' }}>
        <Eye color={NM.GOLD}>Aktuálny zostatok</Eye>
        <div style={{ fontFamily: NM.SERIF, fontSize: 72, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 10 }}>{balance}</div>
        <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 4, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500 }}>
          Bodov · {earnedCount} {earnedCount === 1 ? 'odznak' : 'odznaky'}
        </div>
      </div>

      {milestone && (
        <div style={{ margin: '26px 18px 0', background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Eye size={10}>Nasledujúca odmena</Eye>
            <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED, fontWeight: 400 }}>{milestone.remaining} bodov</div>
          </div>
          <div style={{ fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, color: NM.DEEP, marginTop: 8, letterSpacing: '-0.005em' }}>{milestone.name}</div>
          <div style={{ marginTop: 12, height: 5, borderRadius: 999, background: NM.HAIR, overflow: 'hidden' }}>
            <div style={{ width: `${milestone.pct}%`, height: '100%', background: NM.GOLD }} />
          </div>
        </div>
      )}

      <div style={{ margin: '24px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 12 }}>Odznaky</Eye>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
          {badges.map((b) => {
            const tone = NM_COLORS[b.color_token] ?? NM.TERRA;
            return (
              <div key={b.slug} style={{ flexShrink: 0, width: 92, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 999, margin: '0 auto', background: b.earned ? tone : NM.CREAM_2 ?? '#F1ECE3', border: `1px solid ${b.earned ? 'transparent' : NM.HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: b.earned ? 1 : 0.55 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={b.earned ? '#fff' : NM.TERTIARY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 5 5.6.8-4 4 1 5.6L12 14.8 6.8 17.4l1-5.6-4-4 5.6-.8L12 2z" />
                  </svg>
                </div>
                <div style={{ marginTop: 8, fontFamily: NM.SANS, fontSize: 10.5, color: b.earned ? NM.DEEP : NM.TERTIARY, fontWeight: 500 }}>{b.name}</div>
              </div>
            );
          })}
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

      {recent.length > 0 && (
        <div style={{ margin: '26px 18px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <Eye size={10}>Posledná aktivita</Eye>
            <button onClick={() => navigate('/body/odmeny')} style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 11, color: NM.TERRA, fontWeight: 500 }}>
              Vymeniť ›
            </button>
          </div>
          <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
            {recent.map((r, i) => {
              const positive = r.points >= 0;
              const label = ACTIVITY_LABELS[r.event_type] ?? r.event_type;
              return (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 18px', alignItems: 'center', borderBottom: i < recent.length - 1 ? `1px solid ${NM.HAIR}` : 'none' }}>
                  <div>
                    <div style={{ fontFamily: NM.SANS, fontSize: 12.5, color: NM.DEEP, fontWeight: 400 }}>{label}</div>
                    <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, marginTop: 2, fontWeight: 400 }}>{relativeDate(r.created_at)}</div>
                  </div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, color: positive ? NM.GOLD : NM.TERTIARY }}>
                    {positive ? '+' : ''}{r.points}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Page>
  );
}
