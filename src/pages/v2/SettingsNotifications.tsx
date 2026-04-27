import { useState } from 'react';
import { Page, BackHeader, Eye, Ser, NM } from '../../components/v2/neome';

/**
 * Settings · Notifications — R10
 *
 * Master toggle + 5 pillar-grouped toggle lists (Pohyb / Výživa /
 * Myseľ / Cyklus / Komunita).
 *
 * FEATURE-NEEDED-SETTINGS-NOTIFICATIONS-PERSIST: persist toggles
 * via supabase user_metadata.notification_prefs OR a dedicated
 * notification_settings table. Currently local state only.
 *
 * FEATURE-NEEDED-PUSH-NOTIFICATIONS: PWA push subscription via
 * service worker is not yet implemented. Toggling 'Všetky notifikácie'
 * doesn't request OS push permission. See cross-cutting note in
 * FEATURES_TO_BUILD.md.
 *
 * Mounted at /settings/notifications.
 */

interface ToggleProps {
  on: boolean;
  onChange: () => void;
  color?: string;
}

function Toggle({ on, onChange, color = NM.TERRA }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      aria-pressed={on}
      style={{ all: 'unset', cursor: 'pointer', width: 40, height: 24, borderRadius: 999, background: on ? color : NM.HAIR_2, position: 'relative', flexShrink: 0, transition: 'all .2s' }}
    >
      <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 20, height: 20, borderRadius: 999, background: '#fff', transition: 'all .2s', boxShadow: '0 2px 4px rgba(61,41,33,0.18)' }} />
    </button>
  );
}

interface Group {
  eye: string;
  color: string;
  items: { id: string; t: string; defaultOn: boolean }[];
}

const GROUPS: Group[] = [
  {
    eye: 'Pohyb · Telo',
    color: NM.TERRA,
    items: [
      { id: 'telo.workout', t: 'Pripomienka cvičenia', defaultOn: true },
      { id: 'telo.programs', t: 'Nové programy', defaultOn: false },
    ],
  },
  {
    eye: 'Výživa',
    color: NM.SAGE,
    items: [
      { id: 'strava.recipes', t: 'Nové recepty', defaultOn: true },
      { id: 'strava.mealplan', t: 'Jedálničkový plán', defaultOn: true },
    ],
  },
  {
    eye: 'Myseľ',
    color: NM.DUSTY,
    items: [
      { id: 'mysel.morning', t: 'Dnešné zamyslenie', defaultOn: true },
      { id: 'mysel.evening', t: 'Meditácia večer', defaultOn: false },
    ],
  },
  {
    eye: 'Cyklus',
    color: NM.MAUVE,
    items: [
      { id: 'cyklus.phase', t: 'Začiatok fázy', defaultOn: true },
      { id: 'cyklus.predict', t: 'Predpokladaná menštruácia', defaultOn: true },
    ],
  },
  {
    eye: 'Komunita a správy',
    color: NM.GOLD,
    items: [
      { id: 'komunita.messages', t: 'Nové správy', defaultOn: true },
      { id: 'komunita.engagement', t: 'Odpovede a srdcia', defaultOn: true },
      { id: 'komunita.follow', t: 'Príspevky od ľudí, ktorých sledujem', defaultOn: false },
    ],
  },
];

export default function SettingsNotifications() {
  const [master, setMaster] = useState(true);
  const [state, setState] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    GROUPS.forEach((g) => g.items.forEach((it) => (init[it.id] = it.defaultOn)));
    return init;
  });

  const toggle = (id: string) =>
    setState((s) => {
      // FEATURE-NEEDED-SETTINGS-NOTIFICATIONS-PERSIST
      return { ...s, [id]: !s[id] };
    });

  return (
    <Page>
      <BackHeader title="Notifikácie" showSearch={false} />
      <div style={{ padding: '0 18px' }}>
        <Ser size={28}>
          Čo ťa má
          <br />
          <em style={{ color: NM.DEEP, fontStyle: 'italic', fontWeight: 500 }}>upozorniť</em>
        </Ser>
      </div>

      <div style={{ margin: '24px 18px 0', padding: '16px 18px', background: '#fff', borderRadius: 16, border: `1px solid ${NM.HAIR}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: NM.SANS, fontSize: 13.5, color: NM.DEEP, fontWeight: 500 }}>Všetky notifikácie</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 2, fontWeight: 400 }}>Hlavný prepínač</div>
        </div>
        <Toggle on={master} onChange={() => setMaster((m) => !m)} color={NM.DEEP} />
      </div>

      {GROUPS.map((g) => (
        <div key={g.eye} style={{ margin: '20px 18px 0', opacity: master ? 1 : 0.4, pointerEvents: master ? 'auto' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: 2, background: g.color }} />
            <Eye size={10} color={g.color}>{g.eye}</Eye>
          </div>
          <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
            {g.items.map((it, i) => (
              <div key={it.id} style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < g.items.length - 1 ? `1px solid ${NM.HAIR}` : 'none' }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 400 }}>{it.t}</div>
                <Toggle on={state[it.id]} onChange={() => toggle(it.id)} color={g.color} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </Page>
  );
}
