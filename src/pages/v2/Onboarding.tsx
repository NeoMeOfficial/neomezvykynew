import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Onboarding — R7
 * ----------------------------------------------------------------
 * Six-step editorial flow:
 *   0. Welcome / value props (full-bleed photo, no progress chrome)
 *   1. Life stage / cycle / postpartum
 *   2. Program picker (multi-select)
 *   3. Nutrition add-on upsell decision
 *   4. Nutrition preferences (conditional, only if step 3 chose 'add')
 *   5. Notification consent
 *
 * Step state is in-memory only. On "Hotovo" we navigate to /domov-new
 * and a follow-up PR will persist preferences to user_metadata via
 * useSupabaseAuth.update — flagged in REDESIGN_NOTES.
 *
 * Old multi-page version preserved as Onboarding.old.tsx.
 */

type LifeStage = 'cycle' | 'postpartum' | 'preg' | 'peri' | 'other';
type Diet = 'any' | 'veg' | 'vegan' | 'pesc';
type NutritionChoice = 'add' | 'skip' | null;

interface FlowState {
  life: LifeStage;
  postpartumWeek: number;
  programs: Set<string>;
  nutrition: NutritionChoice;
  diet: Diet;
  allergens: Set<string>;
  notifs: { morning: boolean; reflection: boolean; cycle: boolean; programs: boolean };
}

const initialState: FlowState = {
  life: 'postpartum',
  postpartumWeek: 14,
  programs: new Set(['body-forming']),
  nutrition: null,
  diet: 'any',
  allergens: new Set(['laktoza']),
  notifs: { morning: true, reflection: true, cycle: true, programs: false },
};

// ─── Shared atoms ──────────────────────────────────────────────
function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 22 : 6,
            height: 4,
            borderRadius: 2,
            background: i <= current ? NM.DEEP : NM.HAIR_2,
            transition: 'width .3s',
          }}
        />
      ))}
    </div>
  );
}

interface ShellProps {
  step: number;
  totalSteps: number;
  onBack?: () => void;
  children: ReactNode;
  bg?: string;
}

function Shell({ step, totalSteps, onBack, children, bg = NM.BG }: ShellProps) {
  return (
    <div style={{ background: bg, minHeight: '100vh', position: 'relative', paddingBottom: 140, fontFamily: NM.SANS, color: NM.DEEP }}>
      <div style={{ padding: '60px 22px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        {onBack ? (
          <button
            onClick={onBack}
            aria-label="Späť"
            style={{
              all: 'unset',
              cursor: 'pointer',
              width: 36,
              height: 36,
              borderRadius: 999,
              background: '#fff',
              border: `1px solid ${NM.HAIR}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : (
          <div style={{ width: 36 }} />
        )}
        <div style={{ flex: 1 }}>
          <ProgressDots current={step} total={totalSteps} />
        </div>
        <div style={{ width: 36, textAlign: 'right' }}>
          <span style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, fontWeight: 400 }}>{step + 1}/{totalSteps}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

interface CTAProps {
  label: string;
  onClick: () => void;
  sub?: string;
  skipLabel?: string;
  onSkip?: () => void;
  dark?: boolean;
}

function CTA({ label, onClick, sub, skipLabel, onSkip, dark = false }: CTAProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '18px 22px 28px',
        background: dark
          ? 'linear-gradient(180deg, rgba(42,26,20,0) 0%, rgba(42,26,20,0.85) 60%, rgba(42,26,20,1) 100%)'
          : 'linear-gradient(180deg, rgba(248,245,240,0) 0%, rgba(248,245,240,0.95) 40%, rgba(248,245,240,1) 100%)',
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: '100%',
          padding: '16px',
          background: dark ? '#fff' : NM.DEEP,
          color: dark ? NM.DEEP : '#fff',
          border: 'none',
          borderRadius: 999,
          fontFamily: NM.SANS,
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: '0.02em',
          cursor: 'pointer',
        }}
      >
        {label}
      </button>
      {sub && (
        <div style={{ textAlign: 'center', marginTop: 10, fontFamily: NM.SANS, fontSize: 11, color: dark ? 'rgba(255,255,255,0.55)' : NM.TERTIARY, fontWeight: 400 }}>
          {sub}
        </div>
      )}
      {skipLabel && onSkip && (
        <button
          onClick={onSkip}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'block',
            width: '100%',
            textAlign: 'center',
            marginTop: 14,
            fontFamily: NM.SANS,
            fontSize: 12,
            color: dark ? 'rgba(255,255,255,0.6)' : NM.MUTED,
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            fontWeight: 400,
          }}
        >
          {skipLabel}
        </button>
      )}
    </div>
  );
}

// ─── Step 0 · Welcome ─────────────────────────────────────────
function StepWelcome({ onContinue, onLogin }: { onContinue: () => void; onLogin: () => void }) {
  const items = [
    { n: '01', t: 'Telo', d: 'Cvičenia od postpartum po silu' },
    { n: '02', t: 'Strava', d: 'Receptúry, plány, doplnky k cyklu' },
    { n: '03', t: 'Myseľ', d: 'Meditácie, denník, reflexia' },
    { n: '04', t: 'Cyklus', d: 'Fázy, nálady, intuitívne odporúčania' },
  ];
  return (
    <div
      style={{
        background: NM.DEEP_2,
        minHeight: '100vh',
        position: 'relative',
        backgroundImage: `linear-gradient(180deg, rgba(42,26,20,0.2) 0%, rgba(42,26,20,0.6) 50%, ${NM.DEEP_2} 100%), url(/images/r9/lifestyle-mother-baby.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        paddingBottom: 180,
        fontFamily: NM.SANS,
      }}
    >
      <div style={{ padding: '68px 22px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: NM.SERIF, fontSize: 18, fontStyle: 'italic', fontWeight: 500, color: '#fff', letterSpacing: '-0.01em' }}>NeoMe</span>
      </div>
      <div style={{ position: 'absolute', bottom: 180, left: 0, right: 0, padding: '0 22px' }}>
        <Eye color="rgba(255,255,255,0.65)" size={10}>Vitaj v NeoMe</Eye>
        <Ser size={40} color="#fff" style={{ marginTop: 12, letterSpacing: '-0.02em' }}>
          Tvoja cesta
          <br />
          <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>späť k sebe.</em>
        </Ser>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map((i) => (
            <div key={i.n} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <div style={{ fontFamily: NM.SERIF, fontSize: 12, color: NM.GOLD, fontStyle: 'italic', width: 18, fontWeight: 400 }}>{i.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: '#fff', letterSpacing: '-0.005em' }}>{i.t}</div>
                <div style={{ fontFamily: NM.SANS, fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 1, fontWeight: 300 }}>{i.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '18px 22px 28px' }}>
        <button
          onClick={onContinue}
          style={{
            width: '100%',
            padding: '16px',
            background: '#fff',
            color: NM.DEEP,
            border: 'none',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.02em',
            cursor: 'pointer',
          }}
        >
          Začať cestu
        </button>
        <div style={{ textAlign: 'center', marginTop: 14, fontFamily: NM.SANS, fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 400 }}>
          Už máš účet?{' '}
          <button onClick={onLogin} style={{ all: 'unset', cursor: 'pointer', color: '#fff', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Prihlás sa
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1 · Cycle / postpartum ───────────────────────────────
function StepCycle({ state, setState, onContinue, onBack }: { state: FlowState; setState: (s: FlowState) => void; onContinue: () => void; onBack: () => void }) {
  const options: { k: LifeStage; t: string; d: string; c: string }[] = [
    { k: 'cycle', t: 'Mám pravidelný cyklus', d: 'Menštruácia, ovulácia, luteálna fáza', c: NM.MAUVE },
    { k: 'postpartum', t: 'Som po pôrode', d: 'Postpartum · prvé týždne aj mesiace', c: NM.SAGE },
    { k: 'preg', t: 'Som tehotná', d: 'Trimester · jemné cvičenia', c: NM.TERRA },
    { k: 'peri', t: 'Perimenopauza / menopauza', d: 'Hormóny v zmene · jemnejší režim', c: NM.GOLD },
    { k: 'other', t: 'Niečo iné', d: 'Nastav si sama', c: NM.DUSTY },
  ];

  return (
    <Shell step={1} totalSteps={6} onBack={onBack}>
      <div style={{ padding: '0 22px' }}>
        <Eye>Životná fáza</Eye>
        <Ser size={30} style={{ marginTop: 10 }}>
          Ako sa <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>teraz cítiš?</em>
        </Ser>
        <Body style={{ marginTop: 10 }}>Podľa tvojej fázy prispôsobíme obsah — od jemného postpartum po plný cyklus.</Body>
      </div>
      <div style={{ padding: '28px 22px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map((opt) => {
          const active = state.life === opt.k;
          return (
            <div
              key={opt.k}
              onClick={() => setState({ ...state, life: opt.k })}
              style={{
                padding: '16px 18px',
                background: active ? '#fff' : 'rgba(255,255,255,0.5)',
                borderRadius: 16,
                border: active ? `1.5px solid ${opt.c}` : `1px solid ${NM.HAIR}`,
                boxShadow: active ? `0 8px 22px rgba(61,41,33,0.08)` : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  border: active ? `6px solid ${opt.c}` : `1.5px solid ${NM.HAIR_2}`,
                  background: '#fff',
                  flexShrink: 0,
                  transition: 'all .15s',
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 14, fontWeight: 500, color: NM.DEEP }}>{opt.t}</div>
                <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 2, fontWeight: 400 }}>{opt.d}</div>
              </div>
            </div>
          );
        })}
      </div>
      {state.life === 'postpartum' && (
        <div style={{ margin: '16px 22px 0', padding: '18px 20px', background: `${NM.SAGE}10`, border: `1px solid ${NM.SAGE}30`, borderRadius: 18 }}>
          <Eye color={NM.SAGE} size={10}>Postpartum — ktorý týždeň?</Eye>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: NM.SERIF, fontSize: 42, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.02em' }}>{state.postpartumWeek}</span>
            <span style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, fontWeight: 400 }}>týždeň od pôrodu</span>
          </div>
          <input
            type="range"
            min={0}
            max={52}
            value={state.postpartumWeek}
            onChange={(e) => setState({ ...state, postpartumWeek: Number(e.target.value) })}
            style={{ width: '100%', marginTop: 14, accentColor: NM.SAGE }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <Body size={10} color={NM.TERTIARY}>0 týždňov</Body>
            <Body size={10} color={NM.TERTIARY}>52+</Body>
          </div>
        </div>
      )}
      <CTA label="Pokračovať" onClick={onContinue} />
    </Shell>
  );
}

// ─── Step 2 · Programs ────────────────────────────────────────
function StepPrograms({ state, setState, onContinue, onBack, onSkip }: { state: FlowState; setState: (s: FlowState) => void; onContinue: () => void; onBack: () => void; onSkip: () => void }) {
  const programs = [
    { k: 'postpartum', t: 'Postpartum', sub: '12 týždňov · jemné obnovenie', img: 'program-postpartum.jpg', c: NM.SAGE },
    { k: 'body-forming', t: 'BodyForming', sub: '8 týždňov · sila a tonus', img: 'program-body-forming.jpg', c: NM.TERRA },
    { k: 'hormon', t: 'Hormón v rovnováhe', sub: '6 týždňov · s cyklom', img: 'program-hormonal.jpg', c: NM.MAUVE },
    { k: 'pokoj', t: 'Pokoj v hlave', sub: '4 týždne · meditácie a dych', img: 'program-mindful.jpg', c: NM.DUSTY },
  ];
  const toggle = (k: string) => {
    const next = new Set(state.programs);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setState({ ...state, programs: next });
  };

  return (
    <Shell step={2} totalSteps={6} onBack={onBack}>
      <div style={{ padding: '0 22px' }}>
        <Eye>Tvoj program</Eye>
        <Ser size={30} style={{ marginTop: 10 }}>
          Vyber si <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>kam začať</em>
        </Ser>
        <Body style={{ marginTop: 10 }}>Môžeš začať aj s viacerými. Nie je to definitívne — kedykoľvek zmeníš.</Body>
      </div>
      <div style={{ padding: '28px 22px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {programs.map((p) => {
          const active = state.programs.has(p.k);
          return (
            <div
              key={p.k}
              onClick={() => toggle(p.k)}
              style={{
                position: 'relative',
                borderRadius: 18,
                overflow: 'hidden',
                height: 96,
                backgroundImage: `url(/images/r9/${p.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: active ? `2px solid ${p.c}` : '2px solid transparent',
                boxShadow: active ? `0 10px 26px rgba(61,41,33,0.15)` : 'none',
                cursor: 'pointer',
                transition: 'all .15s',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(42,26,20,0.75) 0%, rgba(42,26,20,0.35) 60%, rgba(42,26,20,0.15) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    border: active ? 'none' : '1.5px solid rgba(255,255,255,0.7)',
                    background: active ? p.c : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {active && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, color: '#fff', letterSpacing: '-0.005em' }}>{p.t}</div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 11, color: 'rgba(255,255,255,0.72)', marginTop: 2, fontWeight: 400 }}>{p.sub}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <CTA label="Pokračovať" onClick={onContinue} skipLabel="Vyberiem si neskôr" onSkip={onSkip} />
    </Shell>
  );
}

// ─── Step 3 · Nutrition upsell ─────────────────────────────────
function StepNutritionUpsell({ state, setState, onContinue, onBack }: { state: FlowState; setState: (s: FlowState) => void; onContinue: () => void; onBack: () => void }) {
  return (
    <Shell step={3} totalSteps={6} onBack={onBack}>
      <div style={{ padding: '0 22px' }}>
        <Eye>Výživa (voliteľné)</Eye>
        <Ser size={30} style={{ marginTop: 10 }}>
          Chceš aj <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>Jedálniček?</em>
        </Ser>
        <Body style={{ marginTop: 10 }}>
          Plán jedál na týždeň s receptami, makrami a nákupným zoznamom — zladený s tvojou fázou cyklu a potrebami.
        </Body>
      </div>
      <div style={{ margin: '28px 22px 0' }}>
        <div
          onClick={() => setState({ ...state, nutrition: 'add' })}
          style={{
            padding: '22px 20px',
            background: '#fff',
            borderRadius: 22,
            border: state.nutrition === 'add' ? `2px solid ${NM.GOLD}` : `1px solid ${NM.HAIR}`,
            boxShadow: state.nutrition === 'add' ? `0 14px 34px rgba(184,134,74,0.18)` : '0 8px 22px rgba(61,41,33,0.06)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 999, background: `${NM.GOLD}14` }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Eye color={NM.GOLD} size={10}>Odporúčané</Eye>
              <div style={{ padding: '3px 8px', background: `${NM.GOLD}20`, borderRadius: 999, fontFamily: NM.SANS, fontSize: 9, color: NM.GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}>+57 €</div>
            </div>
            <Ser size={22} style={{ marginBottom: 6 }}>Pridať Jedálniček</Ser>
            <Body size={12.5} style={{ marginBottom: 14 }}>Jednorazový poplatok · navždy tvoj</Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Týždenné plány s receptami (cca 4–6 jedál denne)',
                'Makrá, nákupný zoznam, rešpekt k alergénom',
                'Plán podľa cyklu a postpartum fázy',
                'Kojaciemu režimu prispôsobené porcie',
              ].map((li) => (
                <div key={li} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 999, background: `${NM.GOLD}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={NM.GOLD} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <Body size={12} color={NM.DEEP} weight={400} style={{ lineHeight: 1.5 }}>{li}</Body>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          onClick={() => setState({ ...state, nutrition: 'skip' })}
          style={{
            marginTop: 12,
            padding: '16px 18px',
            background: state.nutrition === 'skip' ? '#fff' : 'transparent',
            border: state.nutrition === 'skip' ? `1.5px solid ${NM.DEEP}` : `1px solid ${NM.HAIR_2}`,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              border: state.nutrition === 'skip' ? `6px solid ${NM.DEEP}` : `1.5px solid ${NM.HAIR_2}`,
              background: '#fff',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: NM.SANS, fontSize: 14, fontWeight: 500, color: NM.DEEP }}>Zatiaľ nie</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 1, fontWeight: 400 }}>Môžeš pridať kedykoľvek z Profilu</div>
          </div>
        </div>
      </div>
      <CTA label={state.nutrition === 'add' ? 'Pridať a pokračovať' : 'Pokračovať'} onClick={onContinue} />
    </Shell>
  );
}

// ─── Step 4 · Nutrition prefs (conditional) ────────────────────
function StepNutritionPrefs({ state, setState, onContinue, onBack, onSkip }: { state: FlowState; setState: (s: FlowState) => void; onContinue: () => void; onBack: () => void; onSkip: () => void }) {
  const diets: { k: Diet; t: string }[] = [
    { k: 'any', t: 'Bez obmedzení' },
    { k: 'veg', t: 'Vegetariánska' },
    { k: 'vegan', t: 'Vegánska' },
    { k: 'pesc', t: 'Pescetariánska' },
  ];
  const allergens = [
    { k: 'laktoza', t: 'Laktóza' },
    { k: 'gluten', t: 'Lepok' },
    { k: 'orechy', t: 'Orechy' },
    { k: 'vajce', t: 'Vajcia' },
    { k: 'soya', t: 'Sója' },
    { k: 'ryby', t: 'Ryby' },
  ];
  const toggleAllergen = (k: string) => {
    const next = new Set(state.allergens);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    setState({ ...state, allergens: next });
  };

  return (
    <Shell step={4} totalSteps={6} onBack={onBack}>
      <div style={{ padding: '0 22px' }}>
        <Eye>Výživa — preferencie</Eye>
        <Ser size={28} style={{ marginTop: 10 }}>
          Ako <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>ješ?</em>
        </Ser>
        <Body style={{ marginTop: 10 }}>Dopracujeme recepty tak, aby ti chutili — a nezaťažovali.</Body>
      </div>
      <div style={{ padding: '24px 22px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Strava</Eye>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {diets.map((d) => {
            const active = state.diet === d.k;
            return (
              <div
                key={d.k}
                onClick={() => setState({ ...state, diet: d.k })}
                style={{
                  padding: '16px 14px',
                  background: active ? '#fff' : 'rgba(255,255,255,0.5)',
                  borderRadius: 16,
                  border: active ? `1.5px solid ${NM.GOLD}` : `1px solid ${NM.HAIR}`,
                  boxShadow: active ? `0 8px 22px rgba(184,134,74,0.12)` : 'none',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                <div style={{ fontFamily: NM.SANS, fontSize: 12.5, fontWeight: 500, color: NM.DEEP }}>{d.t}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '24px 22px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>Alergény / vylúčené</Eye>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {allergens.map((a) => {
            const active = state.allergens.has(a.k);
            return (
              <div
                key={a.k}
                onClick={() => toggleAllergen(a.k)}
                style={{
                  padding: '10px 16px',
                  background: active ? NM.DEEP : '#fff',
                  border: active ? '1px solid transparent' : `1px solid ${NM.HAIR_2}`,
                  borderRadius: 999,
                  fontFamily: NM.SANS,
                  fontSize: 12.5,
                  color: active ? '#fff' : NM.DEEP,
                  fontWeight: 400,
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                {a.t}
              </div>
            );
          })}
        </div>
      </div>
      <CTA label="Pokračovať" onClick={onContinue} skipLabel="Nastavím neskôr v Profile" onSkip={onSkip} />
    </Shell>
  );
}

// ─── Step 5 · Notifications ────────────────────────────────────
function StepNotifs({ state, setState, onFinish, onBack, onSkip }: { state: FlowState; setState: (s: FlowState) => void; onFinish: () => void; onBack: () => void; onSkip: () => void }) {
  const items = [
    { k: 'morning', t: 'Ranný pozdrav', d: 'Každé ráno krátka myšlienka a plán dňa', time: '7:30', c: NM.TERRA },
    { k: 'reflection', t: 'Večerná reflexia', d: 'Tri vety pred spaním · denník', time: '21:00', c: NM.MAUVE },
    { k: 'cycle', t: 'Cyklus a fázy', d: 'Predpoveď začiatku a zmeny nálady', time: null, c: NM.DUSTY },
    { k: 'programs', t: 'Program pripomienky', d: 'Keď má v pláne cvičenie alebo meditácia', time: null, c: NM.SAGE },
  ] as const;
  const tog = (k: keyof FlowState['notifs']) => setState({ ...state, notifs: { ...state.notifs, [k]: !state.notifs[k] } });

  return (
    <Shell step={5} totalSteps={6} onBack={onBack}>
      <div style={{ padding: '0 22px' }}>
        <Eye>Upozornenia</Eye>
        <Ser size={30} style={{ marginTop: 10 }}>
          Tíško, <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>len keď treba.</em>
        </Ser>
        <Body style={{ marginTop: 10 }}>Vyber si, čo ťa má pohladiť. Všetko vypínaš kedykoľvek.</Body>
      </div>
      <div style={{ padding: '28px 22px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item) => {
          const on = state.notifs[item.k];
          return (
            <div
              key={item.k}
              style={{ padding: '16px 18px', background: '#fff', borderRadius: 16, border: `1px solid ${NM.HAIR}`, display: 'flex', alignItems: 'center', gap: 14 }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${item.c}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: 999, background: item.c }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 13.5, color: NM.DEEP, fontWeight: 500 }}>
                  {item.t}
                  {item.time && <span style={{ marginLeft: 8, fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, fontWeight: 400 }}>{item.time}</span>}
                </div>
                <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 2, fontWeight: 400 }}>{item.d}</div>
              </div>
              <div
                onClick={() => tog(item.k)}
                style={{
                  width: 40,
                  height: 24,
                  borderRadius: 999,
                  background: on ? NM.DEEP : NM.HAIR_2,
                  position: 'relative',
                  transition: 'all .2s',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: on ? 18 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: 999,
                    background: '#fff',
                    transition: 'all .2s',
                    boxShadow: '0 2px 4px rgba(61,41,33,0.18)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <CTA label="Hotovo" onClick={onFinish} skipLabel="Vypnúť všetky" onSkip={onSkip} />
    </Shell>
  );
}

// ─── Main flow ────────────────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FlowState>(initialState);

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    // FEATURE: persist FlowState to user_metadata via SupabaseAuthProvider.update
    // For now we just route to the home — the redesign visual is the deliverable.
    navigate('/domov-new');
  };

  // Conditional skip: if nutrition === 'skip', skip step 4 (prefs)
  const handleAfterNutritionUpsell = () => {
    if (state.nutrition === 'skip') {
      setStep(5);
    } else {
      // Default to 'skip' if user pressed continue without picking
      if (state.nutrition === null) setState({ ...state, nutrition: 'skip' });
      setStep(state.nutrition === 'add' ? 4 : 5);
    }
  };

  switch (step) {
    case 0:
      return <StepWelcome onContinue={next} onLogin={() => navigate('/auth')} />;
    case 1:
      return <StepCycle state={state} setState={setState} onContinue={next} onBack={back} />;
    case 2:
      return <StepPrograms state={state} setState={setState} onContinue={next} onBack={back} onSkip={next} />;
    case 3:
      return <StepNutritionUpsell state={state} setState={setState} onContinue={handleAfterNutritionUpsell} onBack={back} />;
    case 4:
      return <StepNutritionPrefs state={state} setState={setState} onContinue={() => setStep(5)} onBack={() => setStep(3)} onSkip={() => setStep(5)} />;
    case 5:
      return <StepNotifs state={state} setState={setState} onFinish={finish} onBack={() => setStep(state.nutrition === 'add' ? 4 : 3)} onSkip={() => { setState({ ...state, notifs: { morning: false, reflection: false, cycle: false, programs: false } }); finish(); }} />;
    default:
      return null;
  }
}
