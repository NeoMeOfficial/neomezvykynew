import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Page, BackHeader, Eye, Ser, NM } from '../../components/v2/neome';

/**
 * Settings hub — R10
 *
 * Top profile strip + 4 grouped sections (Účet · Predplatné ·
 * Upozornenia · Súkromie). Final 'Odhlásiť sa' link.
 *
 * Old version: SettingsHub.old.tsx.
 */

interface Item {
  key: string;
  t: string;
  d: string;
  icon: 'user' | 'key' | 'card' | 'plus' | 'bell' | 'shield' | 'trash';
  to: string;
  danger?: boolean;
  accent?: string;
}

const ICONS: Record<Item['icon'], ReactNode> = {
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0116 0" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="M10.8 12.3L21 2M18 5l3 3M15 8l3 3" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
  plus: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  bell: <path d="M18 16H6l2-2V10a4 4 0 018 0v4l2 2zM10 20a2 2 0 004 0" />,
  shield: <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13M9 7V4h6v3" />,
};

function buildGroups(email: string, isPremium: boolean) {
  return [
    {
      eye: 'Účet',
      items: [
        { key: 'profile', t: 'Upraviť profil', d: 'Meno, foto, bio', icon: 'user' as const, to: '/settings/profile' },
        { key: 'auth', t: 'E-mail a heslo', d: email, icon: 'key' as const, to: '/settings/auth' },
      ],
    },
    {
      eye: 'Predplatné',
      items: [
        { key: 'plan', t: 'Plán a platby', d: isPremium ? 'Plus · 9,99 € / mesiac' : 'Free · prejsť na Plus', icon: 'card' as const, to: '/profil/subscription', accent: NM.GOLD },
        { key: 'addons', t: 'Doplnky', d: 'Pridaj jedálniček', icon: 'plus' as const, to: '/checkout?upsell=mealplan' },
      ],
    },
    {
      eye: 'Upozornenia',
      items: [{ key: 'notifs', t: 'Notifikácie', d: 'Pohyb, myseľ, cyklus…', icon: 'bell' as const, to: '/settings/notifications' }],
    },
    {
      eye: 'Súkromie',
      items: [
        { key: 'privacy', t: 'Súkromie a dáta', d: 'Export, zdieľanie', icon: 'shield' as const, to: '/settings/privacy' },
        { key: 'delete', t: 'Zmazať účet', d: 'Trvalé odstránenie', icon: 'trash' as const, to: '/settings/delete', danger: true },
      ],
    },
  ];
}

export default function SettingsHub() {
  const navigate = useNavigate();
  const { user, signOut } = useSupabaseAuth();
  const { isPremium } = useSubscription();
  const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };
  const fullName = meta.full_name ?? meta.name ?? user?.email?.split('@')[0] ?? 'Eva Nová';
  const email = user?.email ?? '—';
  const groups = buildGroups(email, isPremium);

  return (
    <Page>
      <BackHeader title="Nastavenia" showSearch={false} />
      <div style={{ padding: '0 20px' }}>
        <Ser size={32}>
          Tvoje
          <br />
          <em style={{ color: NM.DEEP, fontStyle: 'italic', fontWeight: 500 }}>nastavenia</em>
        </Ser>
      </div>

      {/* Profile strip */}
      <div style={{ margin: '24px 20px 0', padding: '16px 18px', background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 54, height: 54, borderRadius: 999, backgroundImage: 'url(/images/r9/testimonial-anna.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: NM.SERIF, fontSize: 17, color: NM.DEEP, fontWeight: 500, letterSpacing: '-0.005em' }}>{fullName}</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 2, fontWeight: 400 }}>{isPremium ? 'Plus · od februára 2026' : 'Free'}</div>
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.eye} style={{ margin: '24px 20px 0' }}>
          <Eye size={10} style={{ marginBottom: 10 }}>{g.eye}</Eye>
          <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
            {g.items.map((it, i, arr) => (
              <button
                key={it.key}
                onClick={() => navigate(it.to)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  width: '100%',
                  padding: '13px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  borderBottom: i < arr.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 10, background: it.danger ? `${NM.TERRA}18` : NM.CREAM_2 ?? '#F1ECE3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={it.danger ? NM.TERRA : it.accent ?? NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {ICONS[it.icon]}
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div style={{ fontFamily: NM.SANS, fontSize: 13.5, color: it.danger ? NM.TERRA : NM.DEEP, fontWeight: 500 }}>{it.t}</div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 2, fontWeight: 400 }}>{it.d}</div>
                </div>
                <div style={{ color: NM.TERTIARY, fontSize: 16 }}>›</div>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div style={{ margin: '28px 20px 0', textAlign: 'center' }}>
        <button
          onClick={async () => {
            await signOut();
            navigate('/');
          }}
          style={{
            all: 'unset',
            cursor: 'pointer',
            fontFamily: NM.SANS,
            fontSize: 12,
            color: NM.MUTED,
            fontWeight: 400,
          }}
        >
          Odhlásiť sa
        </button>
      </div>
    </Page>
  );
}
