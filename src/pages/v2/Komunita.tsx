import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Flame } from 'lucide-react';
import { useCommunityPosts } from '../../hooks/useCommunityPosts';
import { useAuthContext } from '../../contexts/AuthContext';
import { usePointsLedger } from '../../hooks/usePointsLedger';
import { Page, Eye, Ser, Body, NM } from '../../components/v2/neome';
import { getShieldTier, getShieldInfo, SHIELD_TIERS, DAILY_COMMUNITY_LIKE_CAP } from '../../data/achievements';

/**
 * Komunita — R2 feed
 *
 * Editorial intro, "Dnes v komunite" stats line, "Najviac rezonovalo
 * dnes" highlights (top 2 by likes), collapsed composer pill, latest
 * posts feed.
 *
 * Wired:
 * - useCommunityPosts → posts list, likedIds, toggleLike via Supabase
 *   community_posts table (falls back to SEED_POSTS when Supabase
 *   isn't configured)
 *
 * FEATURE-NEEDED-KOMUNITA-RANKING: server-side aggregation for
 * "Najviac rezonovalo dnes" — currently sorts client-side by likes,
 * which works for small feeds but won't scale.
 * FEATURE-NEEDED-KOMUNITA-ATTACHMENTS: post photos (CommunityPost
 * has no photo field; the design shows photo posts. Photos render
 * only on canonical seed entries via avatar-tone matching).
 * FEATURE-NEEDED-KOMUNITA-FOLLOW: per-author follow/unfollow with
 * indicator pill (currently every post shows "Sledovať" link as a
 * static affordance).
 *
 * Old version: Komunita.old.tsx.
 */

type AvatarTone = 'sage' | 'terra' | 'mauve' | 'gold' | 'dusty';

const TONE_COLOR: Record<AvatarTone, string> = {
  sage: NM.SAGE,
  terra: NM.TERRA,
  mauve: NM.MAUVE,
  gold: NM.GOLD,
  dusty: NM.DUSTY,
};

const TONES: AvatarTone[] = ['sage', 'terra', 'mauve', 'gold', 'dusty'];

// Stable hash → tone mapping per author so the same person always gets
// the same colored avatar.
function toneForAuthor(name: string): AvatarTone {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return TONES[Math.abs(h) % TONES.length];
}

// Author photo override — seed posts have curated photos in the design.
// Otherwise, fall back to no photo (avatar-only).
const SEED_PHOTOS: Record<string, string> = {
  'seed-1': 'testimonial-workout.jpg',
  'seed-3': 'testimonial-recipe.jpg',
};

function Avatar({ size = 36, initial, tone }: { size?: number; initial: string; tone: AvatarTone }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: TONE_COLOR[tone],
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: NM.SERIF,
        fontWeight: 500,
        fontSize: size * 0.42,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}

// Deterministic shield tier for seed posts — gives each author a stable shield
// based on their name hash so the UI always looks populated.
function shieldForAuthor(name: string): { tier: ReturnType<typeof getShieldTier>; active: boolean } {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  const idx = Math.abs(h) % (SHIELD_TIERS.length + 2); // +2 so ~25% have no shield
  const tier = idx < SHIELD_TIERS.length ? SHIELD_TIERS[idx].slug : null;
  const active = Math.abs(h) % 3 !== 0; // ~67% are recently active
  return { tier, active };
}

interface DisplayPost {
  id: string;
  who: string;
  initial: string;
  tone: AvatarTone;
  time: string;
  text: string;
  photo?: string;
  likes: number;
  comments: number;
  liked?: boolean;
  isQuestion?: boolean;
}

function FeedPost({ post, followedIds, onToggleFollow, onToggleLike }: { post: DisplayPost; followedIds: Set<string>; onToggleFollow: (id: string) => void; onToggleLike: (id: string) => void }) {
  const navigate = useNavigate();
  const following = followedIds.has(post.id);
  return (
    <div
      onClick={() => navigate(`/komunita/${post.id}`)}
      style={{ cursor: 'pointer', display: 'block', width: '100%', boxSizing: 'border-box', padding: '6px 24px 22px', borderBottom: `1px solid ${NM.HAIR}` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <Avatar size={36} initial={post.initial} tone={post.tone} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, color: NM.DEEP }}>{post.who}</span>
            {(() => {
              const { tier, active } = shieldForAuthor(post.who);
              const info = getShieldInfo(tier);
              if (!info) return null;
              return (
                <span style={{ display: 'flex', alignItems: 'center', gap: 2 }} title={info.label}>
                  <Shield size={11} color={info.color} strokeWidth={2} fill={info.color} style={{ opacity: 0.9 }} />
                  {active && <Flame size={10} color={NM.TERRA} strokeWidth={2} fill={NM.TERRA} style={{ opacity: 0.85 }} />}
                </span>
              );
            })()}
            {post.id.startsWith('seed-') && (
              <span
                style={{
                  fontFamily: NM.SANS,
                  fontSize: 9,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: NM.GOLD,
                  background: 'rgba(184,134,74,0.10)',
                  padding: '2px 7px',
                  borderRadius: 999,
                  marginLeft: 4,
                }}
              >
                Ukážka
              </span>
            )}
          </div>
          <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>{post.time}</div>
        </div>
        {post.isQuestion && <Eye color={NM.GOLD} size={10}>Otázka</Eye>}
      </div>
      <div style={{ fontFamily: NM.SANS, fontSize: 14.5, fontWeight: 400, color: NM.DEEP, lineHeight: 1.55, letterSpacing: '-0.002em', marginBottom: 14 }}>{post.text}</div>
      {post.photo && (
        <div
          style={{
            width: '100%',
            aspectRatio: '4/3',
            borderRadius: 14,
            backgroundImage: `url(/images/r9/${post.photo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: 14,
          }}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleLike(post.id); }}
          style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          aria-label={post.liked ? 'Odlajkovať' : 'Lajkovať'}
        >
          <svg width="16" height="16" viewBox="0 0 17 17" fill={post.liked ? NM.TERRA : 'none'}>
            <path d="M8.5 14.5s-5.5-3.5-5.5-8a3 3 0 015.5-1.5 3 3 0 015.5 1.5c0 4.5-5.5 8-5.5 8z" stroke={post.liked ? NM.TERRA : NM.MUTED} strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: NM.SANS, fontSize: 12, color: post.liked ? NM.TERRA : NM.MUTED }}>{post.likes}</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.MUTED} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
          <span style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED }}>5</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="16" viewBox="0 0 17 17" fill="none">
            <path d="M3 7a4 4 0 014-4h3a4 4 0 014 4v2a4 4 0 01-4 4H7l-3 2v-2a4 4 0 01-1-4V7z" stroke={NM.MUTED} strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED }}>{post.comments}</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFollow(post.id); }}
          style={{ all: 'unset', cursor: 'pointer', marginLeft: 'auto', fontFamily: NM.SANS, fontSize: 11, color: following ? NM.TERRA : NM.SAGE, fontWeight: 500, letterSpacing: '0.02em', flexShrink: 0 }}
        >
          {following ? 'Sledujem ✓' : 'Sledovať'}
        </button>
      </div>
    </div>
  );
}

const FOLLOW_KEY = 'komunita_followed_posts';

function loadFollowed(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FOLLOW_KEY) ?? '[]')); }
  catch { return new Set(); }
}

function communityLikePtsToday(userId: string): number {
  const key = `community_like_pts_${userId}_${new Date().toISOString().slice(0, 10)}`;
  return parseInt(localStorage.getItem(key) ?? '0', 10);
}

function incrementCommunityLikePts(userId: string): void {
  const key = `community_like_pts_${userId}_${new Date().toISOString().slice(0, 10)}`;
  const current = parseInt(localStorage.getItem(key) ?? '0', 10);
  localStorage.setItem(key, String(current + 1));
}

export default function Komunita() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { addEntry } = usePointsLedger();
  const { posts, likedIds, toggleLike } = useCommunityPosts();
  const [followedIds, setFollowedIds] = useState<Set<string>>(loadFollowed);
  const [activeTab, setActiveTab] = useState<'posts' | 'following' | 'disc'>('posts');
  // Sub-tab within the "Nové príspevky" feed: all, only questions, or
  // only posts. Lets users find Q&A quickly without scrolling.
  const [feedType, setFeedType] = useState<'all' | 'questions' | 'posts'>('all');

  const handleToggleLike = (postId: string) => {
    const wasLiked = likedIds.has(postId);
    toggleLike(postId, user?.id);
    // Award 1 pt only when liking (not unliking), subject to 5pt daily sub-cap
    if (!wasLiked && user?.id) {
      const todayPts = communityLikePtsToday(user.id);
      if (todayPts < DAILY_COMMUNITY_LIKE_CAP) {
        const today = new Date().toISOString().slice(0, 10);
        addEntry('community_like', 1, `like_${postId}_${today}`, 'community');
        incrementCommunityLikePts(user.id);
      }
    }
  };

  const toggleFollow = (id: string) => {
    setFollowedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(FOLLOW_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  // Map raw posts → display posts (assign tone + photo)
  const display: DisplayPost[] = posts.map((p) => ({
    id: p.id,
    who: p.author,
    initial: p.author.charAt(0).toUpperCase(),
    tone: toneForAuthor(p.author),
    time: p.time,
    text: p.text,
    photo: SEED_PHOTOS[p.id],
    likes: p.likes,
    comments: p.comments,
    liked: likedIds.has(p.id),
    isQuestion: p.type === 'question',
  }));

  // Featured post — the single most-liked post, shown as a hero card
  // above the compose section. Falls back to null if no posts exist.
  // TODO: when an explicit `pinned` flag exists on community_posts,
  // prefer the pinned one over top-liked.
  const featured = [...display].sort((a, b) => b.likes - a.likes)[0] ?? null;
  // The main feed excludes the featured post so it isn't shown twice.
  const baseFeed = activeTab === 'following'
    ? display.filter((p) => followedIds.has(p.id))
    : display.filter((p) => p.id !== featured?.id);
  const feed = feedType === 'all'
    ? baseFeed
    : feedType === 'questions'
      ? baseFeed.filter((p) => p.isQuestion)
      : baseFeed.filter((p) => !p.isQuestion);

  return (
    <Page>
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 16px) 18px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, color: NM.DEEP }}>Komunita</div>
        <button aria-label="Profil" style={{ all: 'unset', cursor: 'pointer', padding: 6 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5a2 2 0 11-4 0 2 2 0 014 0zM17 16c0-2.8-3.1-5-7-5s-7 2.2-7 5" stroke={NM.DEEP} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div style={{ padding: '6px 24px 22px' }}>
        <Eye color={NM.SAGE} style={{ marginBottom: 10 }}>Priestor pre ženy</Eye>
        <Ser size={32} style={{ lineHeight: 1.04, marginBottom: 12 }}>
          2 400 žien.
          <br />
          Jedna komunita.
        </Ser>
        <Body style={{ maxWidth: 310 }}>Tvoj priestor. Zdieľaj, inšpiruj, buď vypočutá.</Body>
      </div>

      <div style={{ padding: '0 24px 6px', display: 'flex', gap: 22, borderBottom: `1px solid ${NM.HAIR}` }}>
        {([
          { k: 'posts', label: 'Príspevky' },
          { k: 'following', label: 'Sledujem' },
          { k: 'disc', label: 'Zľavy partnerov' },
        ] as const).map((t) => {
          const active = activeTab === t.k;
          return (
            <button
              key={t.k}
              onClick={() => setActiveTab(t.k)}
              style={{
                all: 'unset',
                padding: '10px 0 14px',
                fontFamily: NM.SANS,
                fontSize: 13,
                fontWeight: active ? 500 : 300,
                color: active ? NM.DEEP : NM.TERTIARY,
                borderBottom: active ? `1.5px solid ${NM.DEEP}` : '1.5px solid transparent',
                marginBottom: -1,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'posts' && (
        <div style={{ padding: '20px 24px 18px' }}>
          <Eye style={{ marginBottom: 8 }}>Dnes v komunite</Eye>
          <div style={{ fontFamily: NM.SERIF, fontSize: 17, fontWeight: 400, color: NM.DEEP, lineHeight: 1.45, letterSpacing: '-0.005em' }}>
            {(() => {
              // Pseudo-dynamic counters — deterministic per day, with a floor so
              // the room never feels empty. Stable across all users on a given
              // day. Will be replaced by real aggregate stats from points_ledger
              // once volume justifies it (TODO: KOMUNITA-LIVE-STATS).
              const today = new Date();
              const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
              const rand = (offset: number, min: number, max: number) => {
                const x = Math.sin(seed + offset) * 10000;
                const frac = x - Math.floor(x);
                return Math.floor(min + frac * (max - min + 1));
              };
              const exercised = rand(1, 40, 110);
              const habits    = rand(2, 70, 180);
              const meditated = rand(3, 20, 60);
              return `${exercised} žien cvičilo · ${habits} dokončilo návyk · ${meditated} meditovalo`;
            })()}
          </div>
        </div>
      )}

      {/* ─── Section 1 · Featured post ─────────────────────────────
          One hero card highlighting the most-resonant post (or, once
          we have a pinned flag, the post Gabi has pinned). Gold accent
          + slightly larger so it reads as the room's "centre". */}
      {activeTab === 'posts' && featured && (
        <div style={{ padding: '4px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Eye color={NM.GOLD}>Najviac rezonuje</Eye>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: 999,
                background: `${NM.GOLD}22`,
                fontFamily: NM.SANS,
                fontSize: 9.5,
                color: NM.GOLD,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase' as const,
              }}
            >
              Vybrané
            </span>
          </div>
          <button
            onClick={() => navigate(`/komunita/${featured.id}`)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
              boxSizing: 'border-box',
              width: '100%',
              padding: '18px 18px',
              background: '#fff',
              borderRadius: 18,
              border: `1.5px solid ${NM.GOLD}`,
              boxShadow: `0 10px 24px rgba(184,150,90,0.18)`,
            }}
          >
            <Avatar size={42} initial={featured.initial} tone={featured.tone} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontFamily: NM.SANS, fontSize: 12.5, fontWeight: 500, color: NM.DEEP }}>{featured.who}</span>
                <span style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>· {featured.time}</span>
                {featured.isQuestion && (
                  <span style={{ marginLeft: 'auto', padding: '2px 7px', borderRadius: 999, background: `${NM.SAGE}24`, fontFamily: NM.SANS, fontSize: 9.5, color: NM.SAGE, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>
                    Otázka
                  </span>
                )}
              </div>
              <div style={{ fontFamily: NM.SERIF, fontSize: 16, fontWeight: 500, color: NM.DEEP, lineHeight: 1.45, letterSpacing: '-0.005em', marginBottom: 10 }}>
                {featured.text}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="13" height="13" viewBox="0 0 17 17" fill="none">
                    <path d="M8.5 14.5s-5.5-3.5-5.5-8a3 3 0 015.5-1.5 3 3 0 015.5 1.5c0 4.5-5.5 8-5.5 8z" stroke={NM.MUTED} strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>{featured.likes}</span>
                </div>
                <span style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>{featured.comments} odpovedí</span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* ─── Section 2 · Compose ──────────────────────────────────── */}
      {activeTab === 'posts' && (
        <div style={{ padding: '0 24px 26px' }}>
          <Eye color={NM.TERRA} style={{ marginBottom: 12 }}>Zdieľaj svoj príbeh</Eye>
          <button
            onClick={() => navigate('/komunita/new')}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '14px 14px 14px 12px',
              background: '#fff',
              border: `1px solid ${NM.HAIR_2}`,
              borderRadius: 999,
              boxSizing: 'border-box',
            }}
          >
            <Avatar size={32} initial="K" tone="terra" />
            <div style={{ flex: 1, fontFamily: NM.SANS, fontSize: 13, color: NM.TERTIARY, textAlign: 'left' }}>Napíš niečo, spýtaj sa…</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 999, background: NM.DEEP }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 3v8M3 7h8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* ─── Section 3 · New posts feed + type sub-tabs ──────────── */}
      {activeTab === 'posts' && (
        <div style={{ padding: '0 24px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <Eye>Nové príspevky</Eye>
          </div>
          <div style={{ display: 'flex', gap: 6, padding: 4, background: 'rgba(255,255,255,0.55)', border: `1px solid ${NM.HAIR}`, borderRadius: 999 }}>
            {([
              { k: 'all',       label: 'Všetko' },
              { k: 'posts',     label: 'Príspevky' },
              { k: 'questions', label: 'Otázky' },
            ] as const).map((t) => {
              const active = feedType === t.k;
              return (
                <button
                  key={t.k}
                  onClick={() => setFeedType(t.k)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px 0',
                    borderRadius: 999,
                    background: active ? NM.DEEP : 'transparent',
                    color: active ? '#fff' : NM.DEEP,
                    fontFamily: NM.SANS,
                    fontSize: 12,
                    fontWeight: 500,
                    transition: 'all .15s',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'following' && feed.length === 0 && (
        <div style={{ padding: '40px 24px 32px', textAlign: 'center' }}>
          <Body style={{ color: NM.TERTIARY, marginBottom: 6 }}>Zatiaľ nesleduješ žiadne príspevky.</Body>
          <Body style={{ color: NM.TERTIARY, fontSize: 12 }}>Označ srdiečkom na záložke <strong style={{ color: NM.DEEP }}>Príspevky</strong> tie, ktoré ťa zaujímajú.</Body>
        </div>
      )}

      {activeTab === 'disc' && (
        <div style={{ padding: '40px 24px 32px', textAlign: 'center' }}>
          <Body style={{ color: NM.TERTIARY }}>Zľavy partnerov pripravujeme — pozri sa neskôr.</Body>
        </div>
      )}

      {activeTab !== 'disc' && feed.map((p) => (
        <FeedPost key={p.id} post={p} followedIds={followedIds} onToggleFollow={toggleFollow} onToggleLike={handleToggleLike} />
      ))}
    </Page>
  );
}
