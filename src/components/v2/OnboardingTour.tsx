import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { NM } from './neome';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';

/**
 * Two-level onboarding (Sam 2026-10-02).
 *
 * Level 1 — first home visit for accounts younger than 14 days: calm
 * walkthrough of the pillars, ending with "install as app" (the step
 * people would otherwise miss). The last step offers "Ukáž mi viac" —
 * the longer version — which continues straight into the extended
 * topics.
 *
 * Level 2 — from the NEXT day, a quiet home card (TourNudge) offers
 * whichever extended topics she hasn't seen yet: points, contacting
 * Gabi, the affiliate program, install-as-app last. Topics are tracked
 * individually, so nothing ever repeats; the card is permanently
 * dismissible.
 *
 * State is device-local (localStorage, Sam: fine for now — improve to
 * profile sync later). Portal to document.body (BottomNav cover rule).
 */

const STATE_KEY = 'neome_tour_v2';
const LEGACY_DONE_KEY = 'neome_tour_done_v1';
const NEW_ACCOUNT_DAYS = 14;

type TopicKey = 'points' | 'contact' | 'affiliate' | 'install';

interface TourState {
  core: 'done' | 'skipped' | null;
  topics: Partial<Record<TopicKey, boolean>>;
  completedAt: string | null;
  nudgeDismissed: boolean;
}

function loadState(): TourState {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return JSON.parse(raw);
    // Migrate users who finished the v1 single-level tour: core is done,
    // extended topics still unseen — the nudge picks them up tomorrow.
    const legacy = localStorage.getItem(LEGACY_DONE_KEY);
    if (legacy) {
      const migrated: TourState = {
        core: legacy === 'skipped' ? 'skipped' : 'done',
        topics: {},
        completedAt: new Date().toISOString(),
        nudgeDismissed: false,
      };
      localStorage.setItem(STATE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch { /* ignore */ }
  return { core: null, topics: {}, completedAt: null, nudgeDismissed: false };
}

function saveState(st: TourState) {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(st)); } catch { /* ignore */ }
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS(): boolean {
  return typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent);
}

interface Step {
  key?: TopicKey;
  eyebrow: string;
  accent: string;
  title: string;
  text: string;
  cta?: { label: string; to: string };
}

const INSTALL_STEP: Step = {
  key: 'install',
  eyebrow: 'Appka na ploche',
  accent: NM.GOLD,
  title: 'Maj NeoMe vždy po ruke.',
  text: '',
};

function installText(): string {
  return isIOS()
    ? 'NeoMe si pridáš na plochu ako appku: dole v Safari ťukni na Zdieľať (štvorček so šípkou) a vyber „Pridať na plochu“. Odvtedy sa otvára jedným ťuknutím, ako každá iná appka.'
    : 'NeoMe si nainštaluješ ako appku: v prehliadači otvor menu (⋮ vpravo hore) a vyber „Inštalovať aplikáciu“ alebo „Pridať na plochu“. Odvtedy sa otvára jedným ťuknutím, ako každá iná appka.';
}

const CORE_STEPS: Step[] = [
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
    eyebrow: 'Myseľ',
    accent: NM.DUSTY,
    title: 'Pokoj pre hlavu.',
    text: 'Meditácie a denník ti pomôžu spomaliť a všimnúť si, ako sa máš. Stačí pár minút — aj jedna odpoveď v denníku sa počíta.',
  },
  {
    eyebrow: 'Periodka',
    accent: NM.MAUVE,
    title: 'Tvoj cyklus, tvoj kompas.',
    text: 'Zaznač si periódu a symptómy — Periodka sa naučí tvoj rytmus, predpovie ďalšie dni a celá appka podľa tvojej fázy ladí cvičenie, recepty aj starostlivosť o seba.',
  },
  {
    eyebrow: 'Domov',
    accent: NM.GOLD,
    title: 'Každý deň pripravený pre teba.',
    text: 'Domovská obrazovka ti každé ráno ponúkne dnešný výber — cvičenie, recept aj tip pre myseľ. Všetko ostatné (nastavenia, body, predplatné) nájdeš v Profile.',
  },
];

const TOPIC_STEPS: Step[] = [
  {
    key: 'points',
    eyebrow: 'Body',
    accent: NM.GOLD,
    title: 'Za starostlivosť o seba zbieraš body.',
    text: 'Dokončené cvičenie, denník, záznam cyklu či návyk — každá z týchto vecí ti pridá body. Nazbierané body vymeníš za skutočné odmeny, napríklad zľavy alebo mesiac Plus. Svoj zostatok vidíš hore na domovskej pri hviezdičke.',
    cta: { label: 'Pozrieť moje body', to: '/body' },
  },
  {
    key: 'contact',
    eyebrow: 'Sme tu pre teba',
    accent: NM.SAGE,
    title: 'Gabi je na jednu správu ďaleko.',
    text: 'Keď si nebudeš istá — cvičením, receptom, čímkoľvek — napíš nám priamo v appke cez Správy, alebo na klientky@neome.com.au. Odpovedáme my, nie robot.',
    cta: { label: 'Otvoriť Správy', to: '/spravy' },
  },
  {
    key: 'affiliate',
    eyebrow: 'Partnerský program',
    accent: NM.TERRA,
    title: 'Odporúčaj NeoMe a zarábaj.',
    text: 'Máš okolo seba ženy, ktorým by NeoMe sadlo? V partnerskom programe dostaneš vlastný kód a z každej platby odporúčanej používateľky ti patrí provízia. Napíš nám a pozrieme sa na to spolu.',
    cta: { label: 'Napísať nám', to: '/spravy' },
  },
];

function buildCoreSteps(): Step[] {
  const steps = [...CORE_STEPS];
  if (!isStandalone()) steps.push({ ...INSTALL_STEP, text: installText() });
  return steps;
}

function buildTopicSteps(st: TourState): Step[] {
  const steps = TOPIC_STEPS.filter((t) => !st.topics[t.key as TopicKey]);
  if (!isStandalone() && !st.topics.install) steps.push({ ...INSTALL_STEP, text: installText() });
  return steps;
}

function TourSheet({ steps, onFinish, onMore, onTopicSeen }: {
  steps: Step[];
  onFinish: (how: 'done' | 'skipped') => void;
  /** Present only on the core run — the "Ukáž mi viac" longer version. */
  onMore?: () => void;
  onTopicSeen?: (key: TopicKey) => void;
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const s = steps[step];
  const last = step === steps.length - 1;

  // A displayed topic counts as seen — it never repeats in level 2.
  useEffect(() => {
    if (s?.key && onTopicSeen) onTopicSeen(s.key);
  }, [s?.key, onTopicSeen]);

  if (!s) return null;

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
          {s.cta && (
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => { onFinish('done'); navigate(s.cta!.to); }}
                style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 13, fontWeight: 500, color: s.accent, textDecoration: 'underline', textUnderlineOffset: 3 }}
              >
                {s.cta.label} →
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 6, margin: '18px 0 20px' }}>
          {steps.map((_, i) => (
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
            onClick={() => onFinish('skipped')}
            style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 13, color: NM.TERTIARY, padding: '10px 6px' }}
          >
            Preskočiť
          </button>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 13.5, fontWeight: 500, color: NM.DEEP, padding: '11px 16px', borderRadius: 999, border: `1px solid ${NM.HAIR_2}` }}
              >
                Späť
              </button>
            )}
            {last && onMore && (
              <button
                onClick={onMore}
                style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 13.5, fontWeight: 500, color: NM.DEEP, padding: '11px 16px', borderRadius: 999, border: `1px solid ${NM.HAIR_2}` }}
              >
                Ukáž mi viac
              </button>
            )}
            <button
              onClick={() => (last ? onFinish('done') : setStep(step + 1))}
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

export default function OnboardingTour() {
  const { user } = useSupabaseAuth();
  const [state, setState] = useState<TourState | null>(null);
  const [mode, setMode] = useState<'core' | 'topics' | null>(null);

  useEffect(() => {
    if (!user?.created_at) return;
    const st = loadState();
    setState(st);
    if (st.core) return;
    const ageDays = (Date.now() - new Date(user.created_at).getTime()) / 86400000;
    if (ageDays > NEW_ACCOUNT_DAYS) {
      // Long-standing account on a fresh device — don't re-onboard.
      const next: TourState = { ...st, core: 'skipped', completedAt: new Date().toISOString(), nudgeDismissed: true };
      saveState(next);
      setState(next);
      return;
    }
    setMode('core');
  }, [user?.created_at]);

  const update = (patch: Partial<TourState>) => {
    setState((prev) => {
      const next = { ...(prev ?? loadState()), ...patch } as TourState;
      saveState(next);
      return next;
    });
  };

  const markTopicSeen = (key: TopicKey) => {
    setState((prev) => {
      const base = prev ?? loadState();
      if (base.topics[key]) return base;
      const next = { ...base, topics: { ...base.topics, [key]: true } };
      saveState(next);
      return next;
    });
  };

  const coreSteps = useMemo(buildCoreSteps, []);
  const topicSteps = useMemo(() => (state ? buildTopicSteps(state) : []), [state, mode]);

  if (mode === 'core') {
    return (
      <TourSheet
        key="core"
        steps={coreSteps}
        onTopicSeen={markTopicSeen}
        onFinish={(how) => {
          update({ core: how, completedAt: new Date().toISOString() });
          setMode(null);
        }}
        onMore={() => {
          update({ core: 'done', completedAt: new Date().toISOString() });
          setMode('topics');
        }}
      />
    );
  }

  if (mode === 'topics' && topicSteps.length > 0) {
    return (
      <TourSheet
        key="topics"
        steps={topicSteps}
        onTopicSeen={markTopicSeen}
        onFinish={() => setMode(null)}
      />
    );
  }

  return null;
}

/**
 * Level-2 nudge — quiet home card from the day after the core tour,
 * offering only the topics the user hasn't seen. Dismiss is forever.
 */
export function TourNudge() {
  const [state, setState] = useState<TourState | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => { setState(loadState()); }, []);

  if (!state || !state.core || state.nudgeDismissed) return null;

  // Not in the same visit — the card waits for the next calendar day.
  const completedDay = state.completedAt ? state.completedAt.slice(0, 10) : null;
  const today = new Date().toISOString().slice(0, 10);
  if (!completedDay || completedDay >= today) return null;

  const remaining = buildTopicSteps(state);
  if (remaining.length === 0) return null;

  const persist = (patch: Partial<TourState>) => {
    const next = { ...state, ...patch } as TourState;
    saveState(next);
    setState(next);
  };

  const markTopicSeen = (key: TopicKey) => {
    setState((prev) => {
      const base = prev ?? loadState();
      if (base.topics[key]) return base;
      const next = { ...base, topics: { ...base.topics, [key]: true } };
      saveState(next);
      return next;
    });
  };

  if (open) {
    return (
      <TourSheet
        key={`nudge-${remaining.length}`}
        steps={remaining}
        onTopicSeen={markTopicSeen}
        onFinish={() => setOpen(false)}
      />
    );
  }

  const tipWord = remaining.length === 1 ? 'krátky tip' : remaining.length <= 4 ? 'krátke tipy' : 'krátkych tipov';

  return (
    <div style={{ padding: '0 18px', marginBottom: 10 }}>
      <div style={{ background: '#fff', borderRadius: 16, border: `1px solid ${NM.HAIR}`, padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: NM.SERIF, fontSize: 15.5, color: NM.DEEP, marginBottom: 2 }}>Spoznaj NeoMe lepšie</div>
          <div style={{ fontFamily: NM.SANS, fontSize: 12.5, color: NM.MUTED }}>Ešte {remaining.length} {tipWord} — minútka čítania.</div>
        </div>
        <button
          onClick={() => setOpen(true)}
          style={{ all: 'unset', cursor: 'pointer', fontFamily: NM.SANS, fontSize: 12.5, fontWeight: 500, color: '#fff', background: NM.DEEP, padding: '9px 15px', borderRadius: 999, flexShrink: 0 }}
        >
          Ukázať
        </button>
        <button
          aria-label="Zavrieť"
          onClick={() => persist({ nudgeDismissed: true })}
          style={{ all: 'unset', cursor: 'pointer', color: NM.TERTIARY, fontSize: 16, padding: 6, lineHeight: 1, flexShrink: 0 }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
