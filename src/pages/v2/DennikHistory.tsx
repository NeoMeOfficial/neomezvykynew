import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page, Eye, NM, ConfirmSheet } from '../../components/v2/neome';
import { useReflections } from '../../hooks/useDailyRituals';
import { useSmartBack } from '../../hooks/useSmartBack';
import { parseStructured, serializeStructured, computeEnergyPatterns } from '../../features/dennik/structuredEntry';

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
  const smartBack = useSmartBack('/kniznica');
  const { entries, loading, deleteReflection, updateReflection } = useReflections();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const today = new Date();
  const todayLabel = `Dnes · ${SK_DAYS[today.getDay()].toLowerCase()} ${today.getDate()}. ${today.getMonth() + 1}.`;
  const prompt = PROMPTS[dayPromptIndex(today)];

  const rows = useMemo(() => {
    return entries
      .map((e) => {
        const raw = e.created_at || e.date || '';
        const d = raw ? new Date(raw) : new Date();
        const structured = parseStructured(e.text || '');
        // Human preview for structured entries; plain entries unchanged.
        const body = structured
          ? [
              structured.win && `✓ ${structured.win}`,
              structured.reflection,
              structured.gave.length > 0 && `⚡ Dalo: ${structured.gave.join(', ')}`,
              structured.took.length > 0 && `− Bralo: ${structured.took.join(', ')}`,
            ].filter(Boolean).join('\n')
          : (e.text || '');
        return {
          id: e.id,
          d: `${d.getDate()}. ${d.getMonth() + 1}.`,
          t: SK_DAYS[d.getDay()],
          body,
          structured,
          // Editing a structured entry edits its reflection; chips stay.
          editBody: structured ? structured.reflection : (e.text || ''),
          ts: d.getTime(),
        };
      })
      .sort((a, b) => b.ts - a.ts);
  }, [entries]);

  // Energy patterns — counted from her own chip taps (facts, not guesses).
  const patterns = useMemo(
    () => computeEnergyPatterns(entries.map((e) => ({
      text: e.text || '',
      date: (e.date || e.created_at || '').slice(0, 10),
    }))),
    [entries],
  );

  const isEmpty = !loading && rows.length === 0;
  const selectedRow = rows.find((r) => r.id === selectedId) || null;
  const actionRow = rows.find((r) => r.id === actionId) || null;
  const editRow = rows.find((r) => r.id === editId) || null;
  // The row whose id is targeted by the destructive confirm sheet.
  const pendingDeleteId = selectedId || actionId;

  return (
    <Page paddingBottom={120}>
      <TopBar title="Osobný denník" onBack={smartBack} />

      {isEmpty ? (
        <EmptyState onWrite={() => navigate('/dennik/new')} />
      ) : (
        <>
          <TodayPrompt label={todayLabel} prompt={prompt} onWrite={() => navigate('/dennik/new')} />

          {/* Tvoje vzorce — appears from 5 structured entries in 7 days */}
          {patterns.structuredCount >= 5 ? (
            <div style={{ padding: '18px 18px 0' }}>
              <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${NM.HAIR}`, padding: '16px 18px' }}>
                {patterns.gave.length > 0 && (
                  <div style={{ fontFamily: NM.SANS, fontSize: 13.5, color: NM.DEEP, lineHeight: 1.55 }}>
                    V minulých dňoch ti energiu <strong style={{ color: '#7A9E78', fontWeight: 700 }}>dávalo</strong>:{' '}
                    {patterns.gave.map(([l, n]) => `${l} (${n}×)`).join(', ')}
                  </div>
                )}
                {patterns.took.length > 0 && (
                  <div style={{ marginTop: patterns.gave.length > 0 ? 10 : 0, fontFamily: NM.SANS, fontSize: 13.5, color: NM.DEEP, lineHeight: 1.55 }}>
                    …a naopak energiu <strong style={{ color: '#C27A6E', fontWeight: 700 }}>bralo</strong>:{' '}
                    {patterns.took.map(([l, n]) => `${l} (${n}×)`).join(', ')}
                  </div>
                )}
                {patterns.gave.length === 0 && patterns.took.length === 0 && (
                  <div style={{ fontFamily: NM.SANS, fontSize: 12.5, color: NM.MUTED, fontWeight: 300 }}>
                    Označuj pri zápise, čo ti energiu dáva a berie — a tu uvidíš, čo ťa nabíja.
                  </div>
                )}
              </div>
            </div>
          ) : patterns.structuredCount > 0 ? (
            <div style={{ padding: '18px 18px 0' }}>
              <div style={{ background: 'rgba(184,134,74,0.08)', border: '1px solid rgba(184,134,74,0.28)', borderRadius: 16, padding: '12px 16px', fontFamily: NM.SANS, fontSize: 12.5, color: NM.DEEP, lineHeight: 1.5 }}>
                Ešte {5 - patterns.structuredCount} {5 - patterns.structuredCount === 1 ? 'zápis' : 'zápisy'} a ukážem ti, čo ťa v posledných dňoch nabíja a čo vybíja.
              </div>
            </div>
          ) : null}

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
                  <EntryRow
                    key={r.id}
                    d={r.d}
                    t={r.t}
                    body={r.body}
                    last={i === rows.length - 1}
                    onOpen={() => setSelectedId(r.id)}
                    onMore={() => setActionId(r.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {selectedRow && !confirmOpen && (
        <EntryDetailSheet
          row={selectedRow}
          onClose={() => setSelectedId(null)}
          onEdit={() => {
            setEditId(selectedId);
            setSelectedId(null);
          }}
          onDelete={() => setConfirmOpen(true)}
        />
      )}

      {actionRow && (
        <EntryActionSheet
          row={actionRow}
          onClose={() => setActionId(null)}
          onEdit={() => {
            setEditId(actionId);
            setActionId(null);
          }}
          onDelete={() => setConfirmOpen(true)}
        />
      )}

      {editRow && (
        <EditEntrySheet
          row={{ ...editRow, body: editRow.editBody }}
          onClose={() => setEditId(null)}
          onSave={async (text) => {
            if (editId) {
              const r = rows.find((x) => x.id === editId);
              const next = r?.structured
                ? serializeStructured({ ...r.structured, reflection: text })
                : text;
              await updateReflection(editId, next);
            }
            setEditId(null);
          }}
        />
      )}

      <ConfirmSheet
        open={confirmOpen}
        eyebrow="Osobný denník"
        title="Vymazať tento záznam?"
        message="Záznam bude trvalo odstránený. Túto akciu nemožno vrátiť."
        confirmLabel="Áno, vymazať"
        cancelLabel="Späť"
        tone="danger"
        onConfirm={async () => {
          if (pendingDeleteId) await deleteReflection(pendingDeleteId);
          setConfirmOpen(false);
          setSelectedId(null);
          setActionId(null);
        }}
        onCancel={() => setConfirmOpen(false)}
      />
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

function EntryRow({
  d,
  t,
  body,
  last,
  onOpen,
  onMore,
}: {
  d: string;
  t: string;
  body: string;
  last: boolean;
  onOpen: () => void;
  onMore: () => void;
}) {
  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      style={{
        display: 'flex',
        gap: 16,
        padding: '16px 18px',
        borderBottom: last ? 'none' : `1px solid ${NM.HAIR}`,
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',
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
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {body}
        </div>
      </div>
      <button
        type="button"
        aria-label="Možnosti záznamu"
        onClick={(e) => {
          e.stopPropagation();
          onMore();
        }}
        style={{
          all: 'unset',
          cursor: 'pointer',
          flexShrink: 0,
          width: 30,
          height: 30,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          alignSelf: 'flex-start',
          marginTop: -2,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={NM.TERTIARY}>
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>
    </div>
  );
}

function EntryActionSheet({
  row,
  onClose,
  onEdit,
  onDelete,
}: {
  row: { d: string; t: string };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(42,26,20,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          background: NM.BG,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '24px 24px max(env(safe-area-inset-bottom), 24px)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 36,
            height: 4,
            borderRadius: 999,
            background: NM.HAIR_2,
            margin: '0 auto 18px',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 18 }}>
          <div style={{ fontFamily: NM.SERIF, fontSize: 20, color: NM.MAUVE, lineHeight: 1 }}>{row.d}</div>
          <Eye size={10}>{row.t}</Eye>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ActionButton onClick={onEdit} icon="edit">Upraviť záznam</ActionButton>
          <ActionButton onClick={onDelete} icon="trash" danger>Vymazať záznam</ActionButton>
          <button
            type="button"
            onClick={onClose}
            style={{
              all: 'unset',
              cursor: 'pointer',
              textAlign: 'center',
              padding: '12px 20px',
              marginTop: 6,
              borderRadius: 999,
              background: 'transparent',
              color: NM.MUTED,
              fontFamily: NM.SANS,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            Späť
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  icon,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon: 'edit' | 'trash';
  danger?: boolean;
}) {
  const color = danger ? '#B5544A' : NM.DEEP;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 18px',
        borderRadius: 16,
        background: '#FFFFFF',
        border: `1px solid ${NM.HAIR}`,
        color,
        fontFamily: NM.SANS,
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: '0.01em',
      }}
    >
      {icon === 'edit' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
}

function EditEntrySheet({
  row,
  onClose,
  onSave,
}: {
  row: { d: string; t: string; body: string };
  onClose: () => void;
  onSave: (text: string) => Promise<void> | void;
}) {
  const [text, setText] = useState(row.body);
  const [saving, setSaving] = useState(false);
  const dirty = text.trim() !== row.body.trim();

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(42,26,20,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          background: NM.BG,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '20px 22px max(env(safe-area-inset-bottom), 20px)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 36,
            height: 4,
            borderRadius: 999,
            background: NM.HAIR_2,
            margin: '0 auto 14px',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button
            type="button"
            onClick={onClose}
            style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, padding: 6 }}
          >
            Zrušiť
          </button>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontFamily: NM.SERIF, fontSize: 18, color: NM.MAUVE, lineHeight: 1 }}>{row.d}</div>
            <Eye size={9.5}>{row.t}</Eye>
          </div>
          <button
            type="button"
            onClick={async () => {
              if (!dirty || saving) return;
              setSaving(true);
              try {
                await onSave(text);
              } finally {
                setSaving(false);
              }
            }}
            disabled={!dirty || saving}
            style={{
              all: 'unset',
              cursor: !dirty || saving ? 'not-allowed' : 'pointer',
              background: NM.DEEP,
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 999,
              fontFamily: NM.SANS,
              fontSize: 13,
              fontWeight: 500,
              opacity: !dirty || saving ? 0.5 : 1,
            }}
          >
            {saving ? 'Ukladám…' : 'Uložiť'}
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
          style={{
            flex: 1,
            minHeight: 220,
            width: '100%',
            boxSizing: 'border-box',
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            fontFamily: NM.SERIF,
            fontSize: 17,
            fontWeight: 400,
            color: NM.DEEP,
            letterSpacing: '-0.003em',
            lineHeight: 1.65,
            padding: '8px 0 12px',
          }}
        />
      </div>
    </div>
  );
}

function EntryDetailSheet({
  row,
  onClose,
  onEdit,
  onDelete,
}: {
  row: { d: string; t: string; body: string };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(42,26,20,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          background: NM.BG,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '24px 24px max(env(safe-area-inset-bottom), 24px)',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 36,
            height: 4,
            borderRadius: 999,
            background: NM.HAIR_2,
            margin: '0 auto 18px',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
          <div style={{ fontFamily: NM.SERIF, fontSize: 22, color: NM.MAUVE, lineHeight: 1 }}>{row.d}</div>
          <Eye size={10}>{row.t}</Eye>
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            fontFamily: NM.SERIF,
            fontSize: 17,
            color: NM.DEEP,
            fontWeight: 400,
            lineHeight: 1.65,
            letterSpacing: '-0.003em',
            whiteSpace: 'pre-wrap',
            marginBottom: 22,
          }}
        >
          {row.body}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ActionButton onClick={onEdit} icon="edit">Upraviť záznam</ActionButton>
          <ActionButton onClick={onDelete} icon="trash" danger>Vymazať záznam</ActionButton>
          <button
            type="button"
            onClick={onClose}
            style={{
              all: 'unset',
              cursor: 'pointer',
              textAlign: 'center',
              padding: '12px 20px',
              marginTop: 4,
              borderRadius: 999,
              background: 'transparent',
              color: NM.MUTED,
              fontFamily: NM.SANS,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            Zavrieť
          </button>
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
