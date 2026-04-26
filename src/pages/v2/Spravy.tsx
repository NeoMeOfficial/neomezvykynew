import { useNavigate } from 'react-router-dom';
import { Page, Eye, Ser, NM } from '../../components/v2/neome';

/**
 * Správy — R10 inbox
 *
 * Pinned Gabi thread (gold star indicator), search row, threads list
 * with unread dot.
 *
 * TODO data: thread list from messaging service / Supabase. Detail
 * thread with auto-reply badge is a follow-up screen.
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

const THREADS: Thread[] = [
  { id: 'gabi', name: 'Gabi Drobová', avatar: 'founder-gabi.png', msg: 'Ahoj Sam, ako sa cítiš po prvom týždni programu?', time: '09:24', unread: true, isGabi: true },
  { id: 'lucia', name: 'Lucia K.', avatar: 'testimonial-lucia.jpg', msg: 'Tiež som začala postpartum program! Držím palce.', time: 'včera', unread: true },
  { id: 'anna', name: 'Anna M.', avatar: 'testimonial-anna.jpg', msg: 'Vďaka za tip na ten recept, vyšiel skvele.', time: 'pon', unread: false },
  { id: 'martina', name: 'Martina Š.', avatar: 'testimonial-martina.jpg', msg: 'Môžeme si dohodnúť výmenu skúseností?', time: '12. apr', unread: false },
];

export default function Spravy() {
  const navigate = useNavigate();
  return (
    <Page>
      <div style={{ padding: '56px 20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

      <div style={{ margin: '0 20px', background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
        {THREADS.map((th, i) => (
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
              borderBottom: i < THREADS.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
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
    </Page>
  );
}
