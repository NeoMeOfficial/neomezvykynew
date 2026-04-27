import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useCycleData } from '../../features/cycle/useCycleData';
import { Page, Eye, Ser, Body, PlusTag, NM } from '../../components/v2/neome';
import type { DerivedState, CycleData } from '../../features/cycle/types';

/**
 * Cyklus / Periodka — R5 dashboard
 *
 * Plus: rich one-stop dashboard with phase ring, calendar, symptoms,
 * phase advice, upcoming events.
 * Free: faded ring preview + dark Plus card + educational phase list.
 *
 * Wired:
 * - useCycleData → cycleData + derivedState (currentDay, phase,
 *   phaseRanges, today). Plus state shows real day + phase + calendar
 *   centered on today's month.
 * - isPremium gates Plus/Free view (?free=1 forces Free)
 *
 * Behavior rule (BC-4): for free users we don't persist preview
 * interactions ("Náhľad bez ukladania"). Visuals only here; the
 * persistence guard is a separate behavior PR.
 *
 * FEATURE-NEEDED-PERIODKA-SYMPTOMS: symptom log persistence (today's
 * tap state currently does nothing — needs cycle.symptoms table or
 * useCycleData extension).
 * FEATURE-NEEDED-PERIODKA-ADVICE: phase-based "ako sa môžeš cítiť
 * lepšie" rotation (currently 3 static curated rows for folikulárna).
 *
 * Old version: Periodka.old.tsx.
 */

const PHASE = {
  MENSTR: '#D69A9A',
  FOLLIC: '#A8C4A0',
  OVULAT: '#C8A8D4',
  LUTEAL: '#D4B48C',
};

function TopBar({ title, showLock = false, onBack, onSettings }: { title: string; showLock?: boolean; onBack?: () => void; onSettings?: () => void }) {
  return (
    <div style={{ padding: '58px 20px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={onBack} aria-label="Späť" style={{ all: 'unset', cursor: 'pointer', padding: 6, marginLeft: -6 }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M12 4L6 10l6 6" stroke={NM.DEEP} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div style={{ flex: 1, fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>{title}</div>
      {showLock && <PlusTag />}
      {onSettings && (
        <button onClick={onSettings} aria-label="Nastavenia" style={{ all: 'unset', cursor: 'pointer', padding: 6 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="3" y="4" width="12" height="11" rx="1.5" stroke={NM.DEEP} strokeWidth="1.3" />
            <path d="M6 3v3M12 3v3M3 8h12" stroke={NM.DEEP} strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface RingDialProps {
  faded?: boolean;
  totalDays?: number;
  currentDay?: number;
  phaseLabel?: string;
  phaseColor?: string;
  daysToNextLabel?: string;
}

function RingDial({
  faded = false,
  totalDays = 28,
  currentDay = 7,
  phaseLabel = 'Folikulárna',
  phaseColor = PHASE.FOLLIC,
  daysToNextLabel = 'ďalšia o 21 dní',
}: RingDialProps) {
  const size = 230;
  const strokeW = 16;
  const r = (size - strokeW) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const phases = [
    { s: 0, e: 5, c: PHASE.MENSTR },
    { s: 5, e: 13, c: PHASE.FOLLIC },
    { s: 13, e: 16, c: PHASE.OVULAT },
    { s: 16, e: 28, c: PHASE.LUTEAL },
  ];
  const polar = (d: number) => {
    const a = (d / totalDays) * Math.PI * 2 - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };
  const arc = (s: number, e: number) => {
    const [x1, y1] = polar(s);
    const [x2, y2] = polar(e);
    const large = e - s > totalDays / 2 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const [mx, my] = polar(currentDay);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 14px', opacity: faded ? 0.55 : 1 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} stroke={NM.HAIR} strokeWidth={strokeW} fill="none" />
        {phases.map((p, i) => (
          <path key={i} d={arc(p.s, p.e)} stroke={p.c} strokeWidth={strokeW} fill="none" strokeLinecap="butt" opacity={0.85} />
        ))}
        {[0, 7, 14, 21].map((d) => {
          const [x, y] = polar(d);
          return <circle key={d} cx={x} cy={y} r={2} fill={NM.DEEP} opacity={0.3} />;
        })}
        <circle cx={mx} cy={my} r={9} fill={NM.BG} />
        <circle cx={mx} cy={my} r={6.5} fill={NM.DEEP} />
        <text x={cx} y={cy - 18} textAnchor="middle" fontFamily="DM Sans" fontSize="9.5" letterSpacing="2.5" fill={NM.TERTIARY}>
          DEŇ
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontFamily="Gilda Display" fontSize="38" fontWeight="500" fill={NM.DEEP} letterSpacing="-0.5">
          {currentDay}
        </text>
        <text x={cx} y={cy + 32} textAnchor="middle" fontFamily="Gilda Display" fontSize="13" fontWeight="500" fill={phaseColor} fontStyle="italic">
          {phaseLabel}
        </text>
        <text x={cx} y={cy + 48} textAnchor="middle" fontFamily="DM Sans" fontSize="10" fill={NM.MUTED}>
          {daysToNextLabel}
        </text>
      </svg>
    </div>
  );
}

function PhaseLegend() {
  const items = [
    { n: 'Menštruácia', c: PHASE.MENSTR },
    { n: 'Folikulárna', c: PHASE.FOLLIC },
    { n: 'Ovulácia', c: PHASE.OVULAT },
    { n: 'Luteálna', c: PHASE.LUTEAL },
  ];
  return (
    <div style={{ padding: '0 20px 22px', display: 'flex', justifyContent: 'space-between' }}>
      {items.map((p) => (
        <div key={p.n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: p.c }} />
          <div style={{ fontFamily: NM.SANS, fontSize: 10, color: NM.MUTED }}>{p.n}</div>
        </div>
      ))}
    </div>
  );
}

interface PaidViewProps {
  navigate: (p: string) => void;
  cycleData: CycleData;
  derivedState: DerivedState | null;
}

const SK_MONTHS_FULL = ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december'];
const SK_MONTHS_SHORT_LOWER = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];

function PaidView({ navigate, cycleData, derivedState }: PaidViewProps) {
  const totalDays = cycleData.cycleLength ?? 28;
  const periodLength = cycleData.periodLength ?? 5;
  const currentDay = derivedState?.currentDay ?? 1;
  const currentPhaseKey = derivedState?.currentPhase?.key ?? 'follicular';
  const phases = derivedState?.phaseRanges ?? [
    { key: 'menstrual' as const, name: 'Menštruácia', start: 1, end: periodLength },
    { key: 'follicular' as const, name: 'Folikulárna', start: periodLength + 1, end: 13 },
    { key: 'ovulation' as const, name: 'Ovulácia', start: 14, end: 16 },
    { key: 'luteal' as const, name: 'Luteálna', start: 17, end: totalDays },
  ];
  const phaseColorByKey: Record<string, string> = {
    menstrual: PHASE.MENSTR,
    follicular: PHASE.FOLLIC,
    ovulation: PHASE.OVULAT,
    luteal: PHASE.LUTEAL,
  };
  const phaseColor = phaseColorByKey[currentPhaseKey];
  const currentPhaseName = derivedState?.currentPhase?.name ?? 'Folikulárna';
  const today = derivedState?.today ?? new Date();
  const todayDate = today.getDate();
  const monthIdx = today.getMonth();
  const yearIdx = today.getFullYear();
  const monthLabel = SK_MONTHS_FULL[monthIdx];
  const monthShort = SK_MONTHS_SHORT_LOWER[monthIdx];

  const phaseOf = (d: number) => {
    const range = phases.find((p) => d >= p.start && d <= p.end);
    return range ? phaseColorByKey[range.key] : null;
  };

  const daysToMenstruation = Math.max(0, totalDays - currentDay);
  const ovulationStart = phases.find((p) => p.key === 'ovulation')?.start ?? 14;
  const daysToOvulation = ovulationStart > currentDay ? ovulationStart - currentDay : Math.max(0, totalDays + ovulationStart - currentDay);

  // Predicted next-period date
  const nextPeriodDate = new Date(today);
  nextPeriodDate.setDate(today.getDate() + daysToMenstruation);
  const nextPeriodLabel = `${nextPeriodDate.getDate()}. ${SK_MONTHS_SHORT_LOWER[nextPeriodDate.getMonth()]}.`;

  // Headline copy adapts to phase
  const phaseHeadline: Record<string, { eye: string; before: string; em: string; body: string }> = {
    menstrual: { eye: `${monthLabel} · deň ${currentDay} z ${totalDays} · menštruácia`, before: 'Telo sa', em: 'reštartuje.', body: 'Doprajte si pokoj, teplo a jemný pohyb.' },
    follicular: { eye: `${monthLabel} · deň ${currentDay} z ${totalDays} · folikulárna`, before: 'Energia sa', em: 'vracia.', body: 'Estrogén stúpa. Skvelý čas začať niečo nové alebo vrátiť sa k náročnejším tréningom.' },
    ovulation: { eye: `${monthLabel} · deň ${currentDay} z ${totalDays} · ovulácia`, before: 'Vrchol', em: 'sily.', body: 'Najvyššia energia a sebavedomie. Sociálny, kreatívny čas.' },
    luteal: { eye: `${monthLabel} · deň ${currentDay} z ${totalDays} · luteálna`, before: 'Spomaľ a', em: 'uzemni sa.', body: 'Telo sa pripravuje na ďalší cyklus. Buď k sebe jemnejšia.' },
  };
  const head = phaseHeadline[currentPhaseKey] ?? phaseHeadline.follicular;

  // Build calendar grid for the current month, Mon-first
  type Cell = { d: number; mute?: boolean };
  const firstOfMonth = new Date(yearIdx, monthIdx, 1);
  const lastOfMonth = new Date(yearIdx, monthIdx + 1, 0);
  const lastOfPrevMonth = new Date(yearIdx, monthIdx, 0);
  const startDow = (firstOfMonth.getDay() + 6) % 7; // Mon=0
  const weeks: Cell[][] = [];
  let row: Cell[] = [];
  for (let i = startDow - 1; i >= 0; i--) {
    row.push({ d: lastOfPrevMonth.getDate() - i, mute: true });
  }
  for (let d = 1; d <= lastOfMonth.getDate(); d++) {
    row.push({ d });
    if (row.length === 7) {
      weeks.push(row);
      row = [];
    }
  }
  let next = 1;
  while (row.length > 0 && row.length < 7) {
    row.push({ d: next++, mute: true });
  }
  if (row.length === 7) weeks.push(row);

  // FEATURE-NEEDED-PERIODKA-SYMPTOMS: derive from cycle.symptoms log.
  // Today gets a marker; otherwise no symptom dots.
  const symptomDays: number[] = [todayDate];

  const symptoms = [
    { l: 'Energická', on: true },
    { l: 'Sústredená', on: true },
    { l: 'Kreatívna', on: true },
    { l: 'Spoločenská', on: false },
    { l: 'Bolesti hlavy', on: false },
    { l: 'Citlivé prsia', on: false },
    { l: 'Nafúknutá', on: false },
    { l: 'Únava', on: false },
  ];

  const advice = [
    { pillar: 'Strava', color: NM.SAGE, title: 'Komplexné sacharidy', body: 'Quinoa, sladké zemiaky — telo ich teraz dobre spracuje.', img: 'testimonial-recipe.jpg', path: '/kniznica/strava' },
    { pillar: 'Pohyb', color: NM.TERRA, title: 'Nový tréningový plán', body: 'Ideálny čas zvýšiť intenzitu a skúsiť silu.', img: 'lifestyle-core-workout.jpg', path: '/kniznica/telo' },
    { pillar: 'Myseľ', color: NM.MAUVE, title: 'Plánuj a stanov si ciele', body: 'Myseľ je jasná, optimizmus prirodzene rastie.', img: 'section-mind.jpg', path: '/kniznica/mysel' },
  ];

  return (
    <>
      <TopBar title="Cyklus" onBack={() => navigate('/domov-new')} onSettings={() => navigate('/profil')} />
      <div style={{ padding: '2px 20px 6px' }}>
        <Eye color={NM.GOLD}>{head.eye}</Eye>
        <Ser size={30} style={{ marginTop: 10, lineHeight: 1.02 }}>
          {head.before}
          <br />
          <em style={{ color: phaseColor, fontStyle: 'italic', fontWeight: 500 }}>{head.em}</em>
        </Ser>
        <Body style={{ marginTop: 10, maxWidth: 320 }}>{head.body}</Body>
      </div>

      <RingDial currentDay={currentDay} totalDays={totalDays} phaseLabel={currentPhaseName} phaseColor={phaseColor} daysToNextLabel={`menštruácia o ${daysToMenstruation} dní`} />
      <PhaseLegend />

      <div style={{ padding: '0 20px 22px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[
          { eye: 'Priemer', v: `${totalDays} dní`, c: NM.DEEP },
          { eye: 'Predpoveď', v: nextPeriodLabel, c: PHASE.MENSTR },
          { eye: 'Ovulácia', v: `o ${daysToOvulation} dní`, c: PHASE.OVULAT },
        ].map((s) => (
          <div key={s.eye} style={{ padding: '12px 10px', background: NM.CREAM_2 ?? '#F1ECE3', borderRadius: 12, textAlign: 'center' }}>
            <Eye size={9} color={NM.TERTIARY}>{s.eye}</Eye>
            <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: s.c, marginTop: 6, letterSpacing: '-0.005em' }}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <button
          // FEATURE: persists "today = period start" via existing cycle hook
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            width: '100%',
            padding: '14px 18px',
            borderRadius: 16,
            background: '#fff',
            border: `1.5px solid ${PHASE.MENSTR}`,
            alignItems: 'center',
            gap: 12,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ width: 30, height: 30, borderRadius: 999, background: PHASE.MENSTR, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l4 8a5 5 0 1 1-8 0l4-8z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP, fontWeight: 500 }}>Dnes mi začala menštruácia</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.EYEBROW, marginTop: 2, fontWeight: 300 }}>Zaznamenať začiatok cyklu</div>
          </div>
          <div style={{ color: PHASE.MENSTR, fontSize: 18 }}>›</div>
        </button>
      </div>

      <div style={{ padding: '0 20px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <Eye>Kalendár cyklu</Eye>
          <div style={{ fontFamily: NM.SERIF, fontSize: 14, color: NM.DEEP, fontWeight: 500, fontStyle: 'italic' }}>{monthLabel} {yearIdx}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 5 }}>
          {['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'].map((d) => (
            <div key={d} style={{ fontFamily: NM.SANS, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: NM.EYEBROW, textAlign: 'center', fontWeight: 500 }}>
              {d}
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
          {weeks.flat().map((c, i) => {
            const phCol = !c.mute ? phaseOf(c.d) : null;
            const today = !c.mute && c.d === todayDate;
            const sym = !c.mute && symptomDays.includes(c.d);
            return (
              <div
                key={i}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 8,
                  background: today ? NM.DEEP : phCol ? phCol + '38' : 'transparent',
                  border: today ? 'none' : phCol ? `1px solid ${phCol}66` : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontFamily: NM.SERIF, fontSize: 13, fontWeight: today ? 500 : 400, color: today ? '#fff' : c.mute ? 'rgba(61,41,33,0.25)' : NM.DEEP }}>{c.d}</div>
                {sym && (
                  <div style={{ position: 'absolute', bottom: 2.5, display: 'flex', gap: 1.5 }}>
                    {[0, 1, 2].map((k) => (
                      <div key={k} style={{ width: 2, height: 2, borderRadius: 999, background: today ? '#fff' : NM.DEEP, opacity: today ? 1 : 0.55 }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '26px 20px 0' }}>
        <Eye style={{ marginBottom: 12 }}>Ako sa dnes cítiš</Eye>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {symptoms.map((s) => (
            <div
              key={s.l}
              style={{
                padding: '7px 12px',
                borderRadius: 999,
                background: s.on ? NM.DEEP : '#fff',
                color: s.on ? '#fff' : NM.DEEP,
                border: s.on ? 'none' : `1px solid ${NM.HAIR_2}`,
                fontFamily: NM.SANS,
                fontSize: 12,
                fontWeight: s.on ? 400 : 300,
              }}
            >
              {s.l}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '28px 20px 0' }}>
        <Eye style={{ marginBottom: 6 }}>Pre folikulárnu fázu</Eye>
        <Ser size={20} style={{ marginTop: 8, lineHeight: 1.2 }}>
          Ako sa dnes môžeš cítiť <em style={{ color: PHASE.FOLLIC, fontWeight: 500, fontStyle: 'italic' }}>ešte lepšie</em>
        </Ser>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column' }}>
          {advice.map((r, i) => (
            <button
              key={r.pillar}
              onClick={() => navigate(r.path)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: '14px 0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                borderBottom: i < advice.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
              }}
            >
              <div style={{ width: 52, height: 66, borderRadius: 8, backgroundImage: `url(/images/r9/${r.img})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Eye size={8.5} color={r.color}>{r.pillar}</Eye>
                <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: NM.DEEP, marginTop: 3, letterSpacing: '-0.005em' }}>{r.title}</div>
                <Body size={11.5} style={{ marginTop: 4 }}>{r.body}</Body>
              </div>
              <div style={{ color: NM.EYEBROW, fontSize: 14, marginTop: 4 }}>›</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 20px 8px' }}>
        <Eye style={{ marginBottom: 12 }}>Čaká ťa</Eye>
        <div>
          {[
            { w: 'O 7 dní', t: 'Začiatok ovulácie', c: PHASE.OVULAT },
            { w: 'O 21 dní', t: 'Nasledujúca menštruácia', c: PHASE.MENSTR },
          ].map((u, i, arr) => (
            <div
              key={u.t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 0',
                borderBottom: i < arr.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: 999, background: u.c }} />
              <div style={{ flex: 1, fontFamily: NM.SANS, fontSize: 13, color: NM.DEEP }}>{u.t}</div>
              <div style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED }}>{u.w}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function FreeView({ navigate }: { navigate: (p: string) => void }) {
  const phases = [
    { pillar: 'Menštruácia', c: PHASE.MENSTR, d: 'Telo sa resetuje. Doprajte si pokoj, teplo a jemný pohyb.' },
    { pillar: 'Folikulárna', c: PHASE.FOLLIC, d: 'Energia rastie. Skvelý čas na nové výzvy a silový tréning.' },
    { pillar: 'Ovulácia', c: PHASE.OVULAT, d: 'Vrchol energie a sebavedomia. Sociálny, kreatívny čas.' },
    { pillar: 'Luteálna', c: PHASE.LUTEAL, d: 'Spomaľ a ukľudni sa. Telo sa pripravuje na ďalší cyklus.' },
  ];
  return (
    <>
      <TopBar title="Cyklus" showLock onBack={() => navigate('/domov-new')} />
      <div style={{ padding: '2px 20px 6px' }}>
        <Eye color={NM.GOLD}>Dostupné s NeoMe Plus</Eye>
        <Ser size={30} style={{ marginTop: 10, lineHeight: 1.02 }}>
          Spoznaj svoj
          <br />
          <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>cyklus.</em>
        </Ser>
        <Body style={{ marginTop: 10, maxWidth: 320 }}>
          Sleduj fázy, príznaky a energiu. Získaj predpovede menštruácie a odporúčania pre tvoju aktuálnu fázu.
        </Body>
      </div>

      <div style={{ position: 'relative' }}>
        <RingDial faded />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 40%, rgba(248,245,240,0.7) 80%)', pointerEvents: 'none' }} />
      </div>
      <PhaseLegend />

      <div style={{ padding: '0 20px 22px' }}>
        <div style={{ padding: '24px 22px', borderRadius: 22, background: `linear-gradient(135deg, ${NM.DEEP} 0%, ${NM.DEEP_2} 100%)`, color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 140, height: 140, borderRadius: 999, background: `radial-gradient(circle, ${NM.GOLD}44, transparent 70%)` }} />
          <div style={{ position: 'relative' }}>
            <Eye color={NM.GOLD} style={{ marginBottom: 12 }}>NeoMe Plus</Eye>
            <Ser size={22} color="#fff" style={{ lineHeight: 1.12, marginBottom: 10 }}>
              Odomkni sledovanie
              <br />
              <em style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>cyklu a fáz.</em>
            </Ser>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '16px 0 18px' }}>
              {[
                'Sledovanie 28-dňového cyklu a fáz',
                'Predpovede menštruácie a ovulácie',
                'Záznam príznakov a energie',
                'Tipy na stravu a pohyb pre každú fázu',
              ].map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3 3 7-7" stroke={NM.GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div style={{ fontFamily: NM.SANS, fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>{b}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/paywall')}
              style={{
                width: '100%',
                padding: '14px 20px',
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
              Aktivovať NeoMe Plus
            </button>
            <div style={{ textAlign: 'center', marginTop: 10, fontFamily: NM.SANS, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              9,99 € / mesiac · zrušenie kedykoľvek
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '8px 20px 0' }}>
        <Eye style={{ marginBottom: 6 }}>Zatiaľ si prečítaj</Eye>
        <Ser size={20} style={{ marginTop: 8, marginBottom: 14, lineHeight: 1.2 }}>
          Ako <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>funguje</em> cyklus
        </Ser>
        <div>
          {phases.map((p, i, arr) => (
            <div key={p.pillar} style={{ padding: '12px 0', display: 'flex', alignItems: 'flex-start', gap: 12, borderBottom: i < arr.length - 1 ? `1px solid ${NM.HAIR}` : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: 999, background: p.c, marginTop: 8, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: NM.SERIF, fontSize: 14, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>{p.pillar}</div>
                <Body size={12} style={{ marginTop: 3 }}>{p.d}</Body>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function Periodka() {
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { cycleData, derivedState } = useCycleData();
  const forceFree = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('free');
  const hasCycleSetup = !!cycleData?.lastPeriodStart;
  // Plus + cycle data → rich dashboard. Otherwise → upsell/onboarding view.
  const showPlus = isPremium && !forceFree && hasCycleSetup;

  return (
    <Page>
      {showPlus && cycleData ? (
        <PaidView navigate={navigate} cycleData={cycleData} derivedState={derivedState} />
      ) : (
        <FreeView navigate={navigate} />
      )}
    </Page>
  );
}
