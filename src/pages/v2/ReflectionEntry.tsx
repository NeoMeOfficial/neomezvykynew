import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, NM } from '../../components/v2/neome';
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
 * Keyboard handling: the outer container is `position: fixed; inset: 0`
 * with internal overflow: hidden — iOS Safari has nothing to scroll, so
 * the keyboard overlays the layout instead of pushing the whole page
 * up. The visualViewport listener shrinks the container's height to
 * match the visible viewport when the keyboard is up, keeping the
 * textarea cursor in view.
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

/**
 * Track the visible viewport height (window.visualViewport.height).
 * On iOS this shrinks when the soft keyboard appears, letting us size
 * the composer container to the visible region instead of being clipped
 * behind the keyboard.
 */
function useVisualViewportHeight(): number | null {
  const [h, setH] = useState<number | null>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setH(vv.height);
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);
  return h;
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
  const vvh = useVisualViewportHeight();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock the document while the composer is mounted so iOS can't pull
  // the underlying page when the keyboard opens.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

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
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: vvh ? `${vvh}px` : '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: NM.BG,
        fontFamily: NM.SANS,
        color: NM.DEEP,
      }}
    >
      {/* Top bar — fixed at the top of the composer */}
      <div
        style={{
          padding: 'calc(env(safe-area-inset-top) + 14px) 18px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
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
        <div
          role="alert"
          style={{
            margin: '0 24px 8px',
            padding: '10px 14px',
            background: 'rgba(224, 90, 90, 0.10)',
            border: '1px solid rgba(224, 90, 90, 0.32)',
            borderRadius: 12,
            fontFamily: NM.SANS,
            fontSize: 13,
            color: '#A03A3A',
            flexShrink: 0,
          }}
        >
          {error}
        </div>
      )}

      {/* Scroll region — only this scrolls internally; the page doesn't */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '16px 24px 24px',
        }}
      >
        <Eye color={NM.GOLD} style={{ marginBottom: 14 }}>Zamyslenie</Eye>
        <div
          style={{
            fontFamily: NM.SERIF,
            fontSize: 26,
            fontWeight: 400,
            color: NM.DEEP,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
            marginBottom: 24,
          }}
        >
          {prompt}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
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
            minHeight: 200,
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

        <div style={{ marginTop: 20, fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY }}>
          {wordCount} {wordCount === 1 ? 'slovo' : wordCount < 5 ? 'slová' : 'slov'} · odporúča sa 50 – 200
        </div>
      </div>
    </div>
  );
}
