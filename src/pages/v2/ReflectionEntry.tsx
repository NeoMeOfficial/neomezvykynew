import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Eye, NM } from '../../components/v2/neome';
import { useAchievements } from '../../hooks/useAchievements';
import { usePointsLedger } from '../../hooks/usePointsLedger';
import { useReflections } from '../../hooks/useDailyRituals';

/**
 * Reflection / journal entry — R3
 *
 * Top: Zatvoriť · date · Uložiť. Below: gold "Zamyslenie" eyebrow,
 * serif prompt, 3 divider dots, large serif writing area, word-count
 * footer.
 *
 * Saves via useReflections.addReflection — writes to the diary_entries
 * Supabase table for real users, localStorage demo fallback otherwise.
 *
 * Mounted at /dennik/new.
 */

const SK_DAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'] as const;
const SK_MONTHS_SHORT = ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.'];

const PROMPTS = [
  'Za čo si dnes vďačná — aj keď je to len malý moment?',
  'Čo ti dnes dalo najviac energie?',
  'Kedy si sa dnes cítila najviac sama sebou?',
  'Čo ti dnes bolo najťažšie — a čo si urobila pre seba?',
  'Aký jeden pocit ťa dnes prekvapil?',
];

function dayPromptIndex(d = new Date()): number {
  return Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000) % PROMPTS.length;
}

export default function ReflectionEntry() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addActivity } = useAchievements();
  const { addEntry } = usePointsLedger();
  const { addReflection } = useReflections();
  const today = new Date();
  const dateLabel = `${SK_DAYS[today.getDay()]} · ${today.getDate()}. ${SK_MONTHS_SHORT[today.getMonth()]}`;
  const prompt = PROMPTS[dayPromptIndex(today)];
  const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

  const onSave = async () => {
    const trimmed = text.trim();
    if (trimmed.length === 0 || saving) return;
    setSaving(true);
    setError(null);
    try {
      await addReflection(trimmed);
      addEntry('reflection_write', 6, `reflection_${today.toISOString().slice(0, 10)}`, 'reflection');
      addActivity('reflection_write');
      navigate('/kniznica/dennik');
    } catch (err) {
      console.error('Reflection save failed:', err);
      setError('Nepodarilo sa uložiť. Skús to ešte raz.');
      setSaving(false);
    }
  };

  return (
    <Page paddingBottom={40}>
      <div style={{ padding: 'calc(env(safe-area-inset-top) + 14px) 18px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 14, color: NM.DEEP, padding: 6 }}
        >
          Zatvoriť
        </button>
        <Eye>{dateLabel}</Eye>
        <button
          onClick={onSave}
          disabled={text.trim().length === 0 || saving}
          style={{
            all: 'unset',
            cursor: text.trim().length === 0 || saving ? 'not-allowed' : 'pointer',
            background: NM.DEEP,
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 13,
            fontWeight: 500,
            opacity: text.trim().length === 0 || saving ? 0.5 : 1,
          }}
        >
          {saving ? 'Ukladám…' : 'Uložiť'}
        </button>
      </div>

      {error && (
        <div role="alert" style={{ margin: '0 24px 8px', padding: '10px 14px', background: 'rgba(224, 90, 90, 0.10)', border: '1px solid rgba(224, 90, 90, 0.32)', borderRadius: 12, fontFamily: NM.SANS, fontSize: 13, color: '#A03A3A' }}>
          {error}
        </div>
      )}

      <div style={{ padding: '16px 24px 0' }}>
        <Eye color={NM.GOLD} style={{ marginBottom: 14 }}>Zamyslenie</Eye>
        <div style={{ fontFamily: NM.SERIF, fontSize: 26, fontWeight: 400, color: NM.DEEP, letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: 28 }}>
          {prompt}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 22 }}>
          <div style={{ width: 4, height: 4, borderRadius: 999, background: NM.TERTIARY }} />
          <div style={{ width: 4, height: 4, borderRadius: 999, background: NM.TERTIARY }} />
          <div style={{ width: 4, height: 4, borderRadius: 999, background: NM.TERTIARY }} />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Napíš čo cítiš, čo si dnes prežila…"
          autoFocus
          style={{
            width: '100%',
            minHeight: 240,
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            fontFamily: NM.SERIF,
            fontSize: 17,
            fontWeight: 400,
            color: NM.DEEP,
            letterSpacing: '-0.003em',
            lineHeight: 1.7,
            padding: 0,
          }}
        />

        <div style={{ marginTop: 28, fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>
          {wordCount} {wordCount === 1 ? 'slovo' : wordCount < 5 ? 'slová' : 'slov'} · odporúča sa 50 – 200
        </div>
      </div>
    </Page>
  );
}
