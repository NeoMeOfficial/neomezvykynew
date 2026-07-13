import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/use-user';
import { useCycleInfo } from '@/hooks/use-cycle';
import { useUserProgram } from '@/hooks/useUserProgram';
import { useMealPlan } from '@/features/nutrition/useMealPlan';
import { useRecipes, recipeImage } from '@/hooks/useRecipes';
import { useDailyMeditation } from '@/hooks/useDailyContent';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useReferral } from '@/hooks/useReferral';
import { usePointsLedger } from '@/hooks/usePointsLedger';
import SectionEyebrow from '@/components/v2/home/SectionEyebrow';
import UpsellBanner from '@/components/v2/home/UpsellBanner';
import { DayPlanSheet } from '@/components/v2/home/DayPlanSheet';

// ─── Design tokens ────────────────────────────────────────────────────────────
const CREAM  = '#F8F5F0';
const WHITE  = '#FFFFFF';
const INK    = '#3D2921';
const FG2    = 'rgba(61,41,33,0.55)';
const FG3    = 'rgba(61,41,33,0.38)';
const HAIR   = 'rgba(61,41,33,0.10)';
const HAIR2  = 'rgba(61,41,33,0.16)';
const TELO   = '#6B4C3B';
const STRAVA = '#7A9E78';
const MYSEL  = '#A8848B';
const CYKLUS = '#C27A6E';
const GOLD   = '#B8864A';
const SERIF  = "'Gilda Display', Georgia, serif";
const SANS   = "'DM Sans', sans-serif";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getDateEyebrow(): string {
  const d = new Date();
  const days = ['Nedeľa','Pondelok','Utorok','Streda','Štvrtok','Piatok','Sobota'];
  const months = ['januára','februára','marca','apríla','mája','júna','júla','augusta','septembra','októbra','novembra','decembra'];
  return `${days[d.getDay()]} · ${d.getDate()}. ${months[d.getMonth()]}`;
}

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 11) return 'Krásne ráno';
  if (h < 17) return 'Krásny deň';
  return 'Krásny večer';
}

function getDaysSince(iso: string | null | undefined): number {
  if (!iso) return 1;
  return Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000));
}

// ─── Periodic promo gate ─────────────────────────────────────────────────────
// Upsell banners appear only on every PROMO_INTERVAL-th visit, so the home
// page isn't selling something on every open. A "visit" is one app session
// (sessionStorage guard) — moving around the app and coming back to the home
// page within the same session doesn't advance the counter.
const PROMO_INTERVAL = 4;

function countHomeVisit(): number {
  try {
    const KEY = 'neome_home_visits';
    const SESSION_KEY = 'neome_home_visit_counted';
    let n = parseInt(localStorage.getItem(KEY) ?? '0', 10) || 0;
    if (!sessionStorage.getItem(SESSION_KEY)) {
      n += 1;
      localStorage.setItem(KEY, String(n));
      sessionStorage.setItem(SESSION_KEY, '1');
    }
    return n;
  } catch {
    return 0;
  }
}

// ─── Greeting ─────────────────────────────────────────────────────────────────
function Greeting({ name, points, streakDays, plus, onPointsClick }: {
  name: string; points: number; streakDays: number; plus: boolean; onPointsClick: () => void;
}) {
  return (
    <div style={{ padding: '62px 22px 0', fontFamily: SANS }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: FG3, fontWeight: 500, paddingTop: 9 }}>
          {getDateEyebrow()}
          {plus
            ? <> · <span style={{ color: GOLD }}>Plus</span></>
            : <> · <span style={{ color: FG3 }}>Free</span></>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <button onClick={onPointsClick} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px 7px 9px', borderRadius: 999, background: WHITE, border: `1px solid ${HAIR2}`, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: INK }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6">
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: SERIF, fontSize: 13, fontWeight: 500 }}>{points}</span>
            <span style={{ fontSize: 10, color: FG3, letterSpacing: '0.06em' }}>bodov</span>
          </button>
          <button style={{ width: 38, height: 38, borderRadius: '50%', border: `1px solid ${HAIR2}`, background: WHITE, display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round"><path d="M6 8h12M6 12h12M6 16h8"/></svg>
          </button>
        </div>
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 32, lineHeight: 1.04, letterSpacing: '-0.012em', marginTop: 16, color: INK, fontWeight: 500 }}>
        {getTimeGreeting()},<br/>
        <em style={{ fontStyle: 'italic', color: TELO, fontWeight: 500 }}>{name}</em>
      </div>
      <div style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.5, color: FG2, fontWeight: 400, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
        <span>Silné telo vzniká z malých rozhodnutí</span>
        <span style={{ width: 3, height: 3, borderRadius: 999, background: HAIR2, display: 'inline-block' }} />
        <span style={{ fontSize: 11.5, fontStyle: 'italic', fontFamily: SERIF, color: FG3 }}>{streakDays}. deň spolu</span>
      </div>
    </div>
  );
}

// ─── Persistence notice (Free only) ───────────────────────────────────────────
function PersistenceNotice() {
  return (
    <div style={{ padding: '14px 18px 0' }}>
      <div style={{ padding: '10px 14px', borderRadius: 14, background: 'rgba(184,134,74,0.08)', border: `1px solid rgba(184,134,74,0.30)`, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.7" style={{ flexShrink: 0, marginTop: 2 }}>
          <path d="M12 2L2 7v6c0 5 4 9 10 9s10-4 10-9V7l-10-5z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11.5, color: INK, fontWeight: 500, lineHeight: 1.35 }}>Tvoje denníky a údaje sa s Free verziou neukladajú.</div>
          <div style={{ fontSize: 11, color: FG2, fontWeight: 300, marginTop: 2, lineHeight: 1.4 }}>Predplatné NeoMe ich uchová pre teba — kdekoľvek a kedykoľvek.</div>
        </div>
      </div>
    </div>
  );
}

// ─── Weekly calendar strip ────────────────────────────────────────────────────
function WeekCalendar({ onSelectDay }: { onSelectDay: (d: Date) => void }) {
  const [offset, setOffset] = useState(0);
  const today = new Date();
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const dow = today.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const labels = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i + offset * 7);
    const mid = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    return {
      label: labels[i],
      date: d.getDate(),
      iso: d,
      isToday: mid === todayMid,
      past: mid < todayMid,
    };
  });
  const monthLabel = (() => {
    const first = week[0].iso;
    const last = week[6].iso;
    const months = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];
    if (first.getMonth() === last.getMonth()) return `${months[first.getMonth()]} ${first.getFullYear()}`;
    return `${months[first.getMonth()]} – ${months[last.getMonth()]}`;
  })();
  return (
    <div style={{ padding: '20px 18px 0' }}>
      <div style={{ background: WHITE, borderRadius: 18, padding: '10px 8px 8px', border: `1px solid ${HAIR}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 8px 8px' }}>
          <button
            type="button"
            onClick={() => setOffset((o) => o - 1)}
            aria-label="Predchádzajúci týždeň"
            style={{ all: 'unset', cursor: 'pointer', width: 24, height: 24, display: 'grid', placeItems: 'center', color: FG3 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 13,
              color: INK,
              fontWeight: 500,
              fontStyle: 'italic',
              letterSpacing: '-0.005em',
            }}
          >
            {monthLabel}
          </div>
          <button
            type="button"
            onClick={() => setOffset((o) => o + 1)}
            aria-label="Ďalší týždeň"
            style={{ all: 'unset', cursor: 'pointer', width: 24, height: 24, display: 'grid', placeItems: 'center', color: FG3 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {week.map((d, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDay(d.iso)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '10px 0 8px',
                borderRadius: 12,
                background: d.isToday ? INK : 'transparent',
                color: d.isToday ? '#fff' : INK,
              }}
            >
              <div style={{ fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase' as const, opacity: d.isToday ? 0.7 : 0.45, fontWeight: 500 }}>
                {d.label}
              </div>
              <div style={{ fontSize: 16, fontWeight: 500, fontFamily: SERIF }}>{d.date}</div>
              <div style={{ width: 4, height: 4, borderRadius: 2, background: d.past ? TELO : d.isToday ? '#fff' : 'transparent' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── "Dnes pre teba" — compact horizontal picks (Telo · Výživa · Myseľ) ──────
// Replaces the former full-width pillar cards. Fixed 135px cards so a 375px
// viewport shows ~2.5 of them — the peeking half-card signals scrollability.
export interface TodayPick {
  eyebrow: string;
  color: string;
  title: string;
  desc: string;
  img: string;
  href: string;
}

function TodayPicksRow({ items }: { items: TodayPick[] }) {
  const navigate = useNavigate();
  return (
    <div
      className="today-picks-row"
      style={{
        display: 'flex',
        gap: 10,
        overflowX: 'auto',
        padding: '0 18px 6px',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch' as any,
        scrollbarWidth: 'none' as any,
        marginBottom: 6,
      }}
    >
      {items.map((p, i) => (
        <div
          key={i}
          onClick={() => navigate(p.href)}
          style={{
            flex: '0 0 135px',
            scrollSnapAlign: 'start',
            background: WHITE,
            borderRadius: 16,
            border: `1px solid ${HAIR}`,
            overflow: 'hidden',
            cursor: 'pointer',
            touchAction: 'manipulation',
          }}
        >
          <div style={{ aspectRatio: '4/3', position: 'relative', background: `url(${p.img}) center/cover` }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28) 100%)', pointerEvents: 'none' }} />
          </div>
          <div style={{ padding: '9px 11px 12px' }}>
            <div style={{ fontSize: 8.5, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: p.color, fontWeight: 500 }}>{p.eyebrow}</div>
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 13.5,
                color: INK,
                marginTop: 3,
                lineHeight: 1.25,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
                minHeight: '2.5em',
              }}
            >
              {p.title}
            </div>
            <div style={{ fontSize: 10.5, color: FG2, marginTop: 3, fontWeight: 300, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Habits card ──────────────────────────────────────────────────────────────
function CardHabits({ free, onAddHabit }: { free: boolean; onAddHabit: () => void }) {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([
    { label: 'Piť 2 l vody',      done: true  },
    { label: '10 minút pohybu',    done: true  },
    { label: 'Večerná meditácia',  done: false },
  ]);
  const toggle = (i: number) => setHabits(prev => prev.map((h, idx) => idx === i ? { ...h, done: !h.done } : h));
  const done = habits.filter(h => h.done).length;
  return (
    <div style={{ padding: '0 18px', marginBottom: 12 }}>
      <div style={{ background: WHITE, borderRadius: 20, border: `1px solid ${HAIR}`, overflow: 'hidden' }}>
        <div style={{ height: 100, position: 'relative', background: `url(/images/r9/lifestyle-yoga-pose.jpg) center/cover` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)' }} />
          {free && (
            <div style={{ position: 'absolute', top: 14, right: 16, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.85)', fontWeight: 500, fontStyle: 'italic' }}>neukladá sa</div>
          )}
          <div style={{ position: 'absolute', bottom: 12, left: 16, fontFamily: SERIF, fontSize: 18, color: '#fff' }}>Malé kroky, veľký rozdiel</div>
        </div>
        <div style={{ padding: '6px 16px 10px' }}>
          {habits.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: `1px solid ${HAIR}` }}>
              {/* Tappable checkbox — toggles done state */}
              <button onClick={() => toggle(i)} style={{ all: 'unset', cursor: 'pointer', width: 18, height: 18, borderRadius: 9, flexShrink: 0, border: `1.5px solid ${h.done ? TELO : HAIR2}`, background: h.done ? TELO : 'transparent', display: 'grid', placeItems: 'center' }}>
                {h.done && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-11"/></svg>}
              </button>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 400, color: h.done ? FG3 : INK, textDecoration: h.done ? 'line-through' : 'none' }}>{h.label}</div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0 4px' }}>
            <button onClick={onAddHabit} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 0, cursor: 'pointer', padding: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: 9, flexShrink: 0, border: `1.5px dashed ${HAIR2}`, display: 'grid', placeItems: 'center' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={FG3} strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <div style={{ fontSize: 12.5, color: FG2, fontWeight: 400, fontStyle: 'italic', fontFamily: SERIF }}>Pridať návyk</div>
            </button>
            <button onClick={() => navigate('/navyky')} style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', fontSize: 11, color: FG3, display: 'flex', alignItems: 'center', gap: 4 }}>
              Všetky
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={FG3} strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reflections card ─────────────────────────────────────────────────────────
function CardReflections({ free, onOpen }: { free: boolean; onOpen: () => void }) {
  return (
    <div style={{ padding: '0 18px', marginBottom: 12 }}>
      <div style={{ background: WHITE, borderRadius: 20, border: `1px solid ${HAIR}`, overflow: 'hidden', cursor: 'pointer' }} onClick={onOpen}>
        <div style={{ height: 110, position: 'relative', background: `url(/images/r9/section-diary.jpg) center/cover` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.5) 100%)' }} />
          {free && (
            <div style={{ position: 'absolute', top: 14, right: 16, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.85)', fontWeight: 500, fontStyle: 'italic' }}>neukladá sa</div>
          )}
          <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, fontFamily: SERIF, fontSize: 18, color: '#fff', lineHeight: 1.25 }}>Čo ti dnes dalo najviac energie?</div>
        </div>
        <div style={{ padding: 18 }}>
          <div style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(61,41,33,0.04)', border: `1px dashed ${HAIR2}`, fontFamily: SERIF, fontSize: 13, color: FG3, lineHeight: 1.5 }}>
            Napíš jednu vetu…
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cyklus card — full data ───────────────────────────────────────────────────
function CardCyklus({ day, total, phaseName, note }: { day: number; total: number; phaseName: string; note: string }) {
  const navigate = useNavigate();
  const todayPct = day / total;
  const phases = [
    { w: 5/total, c: '#C6758A' }, { w: 8/total, c: '#B48499' },
    { w: 3/total, c: '#A36C8E' }, { w: (total-16)/total, c: '#7A5A72' },
  ];
  const months = ['januára','februára','marca','apríla','mája','júna','júla','augusta','septembra','októbra','novembra','decembra'];
  const monthLabel = months[new Date().getMonth()];
  return (
    <div style={{ padding: '0 18px', marginBottom: 12 }}>
      <div style={{ background: WHITE, borderRadius: 22, border: `1px solid ${HAIR}`, overflow: 'hidden' }}>
        <div style={{ height: 130, position: 'relative', background: `url(/images/r9/section-period.jpg) center/cover` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)' }} />
          <div style={{ position: 'absolute', top: 14, right: 16, fontSize: 10.5, color: 'rgba(255,255,255,0.85)' }}>Deň {day} / {total}</div>
          <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
            <div style={{ fontFamily: SERIF, fontSize: 56, lineHeight: 0.9, color: '#fff', fontWeight: 500, letterSpacing: '-0.04em' }}>{day}</div>
            <div style={{ paddingBottom: 4 }}>
              <div style={{ fontFamily: SERIF, fontSize: 18, fontStyle: 'italic', color: '#fff', fontWeight: 500, lineHeight: 1.1 }}>{phaseName}</div>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.78)', marginTop: 2 }}>fáza</div>
            </div>
          </div>
        </div>
        <div style={{ padding: 18 }}>
          <div style={{ fontFamily: SERIF, fontSize: 17, color: INK, lineHeight: 1.25, marginBottom: 14 }}>{note}</div>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <div style={{ display: 'flex', height: 5, borderRadius: 3, overflow: 'hidden', background: HAIR2 }}>
              {phases.map((p, i) => <div key={i} style={{ flex: p.w, background: p.c, opacity: 0.9 }} />)}
            </div>
            <div style={{ position: 'absolute', top: -4, left: `calc(${todayPct * 100}% - 7px)`, width: 13, height: 13, borderRadius: 999, background: WHITE, border: `2.5px solid ${INK}`, boxShadow: '0 2px 6px rgba(61,41,33,0.18)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11.5, color: FG2, fontWeight: 300 }}>
              {monthLabel} · {total - day} dní do ďalšej
            </div>
            <button onClick={() => navigate('/kniznica/periodka')} style={{ background: INK, color: '#fff', border: 0, padding: '9px 16px', borderRadius: 999, fontSize: 11.5, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Čo ťa dnes čaká
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cyklus card — setup prompt (Plus, no tracker) ────────────────────────────
function CardCyklusSetup() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '0 18px', marginBottom: 12 }}>
      <div style={{ background: WHITE, borderRadius: 22, border: `1px solid ${HAIR}`, overflow: 'hidden' }}>
        <div style={{ height: 110, position: 'relative', background: `url(/images/r9/section-period.jpg) center/cover`, filter: 'saturate(0.9)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.55) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, fontFamily: SERIF, fontSize: 19, fontStyle: 'italic', color: '#fff', lineHeight: 1.2 }}>Trénuj v rytme svojho tela</div>
        </div>
        <div style={{ padding: 18 }}>
          <div style={{ fontSize: 12.5, color: FG2, lineHeight: 1.5, fontWeight: 300 }}>Zaznač si jeden deň menštruácie a NeoMe ti začne odporúčať pohyb a stravu podľa fázy.</div>
          <button onClick={() => navigate('/kniznica/periodka')} style={{ marginTop: 14, background: CYKLUS, color: '#fff', border: 0, padding: '10px 18px', borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Zapnúť cyklus
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cyklus card — Free ───────────────────────────────────────────────────────
function CardCyklusFree() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '0 18px', marginBottom: 12 }}>
      <div style={{ background: WHITE, borderRadius: 22, border: `1px solid ${HAIR}`, overflow: 'hidden' }}>
        <div style={{ height: 110, position: 'relative', background: `url(/images/r9/section-period.jpg) center/cover` }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.55) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 16, fontFamily: SERIF, fontSize: 19, color: '#fff', lineHeight: 1.2 }}>Tvoj rytmus, zaznamenaný</div>
        </div>
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 11.5, color: FG2, lineHeight: 1.45, fontWeight: 300 }}>
            Plnohodnotný tracker s fázami, energiou a odporúčaniami je súčasťou <span style={{ color: GOLD, fontWeight: 500 }}>Plus</span>.
          </div>
          <button onClick={() => navigate('/paywall')} style={{ marginTop: 12, background: 'transparent', border: 0, padding: 0, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: CYKLUS, display: 'flex', alignItems: 'center', gap: 6 }}>
            Vyskúšať Plus
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={CYKLUS} strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Community highlight ──────────────────────────────────────────────────────
function CardCommunity() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '0 18px', marginBottom: 12 }}>
      <div style={{ background: WHITE, borderRadius: 20, border: `1px solid ${HAIR}`, overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: 10, color: FG3, letterSpacing: '0.06em' }}>pred 2 h</div>
        </div>
        <div style={{ padding: '4px 16px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: `url(/images/r9/testimonial-anna.jpg) center/cover`, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: SERIF, fontSize: 14, color: INK, fontWeight: 500 }}>Anna K.</div>
              <div style={{ fontSize: 10.5, color: FG3, letterSpacing: '0.06em' }}>3. týždeň · Postpartum</div>
            </div>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 16, color: INK, lineHeight: 1.35, fontStyle: 'italic', marginBottom: 12 }}>
            „Prvý raz po pôrode som dnes nečakane vstala bez bolesti chrbta. Tie 6 minút pohybu denne fungujú."
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 16, fontSize: 11, color: FG2, fontWeight: 400 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={FG2} strokeWidth="1.6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                47
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={FG2} strokeWidth="1.6"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                12
              </span>
            </div>
            <button onClick={() => navigate('/komunita')} style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', fontSize: 11.5, fontWeight: 500, color: INK, display: 'flex', alignItems: 'center', gap: 5 }}>
              Otvoriť
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GOLD referral card ───────────────────────────────────────────────────────
function CardReferral({ code }: { code: string }) {
  const handleShare = () => {
    const url = `${window.location.origin}/ref/${code}`;
    if (navigator.share) {
      navigator.share({ title: 'NeoMe', text: `Pridaj sa k NeoMe — použi môj kód ${code} a dostaneme obe mesiac zadarmo.`, url });
    } else {
      navigator.clipboard?.writeText(url);
    }
  };
  return (
    <div style={{ padding: '4px 18px 14px' }}>
      <div style={{ background: '#3D2921', borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -22, right: 14, fontFamily: SERIF, fontSize: 150, fontStyle: 'italic', lineHeight: 0.9, color: GOLD, opacity: 0.16, letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>+1</div>
        <div style={{ padding: '20px 20px 18px', position: 'relative' }}>
          <div style={{ fontSize: 9.5, letterSpacing: '0.24em', textTransform: 'uppercase' as const, fontWeight: 500, color: GOLD, marginBottom: 12 }}>Pozvi kamarátku</div>
          <div style={{ fontFamily: SERIF, fontSize: 22, lineHeight: 1.18, color: '#F5EFE5', letterSpacing: '-0.005em', marginBottom: 8, maxWidth: 230 }}>
            Získajte <em style={{ color: GOLD, fontWeight: 500 }}>mesiac zadarmo</em> — obe.
          </div>
          <div style={{ fontSize: 12, color: 'rgba(245,239,229,0.7)', lineHeight: 1.5, fontWeight: 300, maxWidth: 280, marginBottom: 16 }}>
            Pošli kamarátke svoj kód. Keď si predplatí, mesiac NeoMe je darček pre teba aj pre ňu.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={handleShare} style={{ background: GOLD, color: INK, border: 0, padding: '11px 18px', borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Zdieľať môj kód
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
            </button>
            <div style={{ fontSize: 10.5, color: 'rgba(245,239,229,0.55)', letterSpacing: '0.12em', textTransform: 'uppercase' as const, fontWeight: 500 }}>{code}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sheet backdrop wrapper ───────────────────────────────────────────────────
// Portal → sits above BottomNav (z-index:50) at z-index:200 in root stacking context.
function SheetBackdrop({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null); // only the dimmed overlay, NOT the sheet
  const scrollRef  = useRef<HTMLDivElement>(null); // the scrollable body inside the sheet
  const [bottomOffset, setBottomOffset] = useState(0);
  const [maxH, setMaxH] = useState('88dvh');

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Prevent page scroll only when touching the dim overlay (not the sheet).
    // Must be non-passive so preventDefault() actually works on iOS.
    const overlay = overlayRef.current;
    const blockScroll = (e: TouchEvent) => e.preventDefault();
    overlay?.addEventListener('touchmove', blockScroll, { passive: false });

    // Shift sheet up by keyboard height so the CTA is never hidden behind the keyboard.
    // visualViewport.height shrinks when the keyboard opens; window.innerHeight does not.
    const vv = window.visualViewport;
    const onVVChange = () => {
      if (!vv) return;
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setBottomOffset(kb);
      setMaxH(`${Math.round(vv.height * 0.92)}px`);
    };
    vv?.addEventListener('resize', onVVChange);
    vv?.addEventListener('scroll', onVVChange);

    return () => {
      document.body.style.overflow = prev;
      overlay?.removeEventListener('touchmove', blockScroll);
      vv?.removeEventListener('resize', onVVChange);
      vv?.removeEventListener('scroll', onVVChange);
    };
  }, []);

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      {/* Dimmed overlay — scroll-locked, tap to close */}
      <div
        ref={overlayRef}
        style={{ position: 'absolute', inset: 0, background: 'rgba(42,26,20,0.45)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Sheet panel — moves up when keyboard opens via bottomOffset */}
      <div
        style={{
          position: 'absolute', bottom: bottomOffset, left: 0, right: 0,
          background: WHITE, borderRadius: '24px 24px 0 0',
          display: 'flex', flexDirection: 'column',
          maxHeight: maxH,
          overflow: 'hidden',  // ← this is what makes flex:1 + overflow:auto actually scroll
          transition: 'bottom 0.22s ease, max-height 0.22s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky header — never scrolls away */}
        <div style={{ flexShrink: 0, padding: '14px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: SERIF, fontSize: 20, color: INK, fontWeight: 500 }}>{title}</div>
          <button
            onClick={onClose}
            style={{ all: 'unset', cursor: 'pointer', width: 34, height: 34, borderRadius: 999, background: CREAM, border: `1px solid ${HAIR2}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}
            aria-label="Zavrieť"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Scrollable body — minHeight:0 lets flex shrink below content size */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch' as any,
            overscrollBehavior: 'contain',
            paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
          }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── Points info sheet ────────────────────────────────────────────────────────
function PointsInfoSheet({ points, onClose }: { points: number; onClose: () => void }) {
  const navigate = useNavigate();
  const rows = [
    { label: 'Pridanie príspevku do komunity', pts: '+10 bodov' },
    { label: 'Like alebo podpora príspevku',   pts: '+2 body' },
    { label: 'Dokončenie tréningu',             pts: '+15 bodov' },
    { label: 'Záznam menštruácie',              pts: '+5 bodov' },
    { label: 'Denný zápis do denníka',          pts: '+5 bodov' },
    { label: 'Splnenie návyku',                 pts: '+3 body' },
  ];
  return (
    <SheetBackdrop onClose={onClose} title="Ako získavaš body">
      <div style={{ padding: '14px 22px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.6">
            <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: INK }}>{points}</span>
          <span style={{ fontSize: 12, color: FG2, fontWeight: 300 }}>bodov celkom</span>
        </div>
        <div style={{ fontSize: 12, color: FG2, fontWeight: 300, marginBottom: 18, lineHeight: 1.5 }}>Body sú odmenou za aktívne zapojenie. Zbieraš ich automaticky.</div>
        <div style={{ background: CREAM, borderRadius: 16, overflow: 'hidden', border: `1px solid ${HAIR}`, marginBottom: 18 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: i < rows.length - 1 ? `1px solid ${HAIR}` : 'none' }}>
              <div style={{ fontSize: 12.5, color: INK, fontWeight: 400 }}>{r.label}</div>
              <div style={{ fontSize: 11.5, color: GOLD, fontWeight: 500, flexShrink: 0, marginLeft: 12 }}>{r.pts}</div>
            </div>
          ))}
        </div>
        <button
          onClick={() => { onClose(); navigate('/body'); }}
          style={{ width: '100%', padding: '14px', background: INK, color: WHITE, border: 0, borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: SANS }}
        >
          Zobraziť všetky odmeny
        </button>
      </div>
    </SheetBackdrop>
  );
}

// ─── Diary sheet ──────────────────────────────────────────────────────────────
function DiarySheet({ free, onClose }: { free: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const prompts = [
    'Čo ti dnes dalo najviac energie?',
    'Na čo si dnes hrdá?',
    'Čo by si zajtra urobila inak?',
    'Čo ti dnes prinieslo radosť?',
  ];
  const prompt = prompts[new Date().getDay() % prompts.length];

  const handleSave = () => {
    if (free) {
      onClose();
      return;
    }
    navigate('/dennik/new', { state: { prefill: text } });
    onClose();
  };

  return (
    <SheetBackdrop onClose={onClose} title="Dnešné zamyslenie">
      <div style={{ padding: '10px 22px 36px' }}>
        <div style={{ fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase' as const, fontWeight: 500, color: FG3, marginBottom: 8 }}>
          {free && <span style={{ color: GOLD }}>neukladá sa · </span>}Reflexia
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 19, color: INK, lineHeight: 1.3, marginBottom: 16 }}>{prompt}</div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Napíš jednu vetu…"
          style={{ width: '100%', minHeight: 110, padding: '14px 16px', borderRadius: 16, border: `1px solid ${HAIR2}`, fontSize: 15, fontFamily: SERIF, color: INK, background: CREAM, outline: 'none', resize: 'none', lineHeight: 1.55, boxSizing: 'border-box' as const }}
        />
        {free && (
          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 12, background: 'rgba(184,134,74,0.08)', border: `1px solid rgba(184,134,74,0.25)`, fontSize: 11.5, color: FG2, lineHeight: 1.45 }}>
            Záznamy sa neukladajú vo Free verzii. <span style={{ color: GOLD, fontWeight: 500 }}>Plus</span> ich uchová navždy.
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={!text.trim()}
          style={{ marginTop: 14, width: '100%', padding: '14px', background: text.trim() ? INK : HAIR2, color: text.trim() ? WHITE : FG3, border: 0, borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: text.trim() ? 'pointer' : 'default', fontFamily: SANS }}
        >
          {free ? 'Zavrieť' : 'Uložiť záznam'}
        </button>
      </div>
    </SheetBackdrop>
  );
}

// ─── Subscription upsell card (Free users) ────────────────────────────────────
function CardSubscriptionUpsell() {
  const navigate = useNavigate();
  const perks = ['Osobný jedálniček', 'Programy s Gabi', 'Sledovanie cyklu', 'Ukladanie denníkov'];
  return (
    <div style={{ padding: '4px 18px 14px' }}>
      <div style={{ background: `linear-gradient(135deg, #3D2921 0%, #5C3D2E 100%)`, borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -18, right: 10, fontFamily: SERIF, fontSize: 120, fontStyle: 'italic', lineHeight: 0.9, color: TELO, opacity: 0.22, letterSpacing: '-0.04em', userSelect: 'none', pointerEvents: 'none' }}>+</div>
        <div style={{ padding: '22px 20px 20px', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 999, background: 'rgba(184,134,74,0.2)', border: `1px solid rgba(184,134,74,0.4)`, marginBottom: 14 }}>
            <span style={{ fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase' as const, fontWeight: 500, color: GOLD }}>NeoMe Plus</span>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 22, lineHeight: 1.2, color: '#F5EFE5', letterSpacing: '-0.005em', marginBottom: 6, maxWidth: 240 }}>
            Celá NeoMe. Pre <em style={{ color: GOLD, fontWeight: 500 }}>teba</em>.
          </div>
          <div style={{ fontSize: 12, color: 'rgba(245,239,229,0.65)', lineHeight: 1.5, fontWeight: 300, marginBottom: 16 }}>
            Všetko, čo potrebuješ pre zdravý životný štýl na jednom mieste.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px 10px', marginBottom: 18 }}>
            {perks.map((p) => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-11"/></svg>
                <span style={{ fontSize: 11.5, color: 'rgba(245,239,229,0.85)', fontWeight: 400 }}>{p}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/paywall')}
            style={{ background: GOLD, color: INK, border: 0, padding: '12px 22px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            Vyskúšať Plus
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add habit sheet (full creation UI) ──────────────────────────────────────
const HABIT_ICONS = [
  { id: 'droplet', d: 'M12 3s-6 7-6 11a6 6 0 0012 0c0-4-6-11-6-11z' },
  { id: 'flame',   d: 'M8 14s-2 2-2 4a4 4 0 008 0c0-2-4-4-4-10 0 0-2 6-2 6z' },
  { id: 'moon',    d: 'M21 12.5A9 9 0 0111.5 3a7 7 0 109.5 9.5z' },
  { id: 'sun',     d: 'M12 3v2M12 19v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5' },
  { id: 'heart',   d: 'M12 21s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 11c0 5.5-7 10-7 10z' },
  { id: 'book',    d: 'M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4V4zM4 16h16' },
  { id: 'coffee',  d: 'M4 8h13v6a5 5 0 01-10 0V8zM17 8h2a3 3 0 010 6h-2M5 2v2M9 2v2M13 2v2' },
  { id: 'leaf',    d: 'M5 19c7-7 13-7 17-11-1 9-6 14-15 15-2 0-3-1-3-3 0-1 1-1 1-1z' },
  { id: 'feather', d: 'M20 4c-2 8-7 13-15 15l-3-3c2-8 7-13 15-15l3 3zM4 20l6-6' },
  { id: 'smile',   d: 'M12 21a9 9 0 100-18 9 9 0 000 18zM8 14a4 4 0 008 0M9 10h.01M15 10h.01' },
];

const HABIT_CATEGORIES = [
  { id: 'pohyb',  label: 'Pohyb',  color: TELO },
  { id: 'vyziva', label: 'Výživa', color: STRAVA },
  { id: 'mysel',  label: 'Myseľ',  color: MYSEL },
  { id: 'cyklus', label: 'Cyklus', color: CYKLUS },
  { id: 'ine',    label: 'Iné',    color: FG2 },
];

const HABIT_FREQUENCIES = ['Denne', 'Vybrané dni', 'X × týždenne'] as const;
const HABIT_DURATIONS = ['7 dní', '21 dní', '30 dní', 'Bez limitu'] as const;

function AddHabitSheet({ onClose }: { onClose: () => void }) {
  const [name, setName]         = useState('');
  const [icon, setIcon]         = useState('droplet');
  const [category, setCategory] = useState('pohyb');
  const [frequency, setFrequency] = useState('Denne');
  const [duration, setDuration] = useState('21 dní');
  const [reminderOn, setReminderOn] = useState(false);

  return (
    <SheetBackdrop onClose={onClose} title="Nový návyk">
      <div style={{ padding: '10px 22px 48px' }}>
        <div style={{ fontSize: 12, color: FG2, fontWeight: 300, marginBottom: 22, lineHeight: 1.5 }}>Pomenuj zvyk, ktorý chceš sledovať každý deň.</div>

        {/* Name */}
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="napr. Piť 2 l vody"
          style={{ width: '100%', padding: '14px 16px', borderRadius: 14, border: `1px solid ${HAIR2}`, fontSize: 15, fontFamily: SERIF, color: INK, background: CREAM, outline: 'none', boxSizing: 'border-box' as const, marginBottom: 20 }}
        />

        {/* Icon */}
        <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, fontWeight: 500, color: FG3, marginBottom: 10 }}>Ikona</div>
        <div style={{ background: CREAM, borderRadius: 14, border: `1px solid ${HAIR}`, padding: 10, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 20 }}>
          {HABIT_ICONS.map(ic => {
            const sel = icon === ic.id;
            return (
              <button key={ic.id} onClick={() => setIcon(ic.id)} style={{ all: 'unset', cursor: 'pointer', aspectRatio: '1', borderRadius: 10, background: sel ? INK : WHITE, border: `1px solid ${sel ? 'transparent' : HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={sel ? WHITE : FG2} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={ic.d} />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Category */}
        <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, fontWeight: 500, color: FG3, marginBottom: 10 }}>Oblasť</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 8, marginBottom: 20 }}>
          {HABIT_CATEGORIES.map(c => {
            const sel = category === c.id;
            return (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{ all: 'unset', cursor: 'pointer', padding: '8px 14px', borderRadius: 999, background: sel ? c.color : WHITE, color: sel ? WHITE : INK, border: `1px solid ${sel ? 'transparent' : HAIR2}`, fontFamily: SANS, fontSize: 12, fontWeight: sel ? 500 : 400 }}>
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Frequency */}
        <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, fontWeight: 500, color: FG3, marginBottom: 10 }}>Ako často</div>
        <div style={{ background: CREAM, borderRadius: 14, border: `1px solid ${HAIR}`, padding: 4, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginBottom: 20 }}>
          {HABIT_FREQUENCIES.map(f => {
            const sel = frequency === f;
            return (
              <button key={f} onClick={() => setFrequency(f)} style={{ all: 'unset', cursor: 'pointer', textAlign: 'center' as const, padding: '9px 6px', borderRadius: 10, background: sel ? INK : 'transparent', color: sel ? WHITE : FG2, fontFamily: SANS, fontSize: 11.5, fontWeight: sel ? 500 : 400 }}>
                {f}
              </button>
            );
          })}
        </div>

        {/* Duration */}
        <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const, fontWeight: 500, color: FG3, marginBottom: 10 }}>Cieľová doba</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {HABIT_DURATIONS.map(d => {
            const sel = duration === d;
            return (
              <button key={d} onClick={() => setDuration(d)} style={{ all: 'unset', cursor: 'pointer', flex: 1, padding: '10px 4px', textAlign: 'center' as const, borderRadius: 12, background: sel ? INK : WHITE, color: sel ? WHITE : INK, border: `1px solid ${sel ? 'transparent' : HAIR2}`, fontFamily: SANS, fontSize: 11.5, fontWeight: 500 }}>
                {d}
              </button>
            );
          })}
        </div>

        {/* Reminder toggle */}
        <div style={{ background: CREAM, borderRadius: 14, border: `1px solid ${HAIR}`, padding: '13px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: SANS, fontSize: 13, color: INK, fontWeight: 500 }}>Pripomienka</div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: FG3, marginTop: 2 }}>Denná notifikácia</div>
          </div>
          <button onClick={() => setReminderOn(v => !v)} style={{ all: 'unset', cursor: 'pointer', width: 40, height: 24, borderRadius: 999, background: reminderOn ? TELO : HAIR2, position: 'relative', transition: 'background .2s' }}>
            <div style={{ position: 'absolute', top: 2, left: reminderOn ? 18 : 2, width: 20, height: 20, borderRadius: 999, background: WHITE, transition: 'left .2s', boxShadow: '0 1px 4px rgba(61,41,33,0.18)' }} />
          </button>
        </div>

        <button
          onClick={onClose}
          disabled={!name.trim()}
          style={{ width: '100%', padding: '15px', background: name.trim() ? INK : HAIR2, color: name.trim() ? WHITE : FG3, border: 0, borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: name.trim() ? 'pointer' : 'default', fontFamily: SANS }}
        >
          Pridať návyk
        </button>
        <div style={{ marginTop: 10, textAlign: 'center' as const, fontSize: 11, color: FG3, fontWeight: 300 }}>
          Návyk sa neuloží po zatvorení aplikácie — sprav si predplatné, aby zostal.
        </div>
      </div>
    </SheetBackdrop>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DomovNew() {
  const navigate = useNavigate();
  const [showDiary,     setShowDiary]     = useState(false);
  const [showPointsInfo, setShowPointsInfo] = useState(false);
  const [selectedDay,   setSelectedDay]   = useState<Date | null>(null);
  const user = useUser();
  const cycle = useCycleInfo();
  const { userProgram } = useUserProgram();
  const { todayPlan } = useMealPlan();
  const { recipes } = useRecipes();
  const { meditation } = useDailyMeditation();
  const { profile } = useSupabaseAuth();
  const { referralCode } = useReferral();
  const { balance: points } = usePointsLedger();

  const isPlus    = user.tier === 'plus';
  const hasCycle  = isPlus && user.hasCycleData;
  const hasMealPlanAddon = user.hasMealPlanAddon;
  const hasMealPlan = hasMealPlanAddon && user.hasMealPlan;
  // Purchased the add-on but hasn't filled the questionnaire yet —
  // we prompt for setup instead of showing the upsell again.
  const mealPlanNeedsSetup = hasMealPlanAddon && !user.hasMealPlan;
  const code = referralCode?.code ?? 'NEOME';
  const streakDays = getDaysSince((profile as any)?.created_at);

  const meditationTitle = meditation?.title ?? 'Ranný pokoj';

  // ── "Dnes pre teba" picks ──────────────────────────────────────────────
  const bodyPick: TodayPick = isPlus && userProgram
    ? {
        eyebrow: 'Telo',
        color: TELO,
        title: userProgram.todaysExercise?.title ?? 'Tréning dňa',
        desc: [`Týž. ${userProgram.week} · deň ${userProgram.day}`, userProgram.todaysExercise?.duration].filter(Boolean).join(' · '),
        img: '/images/r9/section-body.jpg',
        href: `/program/${userProgram.id}`,
      }
    : {
        eyebrow: 'Telo',
        color: TELO,
        title: isPlus ? 'Vyber si program' : 'Ranná energia',
        desc: isPlus ? 'Začni trénovať s Gabi' : '12 min · voľný cvik',
        img: '/images/r9/section-body.jpg',
        href: isPlus ? '/kniznica/telo/programy' : '/kniznica/telo',
      };

  const firstMeal = (() => {
    const m = todayPlan?.meals?.[0];
    if (!m) return null;
    const r = recipes.find((x) => x.id === m.options[m.selected]);
    if (!r) return null;
    return { recipe: r, kcal: Math.round((r.kcal ?? 0) * m.portionMultiplier) };
  })();

  // Deterministic "recipe of the day" — same recipe for everyone all day.
  const dailyRecipe = recipes.length > 0
    ? recipes[Math.floor(Date.now() / 86_400_000) % recipes.length]
    : null;

  const nutritionPick: TodayPick = hasMealPlan && firstMeal
    ? {
        eyebrow: 'Výživa',
        color: STRAVA,
        title: firstMeal.recipe.name,
        desc: `${firstMeal.kcal} kcal · dnešné menu`,
        img: recipeImage(firstMeal.recipe),
        href: '/jedalnicek',
      }
    : mealPlanNeedsSetup
    ? {
        eyebrow: 'Výživa',
        color: STRAVA,
        title: 'Dokonči svoj jedálniček',
        desc: 'Krátky dotazník · 2 min',
        img: '/images/r9/section-nutrition.jpg',
        href: '/jedalnicek/onboarding',
      }
    : dailyRecipe
    ? {
        eyebrow: 'Výživa',
        color: STRAVA,
        title: dailyRecipe.name,
        desc: [
          dailyRecipe.prep_minutes ? `${dailyRecipe.prep_minutes} min` : null,
          dailyRecipe.kcal ? `${dailyRecipe.kcal} kcal` : null,
        ].filter(Boolean).join(' · ') || 'Recept dňa',
        img: recipeImage(dailyRecipe),
        href: '/kniznica/strava',
      }
    : {
        eyebrow: 'Výživa',
        color: STRAVA,
        title: 'Recept dňa',
        desc: 'Gabine recepty',
        img: '/images/r9/section-nutrition.jpg',
        href: '/kniznica/strava',
      };

  const mindPick: TodayPick = {
    eyebrow: 'Myseľ',
    color: MYSEL,
    title: meditationTitle,
    desc: [meditation?.duration, meditation?.category].filter(Boolean).join(' · ') || 'Krátka meditácia',
    img: '/images/r9/testimonial-meditation.jpg',
    href: '/meditacie',
  };

  const picks = [bodyPick, nutritionPick, mindPick];

  // ── Periodic upsell banner ─────────────────────────────────────────────
  // On every 4th visit show ONE banner, alternating between the eligible
  // offers (program for users without one, jedálniček for users without
  // the €57 add-on). Nothing to sell → nothing shown.
  const [visitCount] = useState(countHomeVisit);
  const promoCandidates: Array<'program' | 'jedalnicek'> = [];
  if (!(isPlus && userProgram)) promoCandidates.push('program');
  if (!hasMealPlanAddon) promoCandidates.push('jedalnicek');
  const promoBanner =
    visitCount > 0 && visitCount % PROMO_INTERVAL === 0 && promoCandidates.length > 0
      ? promoCandidates[Math.floor(visitCount / PROMO_INTERVAL) % promoCandidates.length]
      : null;

  return (
    <div style={{ minHeight: '100vh', background: CREAM, paddingBottom: 90, fontFamily: SANS }}>
      <Greeting
        name={user.name}
        points={points}
        streakDays={streakDays}
        plus={isPlus}
        onPointsClick={() => setShowPointsInfo(true)}
      />

      {!isPlus && <PersistenceNotice />}

      <WeekCalendar onSelectDay={(d) => setSelectedDay(d)} />

      {selectedDay && <DayPlanSheet date={selectedDay} onClose={() => setSelectedDay(null)} />}

      {/* 1 · Periodka */}
      <SectionEyebrow color={CYKLUS}>Periodka</SectionEyebrow>
      {hasCycle && cycle ? (
        <CardCyklus day={cycle.dayOfCycle} total={cycle.totalDays} phaseName={cycle.phaseName} note={cycle.note} />
      ) : isPlus ? (
        <CardCyklusSetup />
      ) : (
        <CardCyklusFree />
      )}

      {/* 2 · Dnes pre teba — Telo / Výživa / Myseľ v kompaktnom riadku */}
      <SectionEyebrow color={GOLD}>Dnes pre teba</SectionEyebrow>
      <TodayPicksRow items={picks} />

      {promoBanner === 'program' && (
        <UpsellBanner
          color={TELO}
          eyebrow="Plus · Programy"
          title="Pridaj sa k programu"
          sub="8-týždňová cesta s Gabi · krok za krokom."
          cta="Pozrieť"
          onClick={() => navigate(isPlus ? '/kniznica/telo/programy' : '/paywall')}
        />
      )}
      {promoBanner === 'jedalnicek' && (
        <UpsellBanner
          color={STRAVA}
          eyebrow="Doplnok · Jedálniček"
          title="Naplánuj celý týždeň"
          sub="Jedlá na mieru + nákupný zoznam."
          cta="Pridať"
          price="57 €"
          onClick={() => navigate('/jedalnicek-promo')}
        />
      )}

      {/* 3 · Pracuj na sebe — návyky + reflexia */}
      <SectionEyebrow color={GOLD}>Pracuj na sebe</SectionEyebrow>
      <CardHabits free={!isPlus} onAddHabit={() => navigate('/navyky/new')} />
      <CardReflections free={!isPlus} onOpen={() => setShowDiary(true)} />

      {/* Komunita divider — plain, no bullet (visual separator between personal and community sections) */}
      <div style={{ padding: '0 22px', margin: '32px 0 0', fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase' as const, fontWeight: 500, color: FG3, fontFamily: SANS }}>Komunita</div>

      {/* Vybrala Gabi */}
      <SectionEyebrow color={TELO}>Vybrala Gabi</SectionEyebrow>
      <CardCommunity />

      {/* Subscription upsell for free users; referral only for Plus */}
      {!isPlus ? <CardSubscriptionUpsell /> : <CardReferral code={code} />}

      {showDiary      && <DiarySheet free={!isPlus} onClose={() => setShowDiary(false)} />}
      {showPointsInfo && <PointsInfoSheet points={points} onClose={() => setShowPointsInfo(false)} />}
    </div>
  );
}
