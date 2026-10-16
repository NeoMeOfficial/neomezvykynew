import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NM, Eye } from '../../../components/v2/neome';
import { PlusPage, TopBar, HeroHead, StickyCTA } from './shared';
import { useCycleData } from '../../../features/cycle/useCycleData';

/**
 * /onboarding-plus/cyklus — light cycle setup: last period date + cycle
 * length slider. Cycle data is observational only; it is not used to
 * auto-adjust programs or nutrition.
 */

function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const SK_MONTHS = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];

// A single date row: big serif "deň. mesiac" with a "Zmeniť" link that swaps
// in a native date picker. Manages its own edit state.
function DateField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: Date;
  min?: string;
  max?: string;
  onChange: (d: Date) => void;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <>
      <Eye size={10} style={{ marginBottom: 14 }}>{label}</Eye>
      {editing ? (
        <input
          type="date"
          value={toLocalISODate(value)}
          min={min}
          max={max}
          onChange={(e) => {
            if (e.target.value) onChange(new Date(e.target.value));
          }}
          onBlur={() => setEditing(false)}
          autoFocus
          style={{
            width: '100%',
            padding: '10px 12px',
            marginBottom: 18,
            fontFamily: NM.SANS,
            fontSize: 16,
            border: `1px solid ${NM.HAIR_2}`,
            borderRadius: 12,
            color: NM.DEEP,
            background: '#fff',
          }}
        />
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 18 }}>
          <span style={{ fontFamily: NM.SERIF, fontSize: 32, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.02em' }}>
            {value.getDate()}.
          </span>
          <span style={{ fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, color: NM.MUTED, letterSpacing: '-0.01em' }}>
            {SK_MONTHS[value.getMonth()]}
          </span>
          <button
            onClick={() => setEditing(true)}
            style={{
              marginLeft: 'auto',
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              fontFamily: NM.SANS,
              fontSize: 12,
              color: NM.TERTIARY,
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              fontWeight: 400,
            }}
          >
            Zmeniť
          </button>
        </div>
      )}
    </>
  );
}

export default function PlusCycleInfo() {
  const navigate = useNavigate();
  const { correctPeriod, setCycleLength: persistCycleLength, cycleData } = useCycleData();
  const today = useMemo(() => new Date(), []);
  const defaultStart = () => {
    if (cycleData?.lastPeriodStart) return new Date(cycleData.lastPeriodStart);
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d;
  };
  const [periodDate, setPeriodDate] = useState<Date>(defaultStart);
  const [endDate, setEndDate] = useState<Date>(() => {
    if (cycleData?.currentPeriodEnd) return new Date(cycleData.currentPeriodEnd);
    const e = new Date(defaultStart());
    e.setDate(e.getDate() + ((cycleData?.periodLength ?? 5) - 1));
    return e;
  });
  const [cycleLength, setCycleLength] = useState<number>(cycleData?.cycleLength ?? 28);

  // Keep start ≤ end ≤ today whichever date the user edits.
  const changeStart = (d: Date) => {
    setPeriodDate(d);
    if (endDate < d) setEndDate(d);
  };
  const changeEnd = (d: Date) => {
    let e = d;
    if (e < periodDate) e = periodDate;
    if (e > today) e = today;
    setEndDate(e);
  };
  const bleedDays = Math.max(1, Math.round((endDate.getTime() - periodDate.getTime()) / 86400000) + 1);

  const saveAndNext = () => {
    // correctPeriod saves start + end atomically and derives the bleed
    // length (periodLength) from the two dates.
    correctPeriod(periodDate, endDate);
    persistCycleLength(cycleLength);
    navigate('/onboarding-plus/hotovo');
  };

  const skipNoCycle = () => navigate('/onboarding-plus/hotovo');

  return (
    <PlusPage>
      <TopBar
        onBack={() => navigate('/onboarding-plus/program')}
        centerLabel="Nastav si svoju NeoMe"
      />
      <HeroHead
        eyebrow="Periodka"
        title="Tvoj cyklus,"
        accentTitle="tvoj rytmus."
        accentColor={NM.MAUVE}
        helper="Spoznaj, čo sa s tebou deje v jednotlivých fázach, a získaj tipy, ktoré ti pomôžu cítiť sa lepšie."
        size={30}
      />

      <div style={{ padding: '28px 22px 0' }}>
        <div
          style={{
            padding: '20px 20px',
            background: '#fff',
            border: `1px solid ${NM.HAIR}`,
            borderRadius: 18,
          }}
        >
          {/* Last period — start date */}
          <DateField
            label="Posledná menštruácia začala"
            value={periodDate}
            max={toLocalISODate(today)}
            onChange={changeStart}
          />

          <div style={{ height: 1, background: NM.HAIR, marginBottom: 18 }} />

          {/* Last period — end date. Together with the start it gives us the
              bleed length (how many days she actually bleeds). */}
          <DateField
            label="Posledná menštruácia skončila"
            value={endDate}
            min={toLocalISODate(periodDate)}
            max={toLocalISODate(today)}
            onChange={changeEnd}
          />
          <div
            style={{
              marginTop: -6,
              marginBottom: 18,
              fontFamily: NM.SANS,
              fontSize: 12.5,
              color: NM.MAUVE,
              fontWeight: 500,
            }}
          >
            Krvácanie {bleedDays} {bleedDays === 1 ? 'deň' : bleedDays <= 4 ? 'dni' : 'dní'}
          </div>

          <div style={{ height: 1, background: NM.HAIR, marginBottom: 18 }} />

          {/* Cycle length */}
          <Eye size={10} style={{ marginBottom: 12 }}>Priemerná dĺžka cyklu</Eye>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
            <span style={{ fontFamily: NM.SERIF, fontSize: 38, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.025em' }}>
              {cycleLength}
            </span>
            <span style={{ fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED, fontWeight: 400 }}>dní</span>
          </div>
          <input
            type="range"
            min={21}
            max={35}
            value={cycleLength}
            onChange={(e) => setCycleLength(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: NM.MAUVE,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontFamily: NM.SANS, fontSize: 10, color: NM.TERTIARY }}>21 dní</span>
            <span style={{ fontFamily: NM.SANS, fontSize: 10, color: NM.TERTIARY }}>35 dní</span>
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            padding: '12px 16px',
            background: 'rgba(168,132,139,0.10)',
            border: `1px solid rgba(168,132,139,0.26)`,
            borderRadius: 14,
            fontFamily: NM.SANS,
            fontSize: 11.5,
            color: NM.DEEP,
            fontWeight: 300,
            lineHeight: 1.55,
          }}
        >
          Nevadí, ak nevieš presne — odhad upravíme po prvých dvoch cykloch.
        </div>
      </div>

      <StickyCTA
        label="Pokračovať"
        onClick={saveAndNext}
        onSkip={skipNoCycle}
        skipLabel="Nemám pravidelný cyklus"
      />
    </PlusPage>
  );
}
