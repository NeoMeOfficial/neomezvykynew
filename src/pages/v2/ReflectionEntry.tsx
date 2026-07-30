import { useEffect, useRef, useState } from 'react';
import { NM } from '../../components/v2/neome';
import { useAchievements } from '../../hooks/useAchievements';
import { usePointsLedger } from '../../hooks/usePointsLedger';
import { useReflections } from '../../hooks/useDailyRituals';
import { useSmartBack } from '../../hooks/useSmartBack';
import { computeEnergyPatterns, parseStructured } from '../../features/dennik/structuredEntry';
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
  const smartBack = useSmartBack('/kniznica/dennik');
  const [win, setWin] = useState('');
  const [gave, setGave] = useState<string[]>([]);
  const [took, setTook] = useState<string[]>([]);
  const [reflection, setReflection] = useState('');
  const [customChips, setCustomChips] = useState<string[]>(() => readCustomChips());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addActivity } = useAchievements();
  const { addEntry } = usePointsLedger();
  const { addReflection, updateReflection, entries } = useReflections();
  const patterns = computeEnergyPatterns(entries.map((e) => ({
    text: e.text || '',
    date: (e.date || e.created_at || '').slice(0, 10),
  })));
  const today = new Date();
  const dateLabel = `${SK_DAYS[today.getDay()]} · ${today.getDate()}. ${today.getMonth() + 1}.`;

  // Saving keeps her on this screen with her picks highlighted (Gabi
  // 2026-07-30); reopening the same day re-loads today's entry into the
  // form, and a second save UPDATES it instead of adding a duplicate.
  const todayISO = today.toISOString().slice(0, 10);
  const todayEntry = entries.find(
    (e) => (e.date || e.created_at || '').slice(0, 10) === todayISO && parseStructured(e.text || ''),
  );
  const touchedRef = useRef(false);
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current || touchedRef.current || !todayEntry) return;
    const s = parseStructured(todayEntry.text || '');
    if (!s) return;
    hydratedRef.current = true;
    setWin(s.win);
    setGave(s.gave);
    setTook(s.took);
    setReflection(s.reflection);
    setSaved(true);
  }, [todayEntry]);

  const markDirty = () => {
    touchedRef.current = true;
    setSaved(false);
  };

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (label: string) => {
    markDirty();
    setter((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));
  };

  const handleAddCustom = (label: string) => setCustomChips(addCustomChip(label));

  const hasContent = win.trim() || gave.length > 0 || took.length > 0 || reflection.trim();

  const onSave = async () => {
    if (!hasContent || saving || saved) return;
    setSaving(true);
    setError(null);
    try {
      const payload = serializeStructured({
        win: win.trim(),
        gave,
        took,
        reflection: reflection.trim(),
      });
      if (todayEntry) {
        await updateReflection(todayEntry.id, payload);
      } else {
        await addReflection(payload);
        addEntry('reflection_write', 6, `reflection_${todayISO}`, 'reflection');
        addActivity('reflection_write');
      }
      setSaved(true);
    } catch (err) {
      console.error('Reflection save failed:', err);
      setError('Nepodarilo sa uložiť. Skús to ešte raz.');
    } finally {
      setSaving(false);
    }
  };

  // Each block = its own white card with a serif question whose key words
  // carry the accent colour — the four sections read as four steps, not
  // one wall of text (Gabi 2026-07-30).
  const questionHead = (text: string, color: string) => (
    <div style={{ fontFamily: NM.SERIF, fontSize: 19, color, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.005em' }}>
      {text}
    </div>
  );

  const card = (children: React.ReactNode) => (
    <div style={{ margin: '14px 18px 0', background: '#fff', borderRadius: 20, border: `1px solid ${NM.HAIR}`, padding: '16px 18px' }}>
      {children}
    </div>
  );

  const lineInput = (value: string, set: (v: string) => void, placeholder: string) => (
    <input
      value={value}
      onChange={(e) => { markDirty(); set(e.target.value); }}
      placeholder={placeholder}
      style={{ width: '100%', marginTop: 12, padding: '13px 15px', borderRadius: 14, border: `1px solid ${NM.HAIR}`, fontFamily: NM.SERIF, fontSize: 15, color: NM.DEEP, background: NM.BG, outline: 'none', boxSizing: 'border-box' }}
    />
  );

  return (
    <div style={{ minHeight: '100vh', background: NM.BG, fontFamily: NM.SANS, paddingBottom: 48 }}>
      {/* Top bar: back arrow · date · Uložiť */}
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 18px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={smartBack}
          aria-label="Späť"
          style={{ width: 36, height: 36, borderRadius: 999, background: '#FFFFFF', border: `1px solid ${NM.HAIR_2}`, display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div style={{ fontFamily: NM.SANS, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: NM.TERTIARY, fontWeight: 500 }}>{dateLabel}</div>
        <button
          onClick={onSave}
          disabled={!hasContent || saving || saved}
          style={{ all: 'unset', cursor: hasContent && !saving && !saved ? 'pointer' : 'default', padding: '9px 16px', borderRadius: 999, background: saved ? 'rgba(122,158,120,0.14)' : hasContent ? NM.DEEP : NM.HAIR_2, color: saved ? '#5F8A5D' : hasContent ? '#fff' : NM.TERTIARY, fontFamily: NM.SANS, fontSize: 12.5, fontWeight: 500, opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Ukladám…' : saved ? 'Uložené ✓' : 'Uložiť'}
        </button>
      </div>

      <div style={{ padding: '10px 20px 0' }}>
        <div style={{ fontFamily: NM.SERIF, fontSize: 26, color: NM.DEEP, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
          Aký bol tvoj <em style={{ fontStyle: 'italic', color: NM.GOLD }}>dnešný deň?</em>
        </div>
      </div>

      {card(<>
        {questionHead('Čo sa ti dnes podarilo?', NM.GOLD)}
        {lineInput(win, setWin, 'Aj maličkosť sa počíta…')}
      </>)}

      {card(<>
        {questionHead('Čo ti dnes dalo energiu?', '#7A9E78')}
        <ChipRow selected={gave} onToggle={toggle(setGave)} extra={customChips} onAddCustom={handleAddCustom} />
      </>)}

      {card(<>
        {questionHead('Čo ti dnes zobralo energiu?', '#C27A6E')}
        <ChipRow selected={took} onToggle={toggle(setTook)} extra={customChips} onAddCustom={handleAddCustom} />
      </>)}

      {card(<>
        {questionHead('Tvoja reflexia dňa', NM.MAUVE ?? '#A8848B')}
        <textarea
          value={reflection}
          onChange={(e) => { markDirty(); setReflection(e.target.value); }}
          placeholder="Píš čokoľvek — dobré aj ťažké. Tento priestor je len tvoj."
          rows={5}
          style={{ width: '100%', marginTop: 12, padding: '14px 15px', borderRadius: 14, border: `1px solid ${NM.HAIR}`, fontFamily: NM.SERIF, fontSize: 15, color: NM.DEEP, background: NM.BG, outline: 'none', resize: 'none', lineHeight: 1.55, boxSizing: 'border-box' }}
        />
      </>)}

      {/* Pattern teaser → live pattern once 5 entries exist. Same white
          card as the four blocks above so the series reads as one whole
          (Gabi 2026-07-30); the dark serif head — not a coloured question,
          no input — marks it as the app giving back, not asking. */}
      {card(<>
        <div style={{ fontFamily: NM.SERIF, fontSize: 18, color: NM.DEEP, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.005em' }}>
          {patterns.structuredCount >= 5
            ? 'V minulých dňoch ti energiu najčastejšie…'
            : 'Po piatich dňoch zapisovania sa ti ukáže, čo ti energiu najčastejšie…'}
        </div>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, lineHeight: 1.5 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: '#7A9E78', flexShrink: 0, alignSelf: 'center' }} />
            <span>
              <strong style={{ color: '#7A9E78', fontWeight: 600 }}>dávalo</strong>
              {patterns.structuredCount >= 5 && patterns.gave.length > 0
                ? `: ${patterns.gave.map(([l, n]) => `${l} (${n}×)`).join(', ')}`
                : ': …'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, lineHeight: 1.5 }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: '#C27A6E', flexShrink: 0, alignSelf: 'center' }} />
            <span>
              <strong style={{ color: '#C27A6E', fontWeight: 600 }}>bralo</strong>
              {patterns.structuredCount >= 5 && patterns.took.length > 0
                ? `: ${patterns.took.map(([l, n]) => `${l} (${n}×)`).join(', ')}`
                : ': …'}
            </span>
          </div>
        </div>
        <div style={{ marginTop: 12, fontFamily: NM.SANS, fontSize: 12.5, color: NM.TERTIARY, lineHeight: 1.5, fontStyle: 'italic' }}>
          Prehľad sa každým zápisom aktualizuje — aby si vedela, čomu venovať viac času a čomu menej.
        </div>
      </>)}

      {error && (
        <div style={{ margin: '14px 20px 0', padding: '10px 14px', borderRadius: 12, background: 'rgba(194,122,110,0.10)', border: '1px solid rgba(194,122,110,0.30)', fontFamily: NM.SANS, fontSize: 12, color: '#C27A6E' }}>
          {error}
        </div>
      )}
    </div>
  );
}
