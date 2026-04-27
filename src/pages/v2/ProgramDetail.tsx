import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useActiveProgram } from '../../hooks/useDailyRituals';
import { useToast } from '@/hooks/use-toast';
import { Eye, Ser, Body, PlusTag, NM } from '../../components/v2/neome';

/**
 * Program detail — R9
 *
 * Full-bleed hero, key-stats strip, overview, weekly outline,
 * Mondays-only start picker, primary CTA.
 *
 * Plus: "Aktivovať program · <date>" — wires to existing
 * activate-program flow (FEATURE flagged: writing the chosen Monday
 * to the user's profile).
 *
 * Free: dark editorial Plus card with gold CTA → /paywall.
 *
 * Behavior rule (BC-5): start dates are Mondays only. Picker constructs
 * upcoming Mondays from "today" rather than hardcoding.
 */

function getNextMondays(count = 4, from = new Date()): Date[] {
  const result: Date[] = [];
  const d = new Date(from);
  const dow = d.getDay();
  const offset = dow === 1 ? 0 : (8 - dow) % 7;
  d.setDate(d.getDate() + offset);
  for (let i = 0; i < count; i++) {
    const m = new Date(d);
    m.setDate(d.getDate() + i * 7);
    result.push(m);
  }
  return result;
}

const SK_MONTHS_SHORT = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];

const PROGRAMS: Record<string, { name: string; eyebrowColor?: string; img: string; weeks: number; exercises: number; minPerDay: number; intro: string; outline: { w: string; t: string; d: string }[] }> = {
  postpartum: {
    name: 'Postpartum\nnávrat',
    img: '/images/r9/program-postpartum.jpg',
    weeks: 4,
    exercises: 28,
    minPerDay: 15,
    intro: 'Jemná 4-týždňová cesta späť k tvojmu telu po pôrode. Zameranie na panvové dno, bránicu a hlboký stred.',
    outline: [
      { w: 'Týždeň 1', t: 'Dych a panvové dno', d: '7 krátkych cvičení · 10 min' },
      { w: 'Týždeň 2', t: 'Jemný stred', d: '7 cvičení · 15 min' },
      { w: 'Týždeň 3', t: 'Celotelová aktivácia', d: '7 cvičení · 15 min' },
      { w: 'Týždeň 4', t: 'Sila a návrat', d: '7 cvičení · 20 min' },
    ],
  },
  'body-forming': {
    name: 'BodyForming',
    img: '/images/r9/program-body-forming.jpg',
    weeks: 6,
    exercises: 42,
    minPerDay: 25,
    intro: 'Tonizácia celého tela s dôrazom na držanie. Stredná intenzita, postupný progres.',
    outline: [
      { w: 'Týždeň 1–2', t: 'Aktivácia', d: 'Základné vzorce pohybu · 20 min' },
      { w: 'Týždeň 3–4', t: 'Progres', d: 'Sila a tonus · 25 min' },
      { w: 'Týždeň 5–6', t: 'Celistvosť', d: 'Komplexné okruhy · 30 min' },
    ],
  },
  hormonal: {
    name: 'Hormonálna\njoga',
    img: '/images/r9/program-hormonal.jpg',
    weeks: 4,
    exercises: 24,
    minPerDay: 20,
    intro: 'Joga podporujúca hormonálnu rovnováhu a cyklus. Tempo a intenzita sa prispôsobujú fáze.',
    outline: [
      { w: 'Týždeň 1', t: 'Folikulárna fáza', d: 'Energia a tvorba · 20 min' },
      { w: 'Týždeň 2', t: 'Ovulácia', d: 'Sila a vyjadrenie · 20 min' },
      { w: 'Týždeň 3', t: 'Luteálna fáza', d: 'Spomalenie · 20 min' },
      { w: 'Týždeň 4', t: 'Menštruácia', d: 'Pokoj a obnova · 15 min' },
    ],
  },
  mindful: {
    name: 'Mindful\npohyb',
    img: '/images/r9/program-mindful.jpg',
    weeks: 3,
    exercises: 18,
    minPerDay: 12,
    intro: 'Vnímavý pohyb s dychom pre pokojnú hlavu. Krátke denné jednotky.',
    outline: [
      { w: 'Týždeň 1', t: 'Uzemnenie', d: 'Dych a stred · 10 min' },
      { w: 'Týždeň 2', t: 'Plynutie', d: 'Mäkké zostavy · 12 min' },
      { w: 'Týždeň 3', t: 'Sloboda', d: 'Vlastné variácie · 15 min' },
    ],
  },
};

export default function ProgramDetail() {
  const { programId: slug } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { activateProgram } = useActiveProgram();
  const { toast } = useToast();
  const program = (slug && PROGRAMS[slug]) || PROGRAMS.postpartum;
  const mondays = getNextMondays(4);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [activating, setActivating] = useState(false);

  const onActivate = async () => {
    if (activating || !slug) return;
    setActivating(true);
    const { error } = await activateProgram(slug, mondays[selectedIdx]);
    setActivating(false);
    if (error) {
      toast({ title: 'Aktivácia zlyhala', description: error.message ?? 'Skús to ešte raz.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Program aktivovaný', description: `Začneš v pondelok ${formatMonday(mondays[selectedIdx])}.` });
    navigate('/domov-new');
  };

  const formatMonday = (d: Date) => `${d.getDate()}. ${SK_MONTHS_SHORT[d.getMonth()]}`;
  const formatFull = (d: Date) => `${d.getDate()}. ${SK_MONTHS_SHORT[d.getMonth()]}`;
  const finalDate = (() => {
    const d = new Date(mondays[selectedIdx]);
    d.setDate(d.getDate() + (program.weeks * 7));
    return formatFull(d);
  })();

  return (
    <div style={{ background: NM.BG, minHeight: '100vh', paddingBottom: 160, fontFamily: NM.SANS, color: NM.DEEP }}>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          height: 380,
          backgroundImage: `url(${program.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(42,26,20,0.32) 0%, rgba(42,26,20,0) 40%, rgba(248,245,240,0.18) 70%, rgba(248,245,240,0.96) 100%)' }} />
        <button
          onClick={() => navigate(-1)}
          aria-label="Späť"
          style={{
            all: 'unset',
            cursor: 'pointer',
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top) + 8px)',
            left: 20,
            width: 38,
            height: 38,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
          <Eye color={NM.TERRA}>Program · Telo</Eye>
          <div style={{ marginTop: 8 }}>
            <Ser size={34} style={{ whiteSpace: 'pre-line' }}>
              {program.name.split('\n').map((line, i, arr) =>
                i === arr.length - 1 ? (
                  <em key={i} style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>{line}</em>
                ) : (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                )
              )}
            </Ser>
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div
        style={{
          margin: '8px 20px 0',
          padding: '16px 18px',
          background: '#fff',
          borderRadius: 20,
          border: `1px solid ${NM.HAIR}`,
          boxShadow: '0 10px 28px rgba(61,41,33,0.06)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}
      >
        {[
          { n: program.weeks, l: 'týždne' },
          { n: program.exercises, l: 'cvičení' },
          { n: program.minPerDay, l: 'min / deň' },
        ].map((s, i) => (
          <div key={s.l} style={{ textAlign: 'center', borderLeft: i > 0 ? `1px solid ${NM.HAIR}` : 'none' }}>
            <div style={{ fontFamily: NM.SERIF, fontSize: 22, fontWeight: 500, color: NM.TERRA, lineHeight: 1, letterSpacing: '-0.01em' }}>{s.n}</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: NM.EYEBROW, marginTop: 7, fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Overview */}
      <div style={{ margin: '24px 20px 0' }}>
        <Eye size={10} style={{ marginBottom: 10 }}>O programe</Eye>
        <Body size={14} color={NM.DEEP} weight={400}>{program.intro}</Body>
      </div>

      {/* Outline */}
      <div style={{ margin: '28px 20px 0' }}>
        <Eye size={10} style={{ marginBottom: 12 }}>Osnova</Eye>
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}`, overflow: 'hidden' }}>
          {program.outline.map((wk, i, arr) => (
            <div
              key={wk.w}
              style={{
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                borderBottom: i < arr.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: `${NM.TERRA}18`,
                  color: NM.TERRA,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: NM.SERIF,
                  fontSize: 13,
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: NM.EYEBROW, fontWeight: 500 }}>{wk.w}</div>
                <div style={{ fontFamily: NM.SERIF, fontSize: 14, fontWeight: 500, color: NM.DEEP, marginTop: 3, letterSpacing: '-0.005em' }}>{wk.t}</div>
                <div style={{ fontFamily: NM.SANS, fontSize: 10.5, color: NM.EYEBROW, marginTop: 3, fontWeight: 400 }}>{wk.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mondays-only picker (BC-5) */}
      <div style={{ margin: '28px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <Eye size={10}>Začni v pondelok</Eye>
          {!isPremium && <PlusTag />}
        </div>
        <div
          style={{
            padding: '18px 18px 20px',
            borderRadius: 20,
            background: '#fff',
            border: `1px solid ${NM.HAIR}`,
            boxShadow: '0 10px 28px rgba(61,41,33,0.06)',
            opacity: isPremium ? 1 : 0.6,
            position: 'relative',
          }}
        >
          {!isPremium && <div style={{ position: 'absolute', inset: 0, borderRadius: 20, background: 'rgba(248,245,240,0.25)', pointerEvents: 'none' }} />}
          <div style={{ fontFamily: NM.SANS, fontSize: 11.5, color: NM.EYEBROW, fontWeight: 400, marginBottom: 14 }}>
            Programy prebiehajú v týždňových cykloch — vyber si pondelok, kedy chceš začať.
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -18px', padding: '0 18px 4px' }}>
            {mondays.map((d, i) => {
              const sel = i === selectedIdx;
              return (
                <button
                  key={i}
                  onClick={() => isPremium && setSelectedIdx(i)}
                  style={{
                    all: 'unset',
                    cursor: isPremium ? 'pointer' : 'not-allowed',
                    flexShrink: 0,
                    width: 76,
                    padding: '13px 0',
                    borderRadius: 14,
                    background: sel ? NM.TERRA : NM.CREAM_2 ?? '#F1ECE3',
                    color: sel ? '#fff' : NM.DEEP,
                    border: sel ? 'none' : `1px solid ${NM.HAIR}`,
                    textAlign: 'center' as const,
                  }}
                >
                  <div style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: sel ? 'rgba(255,255,255,0.8)' : NM.EYEBROW, fontWeight: 500 }}>Pon</div>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 22, fontWeight: 500, marginTop: 4, letterSpacing: '-0.01em' }}>{d.getDate()}.</div>
                  <div style={{ fontFamily: NM.SANS, fontSize: 10, color: sel ? 'rgba(255,255,255,0.7)' : NM.TERTIARY, marginTop: 2, fontWeight: 400 }}>{SK_MONTHS_SHORT[d.getMonth()]}</div>
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 14, fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED, fontWeight: 400, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={NM.TERRA} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            {isPremium ? (
              <>
                Skončíš v pondelok <strong style={{ color: NM.DEEP, fontWeight: 500 }}>{finalDate}</strong>.
              </>
            ) : (
              <>Začni v pondelok ľubovoľný týždeň.</>
            )}
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div style={{ margin: '24px 20px 0' }}>
        {isPremium ? (
          <>
            <button
              onClick={onActivate}
              disabled={activating}
              style={{
                width: '100%',
                padding: '15px 20px',
                background: NM.TERRA,
                color: '#fff',
                border: 'none',
                borderRadius: 999,
                fontFamily: NM.SANS,
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '0.02em',
                cursor: activating ? 'wait' : 'pointer',
                opacity: activating ? 0.6 : 1,
              }}
            >
              {activating ? 'Aktivujem…' : `Aktivovať program · ${formatMonday(mondays[selectedIdx])}`}
            </button>
            <div style={{ textAlign: 'center', marginTop: 10, fontFamily: NM.SANS, fontSize: 11, color: NM.TERTIARY, fontWeight: 400 }}>
              Pridá sa do Domov a Kalendára
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                padding: '18px 20px',
                borderRadius: 20,
                background: `linear-gradient(135deg, ${NM.DEEP_2} 0%, ${NM.DEEP} 100%)`,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 999, background: `radial-gradient(circle, ${NM.GOLD}44, transparent 70%)` }} />
              <div style={{ position: 'relative' }}>
                <Eye color={NM.GOLD} size={10}>Plus program</Eye>
                <div style={{ fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, fontStyle: 'italic', marginTop: 8, letterSpacing: '-0.005em' }}>
                  Aktivuj Plus a začni v pondelok.
                </div>
                <button
                  onClick={() => navigate('/paywall')}
                  style={{
                    marginTop: 14,
                    width: '100%',
                    padding: '13px 20px',
                    background: NM.GOLD,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 999,
                    fontFamily: NM.SANS,
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    cursor: 'pointer',
                  }}
                >
                  Aktivovať Plus
                </button>
                <div style={{ textAlign: 'center', marginTop: 8, fontFamily: NM.SANS, fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
                  Prvý mesiac 4,99 €
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/domov-new')}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'block',
                width: '100%',
                textAlign: 'center',
                marginTop: 12,
                fontFamily: NM.SANS,
                fontSize: 12,
                color: NM.TERTIARY,
                fontWeight: 400,
                textDecoration: 'underline',
              }}
            >
              Pokračovať zdarma
            </button>
          </>
        )}
      </div>
    </div>
  );
}
