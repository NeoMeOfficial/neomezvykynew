import { useNavigate } from 'react-router-dom';
import { useCommunityPosts } from '../../hooks/useCommunityPosts';
import { Page, Eye, Ser, Body, NM } from '../../components/v2/neome';

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

function FeedPost({ post, onToggleLike }: { post: DisplayPost; onToggleLike?: (id: string) => void }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/komunita/${post.id}`)}
      style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%', padding: '6px 24px 22px', borderBottom: `1px solid ${NM.HAIR}` }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <Avatar size={36} initial={post.initial} tone={post.tone} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, color: NM.DEEP }}>{post.who}</div>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="17" height="17" viewBox="0 0 17 17" fill={post.liked ? NM.TERRA : 'none'}>
            <path d="M8.5 14.5s-5.5-3.5-5.5-8a3 3 0 015.5-1.5 3 3 0 015.5 1.5c0 4.5-5.5 8-5.5 8z" stroke={post.liked ? NM.TERRA : NM.MUTED} strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: NM.SANS, fontSize: 12, color: post.liked ? NM.TERRA : NM.MUTED }}>{post.likes}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
            <path d="M3 7a4 4 0 014-4h3a4 4 0 014 4v2a4 4 0 01-4 4H7l-3 2v-2a4 4 0 01-1-4V7z" stroke={NM.MUTED} strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED }}>{post.comments}</span>
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: NM.SANS, fontSize: 11, color: NM.SAGE, fontWeight: 500, letterSpacing: '0.02em' }}>Sledovať</div>
      </div>
    </button>
  );
}

export default function Komunita() {
  const navigate = useNavigate();
  const { posts, likedIds } = useCommunityPosts();

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

  // "Najviac rezonovalo dnes" — top 2 by likes
  const resonated = [...display].sort((a, b) => b.likes - a.likes).slice(0, 2);
  const feed = display;

  return (
    <Page>
      <div style={{ padding: '60px 24px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
        <Body style={{ maxWidth: 310 }}>Zdieľaj, pýtaj sa, vypočuj. Ticho aj smiech. Tu si doma.</Body>
      </div>

      <div style={{ padding: '0 24px 6px', display: 'flex', gap: 22, borderBottom: `1px solid ${NM.HAIR}` }}>
        {[
          { k: 'posts', label: 'Príspevky', active: true },
          { k: 'disc', label: 'Zľavy partnerov', active: false },
        ].map((t) => (
          <div
            key={t.k}
            style={{
              padding: '10px 0 14px',
              fontFamily: NM.SANS,
              fontSize: 13,
              fontWeight: t.active ? 500 : 300,
              color: t.active ? NM.DEEP : NM.TERTIARY,
              borderBottom: t.active ? `1.5px solid ${NM.DEEP}` : '1.5px solid transparent',
              marginBottom: -1,
              cursor: 'pointer',
            }}
          >
            {t.label}
          </div>
        ))}
      </div>

      <div style={{ padding: '20px 24px 18px' }}>
        <Eye style={{ marginBottom: 8 }}>Dnes v komunite</Eye>
        <div style={{ fontFamily: NM.SERIF, fontSize: 17, fontWeight: 400, color: NM.DEEP, lineHeight: 1.45, letterSpacing: '-0.005em' }}>
          47 žien cvičilo · 89 dokončilo návyk · 23 meditovalo
        </div>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        <Eye color={NM.GOLD} style={{ marginBottom: 14 }}>Najviac rezonovalo dnes</Eye>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {resonated.map((p) => (
            <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Avatar size={36} initial={p.initial} tone={p.tone} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: NM.SANS, fontSize: 12, fontWeight: 500, color: NM.DEEP }}>{p.who}</span>
                  <span style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>· {p.time}</span>
                </div>
                <div style={{ fontFamily: NM.SANS, fontSize: 13.5, fontWeight: 400, color: NM.DEEP, lineHeight: 1.55, letterSpacing: '-0.002em', marginBottom: 6 }}>{p.text}</div>
                <div style={{ display: 'flex', gap: 14, fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>
                  <span>♡ {p.likes}</span>
                  <span>{p.comments} komentárov</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 24px 26px' }}>
        <button
          onClick={() => navigate('/komunita/new')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: '100%',
            padding: '12px 14px 12px 12px',
            background: 'rgba(255,255,255,0.55)',
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

      <div style={{ padding: '0 24px 10px' }}>
        <Eye>Novinky</Eye>
      </div>

      {feed.map((p) => (
        <FeedPost key={p.id} post={p} />
      ))}
    </Page>
  );
}
