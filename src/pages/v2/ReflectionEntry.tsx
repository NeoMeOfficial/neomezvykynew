import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, NM } from '../../components/v2/neome';
import { useAchievements } from '../../hooks/useAchievements';
import { usePointsLedger } from '../../hooks/usePointsLedger';
import { useReflections } from '../../hooks/useDailyRituals';
import {
  ENERGY_CHIPS,
  readCustomChips,
  addCustomChip,
  serializeStructured,
} from '../../features/dennik/structuredEntry';

/**
 * Denník — structured daily entry (Gabi 2026-07-30).
 *
 * Four blocks, under a minute: čo sa podarilo (line), energiu dalo /
 * zobralo (one-tap chips so patterns are computable facts), reflexia
 * (free text with a NEUTRAL prompt — hard days belong here too).
 * Saves as versioned JSON into diary_entries.text via addReflection;
 * old plain entries remain readable in history.
 *
 * Mounted at /dennik/new.
 */

const SK_DAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'] as const;

function ChipRow({ selected, onToggle, extra, onAddCustom }: {
  selected: string[];
  onToggle: (label: string) => void;
  extra: string[];
  onAddCustom: (label: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const all = [...ENERGY_CHIPS, ...extra];
  const commit = () => {
    const clean = draft.trim();
    if (clean) { onAddCustom(clean); onToggle(clean); }
    setDraft('');
    setAdding(false);
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
      {all.map((label) => {
        const on = selected.includes(label);
        return (
          <button
            key={label}
            onClick={() => onToggle(label)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: '8px 13px',
              borderRadius: 999,
              background: on ? NM.DEEP : '#fff',
              color: on ? '#fff' : NM.DEEP,
              border: on ? '1px solid transparent' : `1px solid ${NM.HAIR_2}`,
              fontFamily: NM.SANS,
              fontSize: 12,
              fontWeight: on ? 500 : 400,
            }}
          >
            {on ? '✓ ' : ''}{label}
          </button>
        );
      })}
      {adding ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
          placeholder="Vlastné…"
          style={{ padding: '8px 13px', borderRadius: 999, border: `1px dashed ${NM.HAIR_2}`, fontFamily: NM.SANS, fontSize: 12, outline: 'none', width: 110, background: '#fff', color: NM.DEEP, boxSizing: 'border-box' }}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          style={{ all: 'unset', cursor: 'pointer', padding: '8px 13px', borderRadius: 999, background: 'transparent', color: NM.GOLD, border: `1px dashed ${NM.GOLD}66`, fontFamily: NM.SANS, fontSize: 12, fontWeight: 500 }}
        >
          + Vlastné
        </button>
      )}
    </div>
  );
}

export default function ReflectionEntry() {
  const navigate = useNavigate();
  const [win, setWin] = useState('');
  const [gave, setGave] = useState<string[]>([]);
  const [took, setTook] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [customChips, setCustomChips] = useState<string[]>(() => readCustomChips());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addActivity } = useAchievements();
  const { addEntry } = usePointsLedger();
  const { addReflection } = useReflections();
  const today = new Date();
  const dateLabel = `${SK_DAYS[today.getDay()]} · ${today.getDate()}. ${today.getMonth() + 1}.`;

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (label: string) =>
    setter((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));

  const handleAddCustom = (label: string) => setCustomChips(addCustomChip(label));

  const hasContent = win.trim() || gave.length > 0 || took.length > 0 || reflection.trim();

  const onSave = async () => {
    if (!hasContent || saving) return;
    setSaving(true);
    setError(null);
    try {
      await addReflection(serializeStructured({
        win: win.trim(),
        gave,
        took,
        reflection: reflection.trim(),
      }));
      addEntry('reflection_write', 6, `reflection_${today.toISOString().slice(0, 10)}`, 'reflection');
      addActivity('reflection_write');
      navigate('/kniznica/dennik');
    } catch (err) {
      console.error('Reflection save failed:', err);
      setError('Nepodarilo sa uložiť. Skús to ešte raz.');
      setSaving(false);
    }
  };

  const blockLabel = (text: string, color: string) => (
    <Eye size={10} color={color}>{text}</Eye>
  );

  const lineInput = (value: string, set: (v: string) => void, placeholder: string) => (
    <input
      value={value}
      onChange={(e) => set(e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', marginTop: 10, padding: '13px 15px', borderRadius: 14, border: `1px solid ${NM.HAIR_2}`, fontFamily: NM.SERIF, fontSize: 15, color: NM.DEEP, background: '#fff', outline: 'none', boxSizing: 'border-box' }}
    />
  );

  return (
    <div style={{ minHeight: '100vh', background: NM.BG, fontFamily: NM.SANS, paddingBottom: 48 }}>
      {/* Top bar: Zatvoriť · date · Uložiť */}
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED }}>
          Zatvoriť
        </button>
        <div style={{ fontFamily: NM.SANS, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: NM.TERTIARY, fontWeight: 500 }}>{dateLabel}</div>
        <button
          onClick={onSave}
          disabled={!hasContent || saving}
          style={{ all: 'unset', cursor: hasContent && !saving ? 'pointer' : 'default', padding: '9px 16px', borderRadius: 999, background: hasContent ? NM.DEEP : NM.HAIR_2, color: hasContent ? '#fff' : NM.TERTIARY, fontFamily: NM.SANS, fontSize: 12.5, fontWeight: 500, opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Ukladám…' : 'Uložiť'}
        </button>
      </div>

      <div style={{ padding: '10px 20px 0' }}>
        <div style={{ fontFamily: NM.SERIF, fontSize: 26, color: NM.DEEP, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
          Ako bol tvoj <em style={{ fontStyle: 'italic', color: NM.GOLD }}>dnešný deň?</em>
        </div>
      </div>

      {/* 1 · Čo sa ti dnes podarilo */}
      <div style={{ padding: '24px 20px 0' }}>
        {blockLabel('Čo sa ti dnes podarilo?', NM.GOLD)}
        {lineInput(win, setWin, 'Aj maličkosť sa počíta…')}
      </div>

      {/* 2 · Energiu dalo */}
      <div style={{ padding: '24px 20px 0' }}>
        {blockLabel('Čo ti dnes dalo energiu?', '#7A9E78')}
        <ChipRow selected={gave} onToggle={toggle(setGave)} extra={customChips} onAddCustom={handleAddCustom} />
      </div>

      {/* 3 · Energiu zobralo */}
      <div style={{ padding: '24px 20px 0' }}>
        {blockLabel('Čo ti dnes zobralo energiu?', '#C27A6E')}
        <ChipRow selected={took} onToggle={toggle(setTook)} extra={customChips} onAddCustom={handleAddCustom} />
      </div>

      {/* 4 · Reflexia — neutral prompt, hard days welcome */}
      <div style={{ padding: '24px 20px 0' }}>
        {blockLabel('Tvoja reflexia dňa', NM.MAUVE ?? '#A8848B')}
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Píš čokoľvek — dobré aj ťažké. Tento priestor je len tvoj."
          rows={5}
          style={{ width: '100%', marginTop: 10, padding: '14px 15px', borderRadius: 14, border: `1px solid ${NM.HAIR_2}`, fontFamily: NM.SERIF, fontSize: 15, color: NM.DEEP, background: '#fff', outline: 'none', resize: 'none', lineHeight: 1.55, boxSizing: 'border-box' }}
        />
      </div>

      {error && (
        <div style={{ margin: '14px 20px 0', padding: '10px 14px', borderRadius: 12, background: 'rgba(194,122,110,0.10)', border: '1px solid rgba(194,122,110,0.30)', fontFamily: NM.SANS, fontSize: 12, color: '#C27A6E' }}>
          {error}
        </div>
      )}
    </div>
  );
}
