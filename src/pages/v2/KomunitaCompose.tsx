import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommunityPosts } from '../../hooks/useCommunityPosts';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { Page, Eye, NM } from '../../components/v2/neome';

/**
 * Komunita composer — R2
 *
 * Mounted at /komunita/new. Top: Zatvoriť · 'Nový príspevok' ·
 * Zdieľať. Type switcher (Príspevok / Otázka), author row, large
 * sans-serif textarea, char count, bottom toolbar (image / tag /
 * link — UI affordances only).
 *
 * Wired:
 * - submitPost from useCommunityPosts
 * - User name from useSupabaseAuth
 *
 * FEATURE-NEEDED-KOMUNITA-ATTACHMENTS: photo upload + storage bucket
 * (toolbar image button is currently visual-only).
 * FEATURE-NEEDED-KOMUNITA-TAGS: hashtag/topic system.
 */

const MAX_CHARS = 500;

export default function KomunitaCompose() {
  const navigate = useNavigate();
  const { submitPost } = useCommunityPosts();
  const { user } = useSupabaseAuth();
  const [type, setType] = useState<'post' | 'question'>('post');
  const [text, setText] = useState('');

  const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };
  const author = meta.full_name?.split(' ')[0] ?? meta.name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Eva';
  const initial = author.charAt(0).toUpperCase();

  const onShare = async () => {
    if (text.trim().length === 0) return;
    try {
      await submitPost(text.trim(), type, author);
      navigate('/komunita');
    } catch {
      // FEATURE-NEEDED-KOMUNITA-ERROR-HANDLING
    }
  };

  return (
    <Page paddingBottom={40}>
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 18px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 14, color: NM.DEEP, padding: 6 }}>
          Zatvoriť
        </button>
        <div style={{ fontFamily: NM.SERIF, fontSize: 16, fontWeight: 500, color: NM.DEEP }}>Nový príspevok</div>
        <button
          onClick={onShare}
          disabled={text.trim().length === 0}
          style={{
            all: 'unset',
            cursor: text.trim().length === 0 ? 'not-allowed' : 'pointer',
            background: NM.TERRA,
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 13,
            fontWeight: 500,
            opacity: text.trim().length === 0 ? 0.5 : 1,
          }}
        >
          Zdieľať
        </button>
      </div>

      <div style={{ padding: '8px 18px 0' }}>
        <Eye style={{ marginBottom: 10 }}>Typ príspevku</Eye>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[
            { k: 'post' as const, label: 'Príspevok' },
            { k: 'question' as const, label: 'Otázka' },
          ].map((t) => {
            const active = type === t.k;
            return (
              <button
                key={t.k}
                onClick={() => setType(t.k)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '9px 18px',
                  borderRadius: 999,
                  border: `1px solid ${active ? NM.DEEP : NM.HAIR_2}`,
                  background: active ? NM.DEEP : 'transparent',
                  color: active ? '#fff' : NM.DEEP,
                  fontFamily: NM.SANS,
                  fontSize: 13,
                  fontWeight: 400,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: NM.TERRA, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: NM.SERIF, fontWeight: 500, fontSize: 16 }}>
            {initial}
          </div>
          <div>
            <div style={{ fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, color: NM.DEEP }}>{author}</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>Viditeľné pre komunitu</div>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder={type === 'question' ? 'Spýtaj sa komunity…' : 'Podeľ sa s komunitou…'}
          autoFocus
          style={{
            width: '100%',
            minHeight: 200,
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            fontFamily: NM.SANS,
            fontSize: 17,
            fontWeight: 400,
            color: NM.DEEP,
            lineHeight: 1.55,
            letterSpacing: '-0.002em',
            padding: 0,
            marginBottom: 22,
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          padding: `14px 18px calc(env(safe-area-inset-bottom) + 16px)`,
          background: 'rgba(248,245,240,0.92)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${NM.HAIR}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* FEATURE-NEEDED-KOMUNITA-ATTACHMENTS: image upload */}
        {[
          <svg key="img" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2.5" y="3.5" width="15" height="13" rx="2" stroke={NM.DEEP} strokeWidth="1.4" />
            <circle cx="7" cy="8" r="1.3" fill={NM.DEEP} />
            <path d="M3 14l4-3 4 3 6-5" stroke={NM.DEEP} strokeWidth="1.4" strokeLinejoin="round" />
          </svg>,
          <svg key="tag" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3h6l1 6-7 7-7-7 7-6z" stroke={NM.DEEP} strokeWidth="1.4" strokeLinejoin="round" />
            <circle cx="13" cy="7" r="1" fill={NM.DEEP} />
          </svg>,
          <svg key="link" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8 12l4-4m-3 7l-2 2a3 3 0 11-4-4l2-2m6-6l2-2a3 3 0 114 4l-2 2" stroke={NM.DEEP} strokeWidth="1.4" strokeLinecap="round" />
          </svg>,
        ].map((icon, i) => (
          <button key={i} aria-label={['Pridať obrázok', 'Tag', 'Odkaz'][i]} style={{ all: 'unset', cursor: 'pointer', width: 40, height: 40, borderRadius: 999, background: 'rgba(255,255,255,0.6)', border: `1px solid ${NM.HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </button>
        ))}
        <div style={{ flex: 1, textAlign: 'right', fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>
          {text.length} / {MAX_CHARS}
        </div>
      </div>
    </Page>
  );
}
