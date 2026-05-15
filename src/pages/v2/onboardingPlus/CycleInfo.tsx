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

const SK_MONTHS = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];

export default function PlusCycleInfo() {
  const navigate = useNavigate();
  const { saveCycleData, cycleData } = useCycleData();
  const today = useMemo(() => new Date(), []);
  const [periodDate, setPeriodDate] = useState<Date>(() => {
    if (cycleData?.lastPeriodStart) return new Date(cycleData.lastPeriodStart);
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d;
  });
  const [cycleLength, setCycleLength] = useState<number>(cycleData?.cycleLength ?? 28);
  const [editingDate, setEditingDate] = useState(false);

  const saveAndNext = () => {
    saveCycleData({
      ...(cycleData ?? { customSettings: {} as never, periodLength: 5 }),
      lastPeriodStart: periodDate.toISOString().slice(0, 10),
      cycleLength,
      periodLength: cycleData?.periodLength ?? 5,
      customSettings: cycleData?.customSettings ?? ({} as never),
    });
    navigate('/onboarding-plus/jedalnicek');
  };

  const skipNoCycle = () => navigate('/onboarding-plus/jedalnicek');

  return (
    <PlusPage>
      <TopBar
        onBack={() => navigate('/onboarding-plus/program')}
        centerLabel="Cyklus"
      />
      <HeroHead
        eyebrow="Cyklus"
        title="Tvoj"
        accentTitle="rytmus."
        accentColor={NM.MAUVE}
        helper="Spoznaj, čo sa s tebou deje v jednotlivých fázach — energia, nálada, chute, spánok. Nič ti neprispôsobujeme; iba ti dáme jazyk, ktorým si vieš lepšie porozumieť."
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
          {/* Last period start */}
          <Eye size={10} style={{ marginBottom: 14 }}>Posledná menštruácia začala</Eye>
          {editingDate ? (
            <input
              type="date"
              value={periodDate.toISOString().slice(0, 10)}
              max={today.toISOString().slice(0, 10)}
              onChange={(e) => {
                if (e.target.value) setPeriodDate(new Date(e.target.value));
              }}
              onBlur={() => setEditingDate(false)}
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
                {periodDate.getDate()}.
              </span>
              <span style={{ fontFamily: NM.SERIF, fontSize: 18, fontWeight: 500, color: NM.MUTED, letterSpacing: '-0.01em' }}>
                {SK_MONTHS[periodDate.getMonth()]}
              </span>
              <button
                onClick={() => setEditingDate(true)}
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
