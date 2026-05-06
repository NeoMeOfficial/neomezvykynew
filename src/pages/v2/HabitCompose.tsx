import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseHabits } from '../../hooks/useSupabaseHabits';
import { useToast } from '@/hooks/use-toast';
import { Page, Eye, Ser, NM } from '../../components/v2/neome';

const ICONS = [
  { id: 'droplet',  label: 'Voda',    d: 'M12 3s-6 7-6 11a6 6 0 0012 0c0-4-6-11-6-11z' },
  { id: 'flame',    label: 'Pohyb',   d: 'M8 14s-2 2-2 4a4 4 0 008 0c0-2-4-4-4-10 0 0-2 6-2 6z' },
  { id: 'moon',     label: 'Spánok',  d: 'M21 12.5A9 9 0 0111.5 3a7 7 0 109.5 9.5z' },
  { id: 'sun',      label: 'Ráno',    d: 'M12 3v2M12 19v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5' },
  { id: 'heart',    label: 'Zdravie', d: 'M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z' },
  { id: 'book',     label: 'Čítanie', d: 'M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4V4zM4 16h16' },
  { id: 'leaf',     label: 'Výživa',  d: 'M5 19c7-7 13-7 17-11-1 9-6 14-15 15-2 0-3-1-3-3 0-1 1-1 1-1z' },
  { id: 'feather',  label: 'Písanie', d: 'M20 4c-2 8-7 13-15 15l-3-3c2-8 7-13 15-15l3 3zM4 20l6-6' },
  { id: 'smile',    label: 'Myseľ',   d: 'M12 21a9 9 0 100-18 9 9 0 000 18zM8 14a4 4 0 008 0M9 10h.01M15 10h.01' },
  { id: 'zap',      label: 'Energia', d: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
] as const;

type IconId = typeof ICONS[number]['id'];

const CATEGORIES = [
  { id: 'pohyb',  t: 'Pohyb',   c: NM.TERRA },
  { id: 'vyziva', t: 'Výživa',  c: NM.SAGE  },
  { id: 'mysel',  t: 'Myseľ',   c: NM.DUSTY },
  { id: 'cyklus', t: 'Cyklus',  c: NM.MAUVE },
  { id: 'ine',    t: 'Iné',     c: NM.DEEP  },
] as const;

const FREQUENCIES = ['Denne', 'Vybrané dni', 'X × týždenne'] as const;
const DURATIONS   = ['7 dní', '21 dní', '30 dní', 'Bez limitu'] as const;

const DURATION_DAYS: Record<string, number> = {
  '7 dní': 7, '21 dní': 21, '30 dní': 30, 'Bez limitu': 365,
};

// Auto-pick an icon based on keywords in the habit name
const KEYWORD_MAP: [RegExp, IconId][] = [
  [/vod[au]|piť|hydrat|drink/i,                             'droplet'],
  [/cvič|tréning|beh|fitness|pohyb|sport|chôdz|yoga|jóga/i, 'flame'],
  [/spánok|spať|odpočinok|noc|sleep|relax/i,                'moon'],
  [/ráno|vstáv|meditáci|mindful|dýchan/i,                   'sun'],
  [/zdravi|vitamin|liek|strech/i,                           'heart'],
  [/čítaj|čítanie|kniha|učiť|vzdeláv|study/i,              'book'],
  [/jedlo|strava|zelenin|ovocie|jedz|zdravá/i,              'leaf'],
  [/písanie|denník|journal|kreativ|zápis/i,                 'feather'],
  [/vďačnosť|radosť|šťastie|pozitiv|nálada|úsmev/i,        'smile'],
  [/energia|energi|káva|coffee/i,                           'zap'],
];

function autoIcon(name: string): IconId | null {
  for (const [re, id] of KEYWORD_MAP) {
    if (re.test(name)) return id;
  }
  return null;
}

// ─── Progress dots ─────────────────────────────────────────────────────────────
function Dots({ step }: { step: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          style={{
            width: n === step ? 20 : 6,
            height: 6,
            borderRadius: 999,
            background: n === step ? NM.TERRA : NM.HAIR_2,
            transition: 'all 0.25s ease',
          }}
        />
      ))}
    </div>
  );
}

export default function HabitCompose() {
  const navigate  = useNavigate();
  const { addHabit } = useSupabaseHabits();
  const { toast } = useToast();

  const [step, setStep] = useState(1);

  // Step 1
  const [name,        setName]        = useState('');
  const [icon,        setIcon]        = useState<IconId>('droplet');
  const [iconManual,  setIconManual]  = useState(false);

  // Step 2
  const [category,  setCategory]  = useState<string>('pohyb');
  const [frequency, setFrequency] = useState<string>('Denne');

  // Step 3
  const [duration,      setDuration]      = useState<string>('21 dní');
  const [reminderTime,  setReminderTime]  = useState('08:00');
  const [reminderOn,    setReminderOn]    = useState(true);

  const [saving, setSaving] = useState(false);

  // Auto-select icon while typing — stops once user taps an icon manually
  useEffect(() => {
    if (iconManual) return;
    const suggested = autoIcon(name);
    if (suggested) setIcon(suggested);
  }, [name, iconManual]);

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
    else navigate(-1);
  };

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      toast({ title: 'Zadaj názov návyku', variant: 'destructive' });
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    const ok = await addHabit({
      name: name.trim(),
      durationDays: DURATION_DAYS[duration] ?? 21,
      unit: 'krát',
      targetPerDay: 1,
    });
    setSaving(false);
    if (!ok) {
      toast({ title: 'Uloženie zlyhalo', description: 'Skús to ešte raz.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Návyk vytvorený' });
    navigate('/navyky');
  };

  const STEP_TITLES = ['Ako ho nazveme?', 'Oblasť a frekvencia', 'Kedy a ako dlho?'];

  return (
    <Page paddingBottom={100}>
      {/* Header */}
      <div style={{
        padding: 'calc(env(safe-area-inset-top) + 14px) 18px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button
          onClick={handleBack}
          aria-label="Späť"
          style={{ all: 'unset', cursor: 'pointer', width: 36, height: 36, borderRadius: 999, background: '#fff', border: `1px solid ${NM.HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <Eye>Nový návyk</Eye>
        <div style={{ width: 36 }} />
      </div>

      <Dots step={step} />

      {/* Slide container */}
      <div style={{ overflow: 'hidden', marginTop: 24 }}>
        <div style={{
          display: 'flex',
          transform: `translateX(${(step - 1) * -100}%)`,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'transform',
        }}>

          {/* ── Step 1: Name + Icon ────────────────────────────────────────── */}
          <div style={{ minWidth: '100%', padding: '0 18px' }}>
            <Ser size={28}>
              {STEP_TITLES[0]}
            </Ser>

            <div style={{ marginTop: 22 }}>
              <Eye size={10} style={{ marginBottom: 8 }}>Názov návyku</Eye>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Napr. Piť 2l vody denne"
                autoFocus
                style={{
                  width: '100%',
                  padding: '15px 16px',
                  background: '#fff',
                  borderRadius: 14,
                  border: `1.5px solid ${NM.HAIR_2}`,
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

            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                <Eye size={10}>Ikona</Eye>
                {!iconManual && autoIcon(name) && (
                  <span style={{ fontFamily: NM.SANS, fontSize: 9.5, color: NM.TERRA, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
                    Automaticky
                  </span>
                )}
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 10,
              }}>
                {ICONS.map((ic) => {
                  const sel = icon === ic.id;
                  return (
                    <button
                      key={ic.id}
                      onClick={() => { setIcon(ic.id); setIconManual(true); }}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column' as const,
                        alignItems: 'center',
                        gap: 6,
                        padding: '12px 4px 10px',
                        borderRadius: 14,
                        background: sel ? NM.TERRA : '#fff',
                        border: `1.5px solid ${sel ? NM.TERRA : NM.HAIR}`,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={sel ? '#fff' : NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d={ic.d} />
                      </svg>
                      <span style={{ fontFamily: NM.SANS, fontSize: 9, color: sel ? '#fff' : NM.MUTED, fontWeight: 500, letterSpacing: '0.02em' }}>
                        {ic.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Step 2: Category + Frequency ──────────────────────────────── */}
          <div style={{ minWidth: '100%', padding: '0 18px' }}>
            <Ser size={28}>
              {STEP_TITLES[1]}
            </Ser>

            <div style={{ marginTop: 22 }}>
              <Eye size={10} style={{ marginBottom: 12 }}>Oblasť</Eye>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                {CATEGORIES.map((c) => {
                  const sel = category === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '14px 18px',
                        borderRadius: 14,
                        background: sel ? c.c : '#fff',
                        color: sel ? '#fff' : NM.DEEP,
                        border: `1.5px solid ${sel ? c.c : NM.HAIR}`,
                        fontFamily: NM.SANS,
                        fontSize: 14,
                        fontWeight: sel ? 500 : 400,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {c.t}
                      {sel && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              <Eye size={10} style={{ marginBottom: 12 }}>Ako často</Eye>
              <div style={{ background: '#fff', borderRadius: 14, border: `1px solid ${NM.HAIR}`, padding: 4, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
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
                        padding: '11px 6px',
                        borderRadius: 10,
                        background: sel ? NM.DEEP : 'transparent',
                        color: sel ? '#fff' : NM.MUTED,
                        fontFamily: NM.SANS,
                        fontSize: 11.5,
                        fontWeight: sel ? 500 : 400,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Step 3: Duration + Reminder ───────────────────────────────── */}
          <div style={{ minWidth: '100%', padding: '0 18px' }}>
            <Ser size={28}>
              {STEP_TITLES[2]}
            </Ser>

            <div style={{ marginTop: 22 }}>
              <Eye size={10} style={{ marginBottom: 12 }}>Cieľová doba</Eye>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {DURATIONS.map((g) => {
                  const sel = duration === g;
                  return (
                    <button
                      key={g}
                      onClick={() => setDuration(g)}
                      style={{
                        all: 'unset',
                        cursor: 'pointer',
                        padding: '18px 12px',
                        textAlign: 'center' as const,
                        borderRadius: 14,
                        background: sel ? NM.TERRA : '#fff',
                        color: sel ? '#fff' : NM.DEEP,
                        border: `1.5px solid ${sel ? NM.TERRA : NM.HAIR}`,
                        fontFamily: NM.SERIF,
                        fontSize: 18,
                        fontWeight: 500,
                        letterSpacing: '-0.01em',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 28, background: '#fff', borderRadius: 16, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
              <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${NM.HAIR}` }}>
                <div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 13.5, color: NM.DEEP, fontWeight: 500 }}>Čas pripomienky</div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 2 }}>Kedy počas dňa</div>
                </div>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  style={{
                    border: 'none', outline: 'none', background: 'transparent',
                    fontFamily: NM.SERIF, fontSize: 18, color: NM.TERRA,
                    fontWeight: 500, letterSpacing: '-0.01em', textAlign: 'right' as const,
                  }}
                />
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 13.5, color: NM.DEEP, fontWeight: 500 }}>Notifikácia</div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 2 }}>Pripomenúť v čase</div>
                </div>
                <button
                  onClick={() => setReminderOn((v) => !v)}
                  aria-label="Pripomienka"
                  style={{
                    all: 'unset', cursor: 'pointer',
                    width: 44, height: 26, borderRadius: 999,
                    background: reminderOn ? NM.TERRA : NM.HAIR_2,
                    position: 'relative', transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 3,
                    left: reminderOn ? 21 : 3,
                    width: 20, height: 20, borderRadius: 999,
                    background: '#fff', transition: 'left 0.2s',
                    boxShadow: '0 1px 4px rgba(61,41,33,0.18)',
                  }} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        padding: '16px 18px calc(env(safe-area-inset-bottom) + 20px)',
        background: 'linear-gradient(to top, #FAF7F2 70%, transparent)',
      }}>
        <button
          onClick={step < 3 ? handleNext : handleSave}
          disabled={saving}
          style={{
            all: 'unset', cursor: saving ? 'wait' : 'pointer',
            display: 'block', width: '100%', boxSizing: 'border-box',
            textAlign: 'center' as const,
            padding: '16px',
            borderRadius: 999,
            background: NM.TERRA,
            color: '#fff',
            fontFamily: NM.SANS,
            fontSize: 15,
            fontWeight: 600,
            opacity: saving ? 0.7 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {step < 3 ? 'Pokračovať' : saving ? 'Ukladám…' : 'Uložiť návyk'}
        </button>
      </div>
    </Page>
  );
}
