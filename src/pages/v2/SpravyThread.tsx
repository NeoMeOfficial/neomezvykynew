import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMessages } from '../../hooks/useMessages';
import { Page, NM } from '../../components/v2/neome';

/**
 * Správy thread (with Gabi) — R10
 *
 * Header w/ avatar + name + 'Zvyčajne odpovie do 24h', auto-reply
 * badge on first admin message, message bubbles (user right, Gabi
 * left), composer at bottom.
 *
 * Wired:
 * - useMessages → real messages list, sendMessage, markRead on mount
 *
 * FEATURE-NEEDED-SPRAVY-AUTO-REPLY-BADGE: design shows 'Automatická
 * odpoveď' pill with clock icon on the first admin message of any
 * session. Currently no is_auto_reply flag on Message — visual
 * approximation: tag the very first admin message in the thread.
 *
 * Mounted at /spravy/:threadId.
 */

const SK_DAYS_GENITIVE = ['nedeľu', 'pondelok', 'utorok', 'stredu', 'štvrtok', 'piatok', 'sobotu'];

function fmtTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function fmtSeparator(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return `Dnes · ${fmtTime(iso)}`;
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Včera · ${fmtTime(iso)}`;
  return `${SK_DAYS_GENITIVE[d.getDay()]} · ${fmtTime(iso)}`;
}

export default function SpravyThread() {
  const navigate = useNavigate();
  const { threadId } = useParams<{ threadId: string }>();
  const { messages, sending, sendMessage, markRead } = useMessages();
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mark unread admin messages as read on mount
  useEffect(() => {
    messages.forEach((m) => {
      if (m.is_from_admin && !m.read_at) markRead(m.id);
    });
  }, [messages, markRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const onSend = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    try {
      await sendMessage(text);
    } catch {
      setDraft(text);
    }
  };

  // Find the first admin message ID — gets the auto-reply badge
  const firstAdminId = messages.find((m) => m.is_from_admin)?.id;

  return (
    <div style={{ background: NM.BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: NM.SANS, color: NM.DEEP }}>
      {/* Header */}
      <div
        style={{
          padding: 'calc(env(safe-area-inset-top) + 10px) 16px 14px',
          background: '#fff',
          borderBottom: `1px solid ${NM.HAIR}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <button onClick={() => navigate('/spravy')} aria-label="Späť" style={{ all: 'unset', cursor: 'pointer', width: 32, height: 32, borderRadius: 999, background: NM.CREAM_2 ?? '#F1ECE3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div style={{ width: 36, height: 36, borderRadius: 999, backgroundImage: 'url(/images/r9/founder-gabi.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderRadius: 999, background: NM.GOLD, border: '2px solid #fff' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: NM.SANS, fontSize: 13.5, color: NM.DEEP, fontWeight: 600 }}>Gabi Drobová</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, marginTop: 1, fontWeight: 400 }}>Zvyčajne odpovie do 24h</div>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 100 }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 24px', color: NM.MUTED, fontSize: 13 }}>
            Zatiaľ žiadne správy. Napíš Gabi prvú vetu nižšie.
          </div>
        ) : (
          messages.map((m, i) => {
            const showSep = i === 0 || new Date(messages[i - 1].created_at).toDateString() !== new Date(m.created_at).toDateString();
            const isAutoReply = m.is_from_admin && m.id === firstAdminId;
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {showSep && (
                  <div style={{ textAlign: 'center', fontFamily: NM.SANS, fontSize: 10, color: NM.TERTIARY, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '8px 0', fontWeight: 500 }}>
                    {fmtSeparator(m.created_at)}
                  </div>
                )}
                {m.is_from_admin ? (
                  <div style={{ maxWidth: '78%', alignSelf: 'flex-start', background: isAutoReply ? NM.CREAM_2 ?? '#F1ECE3' : '#fff', padding: '12px 14px', borderRadius: '14px 14px 14px 4px', border: `1px solid ${NM.HAIR}` }}>
                    {isAutoReply && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={NM.GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 7v5l3 2" />
                        </svg>
                        <div style={{ fontFamily: NM.SANS, fontSize: 9.5, color: NM.GOLD, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>Automatická odpoveď</div>
                      </div>
                    )}
                    <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 400, lineHeight: 1.5 }}>{m.body}</div>
                    <div style={{ fontFamily: NM.SANS, fontSize: 9, color: NM.TERTIARY, marginTop: 4, fontWeight: 400 }}>{fmtTime(m.created_at)}</div>
                  </div>
                ) : (
                  <div style={{ maxWidth: '78%', alignSelf: 'flex-end', background: NM.DEEP, color: '#fff', padding: '12px 14px', borderRadius: '14px 14px 4px 14px' }}>
                    <div style={{ fontFamily: NM.SANS, fontSize: 13, lineHeight: 1.5, fontWeight: 400 }}>{m.body}</div>
                    <div style={{ fontFamily: NM.SANS, fontSize: 9, color: 'rgba(255,255,255,0.55)', marginTop: 4, textAlign: 'right', fontWeight: 400 }}>
                      {fmtTime(m.created_at)}
                      {m.read_at && ' · prečítané'}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Composer */}
      <div
        style={{
          padding: `10px 14px calc(env(safe-area-inset-bottom) + 16px)`,
          borderTop: `1px solid ${NM.HAIR}`,
          background: '#fff',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Napíš správu…"
          style={{
            flex: 1,
            padding: '10px 14px',
            background: NM.CREAM_2 ?? '#F1ECE3',
            borderRadius: 999,
            border: 'none',
            outline: 'none',
            fontFamily: NM.SANS,
            fontSize: 13,
            color: NM.DEEP,
            fontWeight: 400,
          }}
        />
        <button
          onClick={onSend}
          disabled={sending || draft.trim().length === 0}
          aria-label="Odoslať"
          style={{
            all: 'unset',
            cursor: sending || draft.trim().length === 0 ? 'not-allowed' : 'pointer',
            width: 36,
            height: 36,
            borderRadius: 999,
            background: NM.DEEP,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            opacity: sending || draft.trim().length === 0 ? 0.5 : 1,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
      <div style={{ display: 'none' }}>{threadId}</div>
    </div>
  );
}
