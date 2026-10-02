import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { NM } from './neome';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';

/**
 * First-run tour (Sam 2026-10-02): new users get a short, calm
 * walkthrough of the four pillars instead of being dropped onto a full
 * home screen — "step by step, no overwhelm". Shows once per device
 * for accounts younger than 14 days; a tap on Preskočiť or finishing
 * marks it done. Portal to document.body (BottomNav would cover it).
 */

const DONE_KEY = 'neome_tour_done_v1';
const NEW_ACCOUNT_DAYS = 14;

interface Step {
  eyebrow: string;
  accent: string;
  title: string;
  text: string;
}

const STEPS: Step[] = [
  {
    eyebrow: 'Vitaj',
    accent: NM.GOLD,
    title: 'Vitaj v NeoMe.',
    text: 'Všetko tu je nastavené tak, aby si mohla ísť vlastným tempom — nič nemusíš stihnúť naraz. Poď sa na chvíľu pozrieť, čo kde nájdeš.',
  },
  {
    eyebrow: 'Telo',
    accent: NM.TERRA,
    title: 'Cvičenie, ktoré sa prispôsobí tebe.',
    text: 'V sekcii Telo nájdeš cvičebné programy aj knižnicu kratších cvičení. Keď si spustíš program, každý deň ťa na domovskej obrazovke čaká tvoje video.',
  },
  {
    eyebrow: 'Strava',
    accent: NM.SAGE,
    title: 'Recepty zladené s tvojím cyklom.',
    text: 'Každý deň ti vyberieme recept, ktorý sadne fáze tvojho cyklu. V sekcii Strava je celá knižnica receptov — podľa kategórií, času aj chuti.',
  },
  {
    eyebrow: 'Myseľ & Periodka',
    accent: NM.MAUVE,
    title: 'Pokoj pre hlavu, prehľad o cykle.',
    text: 'Meditácie a denník ti pomôžu spomaliť. Periodka sleduje tvoj cyklus a appka podľa neho ladí odporúčania — cvičenie, stravu aj starostlivosť o seba.',
  },
  {
    eyebrow: 'Domov',
    accent: NM.GOLD,
    title: 'Každý deň pripravený pre teba.',
    text: 'Domovská obrazovka ti každé ráno ponúkne dnešný výber — cvičenie, recept aj tip pre myseľ. Všetko ostatné (nastavenia, body, predplatné) nájdeš v Profile.',
  },
];

export default function OnboardingTour() {
  const { user } = useSupabaseAuth();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(DONE_KEY)) return;
    } catch { return; }
    if (!user?.created_at) return;
    const ageDays = (Date.now() - new Date(user.created_at).getTime()) / 86400000;
    if (ageDays > NEW_ACCOUNT_DAYS) {
      // Long-standing account on a fresh device — don't re-onboard.
      try { localStorage.setItem(DONE_KEY, 'skipped-existing'); } catch { /* ignore */ }
      return;
    }
    setVisible(true);
  }, [user?.created_at]);

  if (!visible) return null;

  const finish = (how: 'done' | 'skipped') => {
    try { localStorage.setItem(DONE_KEY, how); } catch { /* ignore */ }
    setVisible(false);
  };

  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Zoznámenie s aplikáciou"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(42,26,20,0.45)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: 440, margin: '0 10px',
          background: NM.BG, borderRadius: '22px 22px 0 0',
          padding: '26px 22px calc(env(safe-area-inset-bottom) + 22px)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ fontFamily: NM.SANS, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: s.accent, fontWeight: 600, marginBottom: 8 }}>
          {s.eyebrow}
        </div>
        <div style={{ fontFamily: NM.SERIF, fontSize: 24, fontWeight: 500, color: NM.DEEP, lineHeight: 1.2, marginBottom: 10 }}>
          {s.title}
        </div>
        <div style={{ fontFamily: NM.SANS, fontSize: 14.5, color: NM.MUTED, lineHeight: 1.6, minHeight: 92 }}>
          {s.text}
        </div>

        <div style={{ display: 'flex', gap: 6, margin: '18px 0 20px' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                height: 4, borderRadius: 999, flex: i === step ? 2.4 : 1,
                background: i <= step ? s.accent : NM.HAIR_2,
                transition: 'flex 0.25s ease, background 0.25s ease',
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <button
            onClick={() => finish('skipped')}
            style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 13, color: NM.TERTIARY, padding: '10px 6px' }}
          >
            Preskočiť
          </button>
          <div style={{ display: 'flex', gap: 10 }}>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 13.5, fontWeight: 500, color: NM.DEEP, padding: '11px 16px', borderRadius: 999, border: `1px solid ${NM.HAIR_2}` }}
              >
                Späť
              </button>
            )}
            <button
              onClick={() => (last ? finish('done') : setStep(step + 1))}
              style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 13.5, fontWeight: 500, color: '#fff', background: NM.DEEP, padding: '11px 22px', borderRadius: 999 }}
            >
              {last ? 'Poďme na to' : 'Ďalej'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
