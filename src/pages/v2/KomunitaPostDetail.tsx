import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCommunityPosts } from '../../hooks/useCommunityPosts';
import { useCommunityReplies } from '../../hooks/useCommunityReplies';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { Page, Eye, NM } from '../../components/v2/neome';

/**
 * Komunita post detail / thread — R2
 *
 * Original post + replies list + sticky reply composer.
 *
 * Wired:
 * - Original post resolved from useCommunityPosts by :id
 * - Replies fetched from community_replies via useCommunityReplies
 * - Reply composer inserts into Supabase (or localStorage in demo mode)
 * - Like button calls useCommunityPosts.toggleLike (Supabase-backed,
 *   no-ops on seed posts)
 *
 * Hardcoded sample replies remain as a fallback for the seed feed
 * (post.id starts with 'seed-'). When the underlying post is real and
 * has zero replies, we show an empty-state instead of the sample data.
 *
 * Mounted at /komunita/:id.
 */

type AvatarTone = 'sage' | 'terra' | 'mauve' | 'gold' | 'dusty';
const TONE_COLOR: Record<AvatarTone, string> = { sage: NM.SAGE, terra: NM.TERRA, mauve: NM.MAUVE, gold: NM.GOLD, dusty: NM.DUSTY };
const TONES: AvatarTone[] = ['sage', 'terra', 'mauve', 'gold', 'dusty'];

function tone(name: string): AvatarTone {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return TONES[Math.abs(h) % TONES.length];
}

function Avatar({ size = 36, initial, tone: t }: { size?: number; initial: string; tone: AvatarTone }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 999, background: TONE_COLOR[t], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: NM.SERIF, fontWeight: 500, fontSize: size * 0.42, flexShrink: 0 }}>
      {initial}
    </div>
  );
}

function SampleBadge() {
  return (
    <span
      style={{
        fontFamily: NM.SANS,
        fontSize: 9,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        fontWeight: 500,
        color: NM.GOLD,
        background: 'rgba(184,134,74,0.10)',
        padding: '2px 8px',
        borderRadius: 999,
      }}
    >
      Ukážka
    </span>
  );
}

// Sample replies — shown only when viewing a seed post (the hardcoded
// onboarding feed). Disappear as soon as you're viewing a real user-posted
// thread.
const SAMPLE_REPLIES = [
  { who: 'Dominika T.', initial: 'D', time: 'pred 7h', txt: 'Absolútne odporúčam. Pomohol mi po dvoch pôrodoch. Začni pomaly a počúvaj svoje telo.', likes: 12 },
  { who: 'Veronika L.', initial: 'V', time: 'pred 6h', txt: 'Ja som začala 6 mesiacov po pôrode. Veľká zmena — core strength sa výrazne zlepšil.', likes: 8 },
  { who: 'Mirka S.', initial: 'M', time: 'pred 5h', txt: 'Ako dlho po pôrode môžem začať? Mám 3-mesačné bábätko.', likes: 3, replyTo: 'Dominika T.' },
];

function LikeButton({ postId, count, liked, onToggle }: { postId: string; count: number; liked: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={liked ? 'Odlajkovať' : 'Lajkovať'}
      style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
    >
      <svg width="16" height="16" viewBox="0 0 17 17" fill={liked ? NM.MAUVE : 'none'}>
        <path d="M8.5 14.5s-5.5-3.5-5.5-8a3 3 0 015.5-1.5 3 3 0 015.5 1.5c0 4.5-5.5 8-5.5 8z" stroke={liked ? NM.MAUVE : NM.MUTED} strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: NM.SANS, fontSize: 12, color: liked ? NM.MAUVE : NM.MUTED }}>{count}</span>
    </button>
  );
}

export default function KomunitaPostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { posts, likedIds, toggleLike } = useCommunityPosts();
  const { replies, addReply, formatRelativeTime } = useCommunityReplies(id);
  const post = posts.find((p) => p.id === id);
  const [reply, setReply] = useState('');
  const isSamplePost = id?.startsWith('seed-') ?? false;
  const showSampleReplies = isSamplePost && replies.length === 0;
  const displayReplies = isSamplePost ? replies : replies;

  const handleSendReply = async () => {
    const trimmed = reply.trim();
    if (!trimmed) return;
    await addReply(trimmed);
    setReply('');
  };

  const handleTogglePostLike = () => {
    if (!post) return;
    toggleLike(post.id, user?.id);
  };

  return (
    <Page paddingBottom={150}>
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 18px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} aria-label="Späť" style={{ all: 'unset', cursor: 'pointer', width: 36, height: 36, borderRadius: 999, background: '#fff', border: `1px solid ${NM.HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <Eye>Vlákno</Eye>
        <button aria-label="Viac" style={{ all: 'unset', cursor: 'pointer', padding: 6 }}>
          <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
            <circle cx="2" cy="2" r="1.5" fill={NM.DEEP} />
            <circle cx="8" cy="2" r="1.5" fill={NM.DEEP} />
            <circle cx="14" cy="2" r="1.5" fill={NM.DEEP} />
          </svg>
        </button>
      </div>

      {post && (
        <div style={{ padding: '6px 18px 22px', borderBottom: `1px solid ${NM.HAIR}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <Avatar size={42} initial={post.author.charAt(0).toUpperCase()} tone={tone(post.author)} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: NM.SANS, fontSize: 14, fontWeight: 500, color: NM.DEEP }}>{post.author}</span>
                {isSamplePost && <SampleBadge />}
              </div>
              <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>{post.time}</div>
            </div>
            {post.type === 'question' && <Eye color={NM.GOLD} size={10}>Otázka</Eye>}
          </div>
          <div style={{ fontFamily: NM.SANS, fontSize: 17, fontWeight: 400, color: NM.DEEP, lineHeight: 1.5, letterSpacing: '-0.003em', marginBottom: 16 }}>{post.text}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <LikeButton
              postId={post.id}
              count={post.likes}
              liked={likedIds.has(post.id)}
              onToggle={handleTogglePostLike}
            />
            <span style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED }}>{post.comments} odpovedí</span>
          </div>
        </div>
      )}

      <div style={{ padding: '18px 18px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Eye>
          Odpovede · {showSampleReplies ? SAMPLE_REPLIES.length : replies.length}
        </Eye>
        {showSampleReplies && <SampleBadge />}
      </div>

      {/* Real replies (from Supabase or demo localStorage) */}
      {displayReplies.map((r, i) => (
        <div
          key={r.id}
          style={{
            padding: '14px 18px',
            borderBottom: i < displayReplies.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Avatar size={30} initial={r.author_name.charAt(0).toUpperCase()} tone={tone(r.author_name)} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: NM.SANS, fontSize: 12, fontWeight: 500, color: NM.DEEP }}>{r.author_name}</span>
                <span style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>· {formatRelativeTime(r.created_at)}</span>
              </div>
              <div style={{ fontFamily: NM.SANS, fontSize: 13.5, fontWeight: 300, color: NM.DEEP, lineHeight: 1.55 }}>{r.content}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Sample replies — visual placeholders, only shown on seed posts with no real replies */}
      {showSampleReplies && SAMPLE_REPLIES.map((r, i) => (
        <div
          key={r.who}
          style={{
            padding: r.replyTo ? '14px 18px 14px 58px' : '14px 18px',
            borderBottom: i < SAMPLE_REPLIES.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
            opacity: 0.85,
          }}
        >
          {r.replyTo && (
            <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, marginBottom: 8 }}>
              Odpoveď pre {r.replyTo}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Avatar size={30} initial={r.initial} tone={tone(r.who)} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: NM.SANS, fontSize: 12, fontWeight: 500, color: NM.DEEP }}>{r.who}</span>
                <span style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>· {r.time}</span>
              </div>
              <div style={{ fontFamily: NM.SANS, fontSize: 13.5, fontWeight: 300, color: NM.DEEP, lineHeight: 1.55 }}>{r.txt}</div>
            </div>
          </div>
        </div>
      ))}

      {/* Empty state — real post, no replies yet */}
      {!showSampleReplies && replies.length === 0 && post && (
        <div style={{ padding: '32px 18px', textAlign: 'center' }}>
          <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.TERTIARY }}>
            Buď prvá, ktorá odpovie ↓
          </div>
        </div>
      )}

      {/* Sticky reply composer — sits above the BottomNav (~64px) */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))',
          padding: '10px 18px 10px',
          background: 'rgba(248,245,240,0.96)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${NM.HAIR}`,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px 10px 14px', background: '#fff', border: `1px solid ${NM.HAIR_2}`, borderRadius: 999 }}>
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendReply(); }}
            placeholder="Napíš odpoveď…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: NM.SANS,
              fontSize: 13,
              color: NM.DEEP,
            }}
          />
          <button
            aria-label="Odoslať"
            onClick={handleSendReply}
            disabled={!reply.trim()}
            style={{
              all: 'unset',
              cursor: reply.trim() ? 'pointer' : 'not-allowed',
              width: 32,
              height: 32,
              borderRadius: 999,
              background: reply.trim() ? NM.TERRA : NM.MUTED,
              opacity: reply.trim() ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L12 7 2 2v4l7 1-7 1v4z" fill="#fff" />
            </svg>
          </button>
        </div>
      </div>
    </Page>
  );
}
