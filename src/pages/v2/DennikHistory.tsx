import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Eye, NM } from '../../components/v2/neome';
import { useReflections } from '../../hooks/useDailyRituals';

/**
 * Osobný denník — Round 20.
 *
 * Two visual states in one screen:
 *   • Empty   → centered card with three mauve dots, serif headline, CTA
 *   • History → "Dnes" prompt card at top + grouped list with mauve dates
 */

const SK_DAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'] as const;

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

const MAUVE_300 = '#CBB2B6';

export default function DennikHistory() {
  const navigate = useNavigate();
  const { entries, loading } = useReflections();
  const today = new Date();
  const todayLabel = `Dnes · ${SK_DAYS[today.getDay()].toLowerCase()} ${today.getDate()}. ${today.getMonth() + 1}.`;
  const prompt = PROMPTS[dayPromptIndex(today)];

  const rows = useMemo(() => {
    return entries
      .map((e) => {
        const raw = e.created_at || e.date || '';
        const d = raw ? new Date(raw) : new Date();
        return {
          id: e.id,
          d: `${d.getDate()}. ${d.getMonth() + 1}.`,
          t: SK_DAYS[d.getDay()],
          body: e.text || '',
          ts: d.getTime(),
        };
      })
      .sort((a, b) => b.ts - a.ts);
  }, [entries]);

  const isEmpty = !loading && rows.length === 0;

  return (
    <Page paddingBottom={120}>
      <TopBar title="Osobný denník" onBack={() => navigate('/kniznica')} />

      {isEmpty ? (
        <EmptyState onWrite={() => navigate('/dennik/new')} />
      ) : (
        <>
          <TodayPrompt label={todayLabel} prompt={prompt} onWrite={() => navigate('/dennik/new')} />

          {rows.length > 0 && (
            <div style={{ padding: '24px 18px 0' }}>
              <Eye style={{ paddingLeft: 4, marginBottom: 10 }}>História</Eye>
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: 20,
                  border: `1px solid ${NM.HAIR}`,
                  overflow: 'hidden',
                }}
              >
                {rows.map((r, i) => (
                  <EntryRow key={r.id} d={r.d} t={r.t} body={r.body} last={i === rows.length - 1} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Page>
  );
}

function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div
      style={{
        padding: 'calc(env(safe-area-inset-top) + 14px) 20px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <button
        onClick={onBack}
        aria-label="Späť"
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          background: '#FFFFFF',
          border: `1px solid ${NM.HAIR_2}`,
          display: 'grid',
          placeItems: 'center',
          cursor: 'pointer',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <div
        style={{
          fontFamily: NM.SERIF,
          fontSize: 20,
          color: NM.DEEP,
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </div>
    </div>
  );
}

function TodayPrompt({ label, prompt, onWrite }: { label: string; prompt: string; onWrite: () => void }) {
  return (
    <div style={{ padding: '18px 18px 0' }}>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '18px 20px',
          border: `1px solid ${NM.HAIR}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Eye color={NM.GOLD} size={10}>{label}</Eye>
          <Eye size={9.5}>Zamyslenie</Eye>
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: NM.SERIF,
            fontSize: 20,
            color: NM.DEEP,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          }}
        >
          {prompt}
        </div>
        <button
          onClick={onWrite}
          style={{
            marginTop: 14,
            background: NM.DEEP,
            color: '#fff',
            border: 0,
            padding: '11px 20px',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 12.5,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Napísať záznam
        </button>
      </div>
    </div>
  );
}

function EntryRow({ d, t, body, last }: { d: string; t: string; body: string; last: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: '16px 18px',
        borderBottom: last ? 'none' : `1px solid ${NM.HAIR}`,
      }}
    >
      <div style={{ width: 56, flexShrink: 0 }}>
        <div
          style={{
            fontFamily: NM.SERIF,
            fontSize: 20,
            color: NM.MAUVE,
            lineHeight: 1,
            letterSpacing: 0,
          }}
        >
          {d}
        </div>
        <Eye size={9} style={{ marginTop: 4 }}>{t}</Eye>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: NM.SANS,
            fontSize: 12.5,
            color: NM.MUTED,
            fontWeight: 300,
            lineHeight: 1.55,
            whiteSpace: 'pre-wrap',
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onWrite }: { onWrite: () => void }) {
  return (
    <div style={{ padding: '18px 18px 0', textAlign: 'center', width: '100%' }}>
      <div
        style={{
          width: '100%',
          height: 120,
          borderRadius: 20,
          background: '#FFFFFF',
          border: `1px solid ${NM.HAIR}`,
          display: 'grid',
          placeItems: 'center',
          marginBottom: 28,
        }}
      >
        <div style={{ display: 'inline-flex', gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: MAUVE_300 }} />
          <span style={{ width: 6, height: 6, borderRadius: 999, background: MAUVE_300 }} />
          <span style={{ width: 6, height: 6, borderRadius: 999, background: MAUVE_300 }} />
        </div>
      </div>
      <div
        style={{
          fontFamily: NM.SERIF,
          fontSize: 26,
          color: NM.DEEP,
          lineHeight: 1.15,
          letterSpacing: '-0.01em',
        }}
      >
        Ešte nič tu nie je
      </div>
      <div
        style={{
          marginTop: 12,
          maxWidth: 280,
          marginLeft: 'auto',
          marginRight: 'auto',
          fontFamily: NM.SANS,
          fontSize: 13.5,
          color: NM.MUTED,
          fontWeight: 300,
          lineHeight: 1.55,
        }}
      >
        Pár viet denne pomáha rozumieť si lepšie — a vrátiť sa k chvíľam, na ktoré sa inak zabudne.
      </div>
      <button
        onClick={onWrite}
        style={{
          marginTop: 22,
          background: NM.DEEP,
          color: '#fff',
          border: 0,
          padding: '13px 26px',
          borderRadius: 999,
          fontFamily: NM.SANS,
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Napísať prvý záznam
      </button>
    </div>
  );
}
