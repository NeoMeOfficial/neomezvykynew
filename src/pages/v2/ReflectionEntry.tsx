import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Eye, NM } from '../../components/v2/neome';

/**
 * Reflection / journal entry — R3
 *
 * Top: Zatvoriť · date · Uložiť. Below: gold "Zamyslenie" eyebrow,
 * serif prompt, 3 divider dots, large serif writing area, word-count
 * footer.
 *
 * FEATURE-NEEDED-DOMOV-REFLECTIONS / -PROFIL-REFLECTION-COUNT:
 * see FEATURES_TO_BUILD.md F-003. Account-scoped reflection store
 * is needed for save to persist; current useReflectionData uses
 * access-code scoping. The Uložiť button currently navigates back
 * without persisting — flagged.
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
  const today = new Date();
  const dateLabel = `${SK_DAYS[today.getDay()]} · ${today.getDate()}. ${SK_MONTHS_SHORT[today.getMonth()]}`;
  const prompt = PROMPTS[dayPromptIndex(today)];
  const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

  const onSave = () => {
    // FEATURE-NEEDED-DOMOV-REFLECTIONS: actually persist this entry.
    // Currently a no-op aside from navigation.
    navigate('/dennik');
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
          style={{
            all: 'unset',
            cursor: 'pointer',
            background: NM.TERRA,
            color: '#fff',
            padding: '8px 16px',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Uložiť
        </button>
      </div>

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
