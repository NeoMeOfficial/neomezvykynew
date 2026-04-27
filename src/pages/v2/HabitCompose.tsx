import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, BackHeader, Eye, Ser, NM } from '../../components/v2/neome';

/**
 * Habit composer — R10
 *
 * Mounted at /navyky/new. Sections: Názov / Ikona (5×2 grid) /
 * Oblasť (5 pillar chips) / Ako často / Čas + pripomienka /
 * Cieľová doba / Poznámky.
 *
 * FEATURE-NEEDED-HABIT-PERSIST: actually create a habit row via
 * useSupabaseHabits.create (or extension of existing hook). Currently
 * the Uložiť button just navigates back.
 */

const ICONS = [
  { id: 'droplet', d: 'M12 3s-6 7-6 11a6 6 0 0012 0c0-4-6-11-6-11z' },
  { id: 'flame', d: 'M8 14s-2 2-2 4a4 4 0 008 0c0-2-4-4-4-10 0 0-2 6-2 6z' },
  { id: 'moon', d: 'M21 12.5A9 9 0 0111.5 3a7 7 0 109.5 9.5z' },
  { id: 'sun', d: 'M12 3v2M12 19v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5' },
  { id: 'heart', d: 'M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z' },
  { id: 'book', d: 'M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4V4zM4 16h16' },
  { id: 'coffee', d: 'M4 8h13v6a5 5 0 01-10 0V8zM17 8h2a3 3 0 010 6h-2M5 2v2M9 2v2M13 2v2' },
  { id: 'leaf', d: 'M5 19c7-7 13-7 17-11-1 9-6 14-15 15-2 0-3-1-3-3 0-1 1-1 1-1z' },
  { id: 'feather', d: 'M20 4c-2 8-7 13-15 15l-3-3c2-8 7-13 15-15l3 3zM4 20l6-6' },
  { id: 'smile', d: 'M12 21a9 9 0 100-18 9 9 0 000 18zM8 14a4 4 0 008 0M9 10h.01M15 10h.01' },
];

const CATEGORIES = [
  { id: 'pohyb', t: 'Pohyb', c: NM.TERRA },
  { id: 'vyziva', t: 'Výživa', c: NM.SAGE },
  { id: 'mysel', t: 'Myseľ', c: NM.DUSTY },
  { id: 'cyklus', t: 'Cyklus', c: NM.MAUVE },
  { id: 'ine', t: 'Iné', c: NM.DEEP },
] as const;

const FREQUENCIES = ['Denne', 'Vybrané dni', 'X × týždenne'] as const;
const DURATIONS = ['7 dní', '21 dní', '30 dní', 'Bez limitu'] as const;

export default function HabitCompose() {
  const navigate = useNavigate();
  const [name, setName] = useState('Piť 2l vody');
  const [icon, setIcon] = useState('droplet');
  const [category, setCategory] = useState('pohyb');
  const [frequency, setFrequency] = useState<string>('Denne');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [reminderOn, setReminderOn] = useState(true);
  const [duration, setDuration] = useState<string>('21 dní');
  const [notes, setNotes] = useState('');

  const onSave = () => {
    // FEATURE-NEEDED-HABIT-PERSIST
    navigate('/navyky');
  };

  return (
    <Page paddingBottom={40}>
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 18px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} aria-label="Späť" style={{ all: 'unset', cursor: 'pointer', width: 36, height: 36, borderRadius: 999, background: '#fff', border: `1px solid ${NM.HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <Eye>Nový návyk</Eye>
        <button onClick={onSave} style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12, color: NM.TERRA, fontWeight: 500, padding: 6 }}>
          Uložiť
        </button>
      </div>

      <div style={{ padding: '0 18px' }}>
        <Ser size={30}>
          Vytvor si
          <br />
          <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>návyk</em>
        </Ser>
      </div>

      <div style={{ margin: '24px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 8 }}>Názov</Eye>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 16px',
            background: '#fff',
            borderRadius: 14,
            border: `1px solid ${NM.HAIR_2}`,
            fontFamily: NM.SERIF,
            fontSize: 18,
            color: NM.DEEP,
            fontWeight: 500,
            letterSpacing: '-0.005em',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Ikona</Eye>
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, padding: 12, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {ICONS.map((i) => {
            const sel = icon === i.id;
            return (
              <button
                key={i.id}
                onClick={() => setIcon(i.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  aspectRatio: '1',
                  borderRadius: 10,
                  background: sel ? NM.TERRA : NM.CREAM_2 ?? '#F1ECE3',
                  border: sel ? 'none' : `1px solid ${NM.HAIR}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={sel ? '#fff' : NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={i.d} />
                </svg>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Oblasť</Eye>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map((c) => {
            const sel = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: sel ? c.c : '#fff',
                  color: sel ? '#fff' : NM.DEEP,
                  border: sel ? 'none' : `1px solid ${NM.HAIR_2}`,
                  fontFamily: NM.SANS,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {c.t}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Ako často</Eye>
        <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, padding: 4, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {FREQUENCIES.map((f) => {
            const sel = frequency === f;
            return (
              <button
                key={f}
                onClick={() => setFrequency(f)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  textAlign: 'center' as const,
                  padding: '9px 8px',
                  borderRadius: 10,
                  background: sel ? NM.DEEP : 'transparent',
                  color: sel ? '#fff' : NM.MUTED,
                  fontFamily: NM.SANS,
                  fontSize: 11.5,
                  fontWeight: sel ? 500 : 400,
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ margin: '22px 18px 0', background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${NM.HAIR}` }}>
          <div>
            <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}>Čas</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 2, fontWeight: 400 }}>Kedy počas dňa</div>
          </div>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: NM.SERIF,
              fontSize: 17,
              color: NM.TERRA,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              textAlign: 'right',
            }}
          />
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}>Pripomienka</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 2, fontWeight: 400 }}>Notifikácia v čase</div>
          </div>
          <button
            onClick={() => setReminderOn((v) => !v)}
            aria-label="Pripomienka"
            style={{
              all: 'unset',
              cursor: 'pointer',
              width: 40,
              height: 24,
              borderRadius: 999,
              background: reminderOn ? NM.TERRA : NM.HAIR_2,
              position: 'relative',
              transition: 'all .2s',
            }}
          >
            <div style={{ position: 'absolute', top: 2, left: reminderOn ? 18 : 2, width: 20, height: 20, borderRadius: 999, background: '#fff', transition: 'all .2s', boxShadow: '0 2px 4px rgba(61,41,33,0.18)' }} />
          </button>
        </div>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Cieľová doba</Eye>
        <div style={{ display: 'flex', gap: 8 }}>
          {DURATIONS.map((g) => {
            const sel = duration === g;
            return (
              <button
                key={g}
                onClick={() => setDuration(g)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  flex: 1,
                  padding: '11px 4px',
                  textAlign: 'center' as const,
                  borderRadius: 12,
                  background: sel ? NM.TERRA : '#fff',
                  color: sel ? '#fff' : NM.DEEP,
                  border: sel ? 'none' : `1px solid ${NM.HAIR_2}`,
                  fontFamily: NM.SANS,
                  fontSize: 11.5,
                  fontWeight: 500,
                }}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ margin: '22px 18px 0' }}>
        <Eye size={10} style={{ marginBottom: 8 }}>Poznámky</Eye>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Prečo si tento návyk vyberám…"
          style={{
            width: '100%',
            minHeight: 76,
            padding: '14px 16px',
            background: '#fff',
            borderRadius: 14,
            border: `1px solid ${NM.HAIR}`,
            fontFamily: NM.SANS,
            fontSize: 12.5,
            color: NM.DEEP,
            fontWeight: 400,
            lineHeight: 1.5,
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </Page>
  );
}
