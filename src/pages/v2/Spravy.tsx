import { useNavigate } from 'react-router-dom';
import { useMessages } from '../../hooks/useMessages';
import { Page, Eye, Ser, NM } from '../../components/v2/neome';

/**
 * Správy — R10 inbox
 *
 * Pinned Gabi thread (gold star indicator), search row, threads list
 * with unread dot.
 *
 * Wired:
 * - useMessages → real Gabi thread from `messages` table (or demo
 *   localStorage when Supabase isn't configured). Shows last message
 *   body as preview, real read state, real timestamp.
 *
 * FEATURE-NEEDED-SPRAVY-FRIEND-DMS: peer-to-peer messaging between
 * users (Lucia, Anna, Martina threads in the design). Requires:
 * - friends/conversations table
 * - inbox endpoint listing all conversations
 * - composer screen for starting a new thread
 * - moderation + report flow
 * Currently the inbox only renders the Gabi thread; the design's
 * other 3 threads are static-curated examples removed in this wire.
 *
 * Old version: Spravy.old.tsx.
 */

interface Thread {
  id: string;
  name: string;
  avatar: string;
  msg: string;
  time: string;
  unread: boolean;
  isGabi?: boolean;
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'teraz';
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const d = Math.floor(hrs / 24);
  if (d === 1) return 'včera';
  if (d < 7) return `${d}d`;
  // Fall back to "DD. mmm" — Slovak short month
  const date = new Date(iso);
  const sk = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${date.getDate()}. ${sk[date.getMonth()]}`;
}

export default function Spravy() {
  const navigate = useNavigate();
  const { messages, unreadCount } = useMessages();

  const last = messages.length > 0 ? messages[messages.length - 1] : null;
  const gabiThread: Thread | null = last
    ? {
        id: 'gabi',
        name: 'Gabi Drobová',
        avatar: 'founder-gabi.png',
        msg: last.body,
        time: formatRelative(last.created_at),
        unread: unreadCount > 0,
        isGabi: true,
      }
    : null;

  const threads: Thread[] = gabiThread ? [gabiThread] : [];

  return (
    <Page>
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 18px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Eye>Správy</Eye>
        <button
          onClick={() => navigate('/spravy/new')}
          aria-label="Nová správa"
          style={{
            all: 'unset',
            cursor: 'pointer',
            width: 36,
            height: 36,
            borderRadius: 999,
            background: '#fff',
            border: `1px solid ${NM.HAIR}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z" />
          </svg>
        </button>
      </div>

      <div style={{ padding: '0 20px 10px' }}>
        <Ser size={34}>
          Tvoje
          <br />
          <em style={{ color: NM.DEEP, fontStyle: 'italic', fontWeight: 500 }}>rozhovory</em>
        </Ser>
      </div>

      <div
        style={{
          margin: '20px 20px 14px',
          padding: '11px 14px',
          background: '#fff',
          borderRadius: 999,
          border: `1px solid ${NM.HAIR}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.MUTED} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <div style={{ flex: 1, fontFamily: NM.SANS, fontSize: 12.5, color: NM.TERTIARY, fontWeight: 400 }}>Hľadaj správu alebo meno…</div>
      </div>

      {threads.length === 0 ? (
        <div style={{ margin: '0 20px', padding: '40px 24px', background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, textAlign: 'center' }}>
          <div style={{ fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, color: NM.DEEP, marginBottom: 6 }}>Zatiaľ tu nič nie je</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, lineHeight: 1.5 }}>Tvoja schránka sa otvorí, keď ti Gabi alebo komunita napíše.</div>
        </div>
      ) : (
      <div style={{ margin: '0 20px', background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
        {threads.map((th, i) => (
          <button
            key={th.id}
            onClick={() => navigate(`/spravy/${th.id}`)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              gap: 14,
              padding: '14px 16px',
              alignItems: 'center',
              borderBottom: i < threads.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 999,
                  backgroundImage: `url(/images/r9/${th.avatar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {th.isGabi && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    width: 16,
                    height: 16,
                    borderRadius: 999,
                    background: NM.GOLD,
                    border: '2px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="#fff">
                    <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7l2-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 13.5, color: NM.DEEP, fontWeight: th.unread ? 600 : 500 }}>{th.name}</div>
                <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.TERTIARY, fontWeight: 400 }}>{th.time}</div>
              </div>
              <div
                style={{
                  fontFamily: NM.SANS,
                  fontSize: 12,
                  color: th.unread ? NM.DEEP : NM.EYEBROW,
                  marginTop: 3,
                  fontWeight: th.unread ? 500 : 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {th.msg}
              </div>
            </div>
            {th.unread && <div style={{ width: 8, height: 8, borderRadius: 999, background: NM.TERRA, flexShrink: 0 }} />}
          </button>
        ))}
      </div>
      )}
    </Page>
  );
}
