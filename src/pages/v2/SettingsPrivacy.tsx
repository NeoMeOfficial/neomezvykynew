import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, BackHeader, Eye, Ser, NM } from '../../components/v2/neome';

/**
 * Settings · Privacy & data — R10
 *
 * Visibility segment, permissions toggles, data actions list.
 *
 * FEATURE-NEEDED-SETTINGS-PRIVACY-PERSIST: persist visibility +
 * permission toggles via user_metadata or privacy_settings table.
 * FEATURE-NEEDED-DATA-EXPORT: PDF export endpoint that aggregates
 * journal + stats + cycle log into a downloadable file.
 *
 * Mounted at /settings/privacy.
 */

const PERMS = [
  { id: 'msgs', t: 'Dovoliť správy od členiek', defaultOn: true },
  { id: 'diary', t: 'Zobrazovať môj denník v profile', defaultOn: false },
  { id: 'stats', t: 'Zdieľať moje štatistiky v komunite', defaultOn: false },
  { id: 'analytics', t: 'Analytika aplikácie', defaultOn: true },
];

const DATA_ACTIONS = [
  { id: 'export', t: 'Stiahnuť moje dáta', d: 'PDF export všetkých zápisov a štatistík' },
  { id: 'rules', t: 'Pravidlá ochrany', d: 'Ako používame tvoje dáta' },
  { id: 'thirdparty', t: 'Tretie strany', d: 'Stripe, Supabase, Sentry' },
];

export default function SettingsPrivacy() {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [perms, setPerms] = useState<Record<string, boolean>>(() => Object.fromEntries(PERMS.map((p) => [p.id, p.defaultOn])));

  return (
    <Page>
      <BackHeader title="Súkromie a dáta" showSearch={false} />
      <div style={{ padding: '0 18px' }}>
        <Ser size={28}>
          Tvoje dáta,
          <br />
          <em style={{ color: NM.DEEP, fontStyle: 'italic', fontWeight: 500 }}>tvoje pravidlá</em>
        </Ser>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Viditeľnosť profilu</Eye>
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, padding: 4, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {(['public', 'private'] as const).map((v) => {
            const sel = visibility === v;
            return (
              <button
                key={v}
                onClick={() => setVisibility(v)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '9px 4px',
                  textAlign: 'center' as const,
                  borderRadius: 10,
                  background: sel ? NM.DEEP : 'transparent',
                  color: sel ? '#fff' : NM.MUTED,
                  fontFamily: NM.SANS,
                  fontSize: 12,
                  fontWeight: sel ? 500 : 400,
                }}
              >
                {v === 'public' ? 'Verejný' : 'Súkromný'}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Oprávnenia</Eye>
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
          {PERMS.map((p, i) => {
            const on = perms[p.id];
            return (
              <div key={p.id} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < PERMS.length - 1 ? `1px solid ${NM.HAIR}` : 'none' }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 400, maxWidth: '75%' }}>{p.t}</div>
                <button
                  onClick={() => setPerms((s) => ({ ...s, [p.id]: !s[p.id] }))}
                  aria-pressed={on}
                  style={{ all: 'unset', cursor: 'pointer', width: 40, height: 24, borderRadius: 999, background: on ? NM.DEEP : NM.HAIR_2, position: 'relative', flexShrink: 0 }}
                >
                  <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 20, height: 20, borderRadius: 999, background: '#fff', transition: 'all .2s' }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Dáta</Eye>
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
          {DATA_ACTIONS.map((it, i) => (
            <button
              key={it.id}
              onClick={() => {
                if (it.id === 'export') {
                  // FEATURE-NEEDED-DATA-EXPORT
                } else if (it.id === 'rules') {
                  window.open('https://neome.sk/privacy', '_blank');
                } else if (it.id === 'thirdparty') {
                  window.open('https://neome.sk/third-party', '_blank');
                }
              }}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                width: '100%',
                padding: '13px 16px',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: i < DATA_ACTIONS.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}>{it.t}</div>
                <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 2, fontWeight: 400 }}>{it.d}</div>
              </div>
              <div style={{ color: NM.TERTIARY, fontSize: 16 }}>›</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ margin: '28px 18px 0' }}>
        <button
          onClick={() => navigate('/settings/delete')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            padding: '14px 20px',
            background: 'transparent',
            color: NM.TERRA,
            border: `1px solid ${NM.TERRA}`,
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 13,
            fontWeight: 500,
            textAlign: 'center' as const,
            boxSizing: 'border-box',
          }}
        >
          Zmazať účet
        </button>
      </div>
    </Page>
  );
}
