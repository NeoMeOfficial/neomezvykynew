import { useState, type CSSProperties } from 'react';
import GlassCard from '../../components/v2/GlassCard';
import type { NutritionProfile } from './types';

/* ─── constants ─── */
const PRIMARY = '#6B4C3B';
const ACCENT = '#B8864A';
const MUTED = '#777';
const MUTED_LIGHT = '#888';
const TOTAL_STEPS = 7;

type Goal = 'lose' | 'maintain' | 'gain';
type Activity = 'sedentary' | 'light' | 'moderate' | 'active';
type Diet = 'normal' | 'vegetarian' | 'vegan';
type Allergy = 'gluten' | 'dairy' | 'nuts' | 'eggs' | 'soy';

const ACTIVITY_MULTIPLIER: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};
const GOAL_OFFSET: Record<Goal, number> = { lose: -300, maintain: 0, gain: 250 };

const ALLERGY_LABELS: { key: Allergy; label: string }[] = [
  { key: 'gluten', label: 'Lepok' },
  { key: 'dairy', label: 'Mliečne' },
  { key: 'nuts', label: 'Orechy' },
  { key: 'eggs', label: 'Vajcia' },
  { key: 'soy', label: 'Sója' },
];

/* ─── styles ─── */
const s: Record<string, CSSProperties> = {
  wrap: {
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(to bottom, #FAF7F2, #F5F1E8)',
    fontFamily: 'Lufga, sans-serif',
    color: PRIMARY,
    position: 'relative',
    overflow: 'hidden',
  },
  progressBar: {
    height: 3,
    background: 'rgba(0,0,0,0.06)',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    background: ACCENT,
    transition: 'width 0.4s ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 16px 0',
    minHeight: 44,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: 22,
    cursor: 'pointer',
    color: PRIMARY,
    padding: 0,
    lineHeight: 1,
  },
  body: {
    flex: 1,
    padding: '8px 16px 0',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  footer: {
    padding: '12px 16px 24px',
    paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
    flexShrink: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    marginBottom: 20,
    color: PRIMARY,
  },
  optionCard: {
    padding: '16px 18px',
    marginBottom: 10,
    cursor: 'pointer',
    transition: 'border 0.2s ease',
  },
  emoji: { fontSize: 22, marginRight: 10 },
  optionTitle: { fontSize: 13, fontWeight: 600, color: PRIMARY },
  optionDesc: { fontSize: 12, color: MUTED_LIGHT, marginTop: 2 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 12, color: MUTED, marginBottom: 6, display: 'block' },
  input: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1.5px solid rgba(0,0,0,0.12)`,
    padding: '8px 0',
    fontSize: 15,
    fontWeight: 600,
    color: PRIMARY,
    outline: 'none',
    fontFamily: 'Lufga, sans-serif',
  },
  pill: {
    padding: '10px 20px',
    borderRadius: 50,
    border: `1.5px solid rgba(0,0,0,0.08)`,
    background: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: PRIMARY,
  },
  pillSelected: {
    background: ACCENT,
    color: '#fff',
    borderColor: ACCENT,
  },
  chip: {
    padding: '8px 16px',
    borderRadius: 50,
    border: `1.5px solid rgba(0,0,0,0.08)`,
    background: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: PRIMARY,
  },
  chipSelected: {
    background: `${ACCENT}22`,
    borderColor: ACCENT,
    color: PRIMARY,
  },
  nextBtn: {
    padding: '16px',
    borderRadius: 16,
    border: 'none',
    background: PRIMARY,
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'Lufga, sans-serif',
    transition: 'opacity 0.2s',
  },
  summaryValue: {
    fontSize: 40,
    fontWeight: 700,
    color: PRIMARY,
    textAlign: 'center' as const,
  },
  summaryLabel: {
    fontSize: 12,
    color: MUTED,
    textAlign: 'center' as const,
    marginBottom: 20,
  },
  macroRow: {
    display: 'flex',
    justifyContent: 'space-around',
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  macroVal: { fontSize: 18, fontWeight: 700, color: PRIMARY },
  macroLabel: { fontSize: 11, color: MUTED },
};

/* ─── component ─── */
function getNextMondays(count: number): Date[] {
  const mondays: Date[] = [];
  const d = new Date();
  // Find next Monday
  const dayOfWeek = d.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : dayOfWeek === 1 ? 7 : 8 - dayOfWeek;
  const nextMon = new Date(d);
  nextMon.setDate(d.getDate() + daysUntilMonday);
  nextMon.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const m = new Date(nextMon);
    m.setDate(nextMon.getDate() + i * 7);
    mondays.push(m);
  }
  return mondays;
}

function formatDate(d: Date): string {
  const days = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];
  const months = ['jan', 'feb', 'mar', 'apr', 'máj', 'jún', 'júl', 'aug', 'sep', 'okt', 'nov', 'dec'];
  return `${days[d.getDay()]} ${d.getDate()}. ${months[d.getMonth()]}`;
}

export default function NutritionOnboarding({
  onComplete,
}: {
  onComplete: (profile: NutritionProfile, startDate: Date) => void;
}) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [activity, setActivity] = useState<Activity | null>(null);
  const [meals, setMeals] = useState<3 | 4 | 5 | null>(null);
  const [diet, setDiet] = useState<Diet>('normal');
  const [allergies, setAllergies] = useState<Set<Allergy>>(new Set());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const mondays = getNextMondays(4);

  const canNext = (): boolean => {
    switch (step) {
      case 1: return goal !== null;
      case 2: return weight !== '' && height !== '' && age !== '';
      case 3: return activity !== null;
      case 4: return meals !== null;
      case 5: return true;
      case 6: return true;
      case 7: return startDate !== null;
      default: return false;
    }
  };

  const calcCalories = () => {
    const w = parseFloat(weight) || 60;
    const h = parseFloat(height) || 165;
    const a = parseFloat(age) || 25;
    const bmr = 10 * w + 6.25 * h - 5 * a - 161;
    const tdee = bmr * ACTIVITY_MULTIPLIER[activity || 'sedentary'];
    return Math.round(tdee + GOAL_OFFSET[goal || 'maintain']);
  };

  const calcMacros = (cal: number) => ({
    protein: Math.round((cal * 0.3) / 4),
    carbs: Math.round((cal * 0.4) / 4),
    fat: Math.round((cal * 0.3) / 9),
  });

  const handleComplete = () => {
    const cal = calcCalories();
    const macros = calcMacros(cal);
    onComplete({
      goal: goal!,
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseInt(age),
      activityLevel: activity!,
      mealsPerDay: meals!,
      dietType: diet === 'normal' ? 'standard' : diet,
      allergies: Array.from(allergies),
      dailyCalories: cal,
      dailyProtein: macros.protein,
      dailyCarbs: macros.carbs,
      dailyFat: macros.fat,
    }, startDate!);
  };

  const toggleAllergy = (a: Allergy) => {
    setAllergies((prev) => {
      const next = new Set(prev);
      next.has(a) ? next.delete(a) : next.add(a);
      return next;
    });
  };

  const selectedBorder = { border: `1.5px solid ${ACCENT}` };

  /* ─── step renderers ─── */

  const renderStep1 = () => (
    <>
      <div style={s.title}>Aký je tvoj cieľ?</div>
      {([
        { key: 'lose', emoji: '🔥', title: 'Chudnutie', desc: 'Zdravé zníženie hmotnosti' },
        { key: 'maintain', emoji: '⚖️', title: 'Udržanie', desc: 'Udržať si aktuálnu váhu' },
        { key: 'gain', emoji: '💪', title: 'Naberanie', desc: 'Budovanie svalovej hmoty' },
      ] as const).map((o) => (
        <GlassCard
          key={o.key}
          onClick={() => setGoal(o.key)}
          style={{ ...s.optionCard, ...(goal === o.key ? selectedBorder : {}) }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={s.emoji}>{o.emoji}</span>
            <div>
              <div style={s.optionTitle}>{o.title}</div>
              <div style={s.optionDesc}>{o.desc}</div>
            </div>
          </div>
        </GlassCard>
      ))}
    </>
  );

  const renderStep2 = () => (
    <>
      <div style={s.title}>Povedz mi o sebe</div>
      <GlassCard style={{ padding: '20px 18px' }}>
        <div style={s.inputGroup}>
          <label style={s.label}>Váha (kg)</label>
          <input
            style={s.input}
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="65"
          />
        </div>
        <div style={s.inputGroup}>
          <label style={s.label}>Výška (cm)</label>
          <input
            style={s.input}
            type="number"
            inputMode="decimal"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="168"
          />
        </div>
        <div style={s.inputGroup}>
          <label style={s.label}>Vek</label>
          <input
            style={s.input}
            type="number"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="28"
          />
        </div>
      </GlassCard>
    </>
  );

  const renderStep3 = () => (
    <>
      <div style={s.title}>Ako aktívna si?</div>
      {([
        { key: 'sedentary', emoji: '🛋️', title: 'Sedavý', desc: 'Prevažne sedím, minimum pohybu' },
        { key: 'light', emoji: '🚶‍♀️', title: 'Mierne aktívna', desc: 'Cvičím 1-2x týždenne' },
        { key: 'moderate', emoji: '🏃‍♀️', title: 'Stredne aktívna', desc: 'Cvičím 3-4x týždenne' },
        { key: 'active', emoji: '⚡', title: 'Veľmi aktívna', desc: 'Cvičím 5+ krát týždenne' },
      ] as const).map((o) => (
        <GlassCard
          key={o.key}
          onClick={() => setActivity(o.key)}
          style={{ ...s.optionCard, ...(activity === o.key ? selectedBorder : {}) }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={s.emoji}>{o.emoji}</span>
            <div>
              <div style={s.optionTitle}>{o.title}</div>
              <div style={s.optionDesc}>{o.desc}</div>
            </div>
          </div>
        </GlassCard>
      ))}
    </>
  );

  const renderStep4 = () => (
    <>
      <div style={s.title}>Koľkokrát denne jesz?</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {([
          { n: 3 as const, desc: '3 hlavné jedlá' },
          { n: 4 as const, desc: '3 + 1 desiata' },
          { n: 5 as const, desc: '3 + 2 desiatky' },
        ]).map((o) => (
          <button
            key={o.n}
            onClick={() => setMeals(o.n)}
            style={{
              ...s.pill,
              ...(meals === o.n ? s.pillSelected : {}),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700 }}>{o.n}</span>
            <span style={{ fontSize: 11, opacity: 0.8 }}>{o.desc}</span>
          </button>
        ))}
      </div>
    </>
  );

  const renderStep5 = () => (
    <>
      <div style={s.title}>Máš obmedzenia v strave?</div>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>Typ diéty</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {([
          { key: 'normal' as const, label: 'Bežná' },
          { key: 'vegetarian' as const, label: 'Vegetariánska' },
          { key: 'vegan' as const, label: 'Vegánska' },
        ]).map((o) => (
          <button
            key={o.key}
            onClick={() => setDiet(o.key)}
            style={{ ...s.pill, ...(diet === o.key ? s.pillSelected : {}) }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>Alergie</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {ALLERGY_LABELS.map((a) => (
          <button
            key={a.key}
            onClick={() => toggleAllergy(a.key)}
            style={{ ...s.chip, ...(allergies.has(a.key) ? s.chipSelected : {}) }}
          >
            {a.label}
          </button>
        ))}
      </div>
    </>
  );

  const renderStep6 = () => {
    const cal = calcCalories();
    const macros = calcMacros(cal);
    return (
      <>
        <div style={s.title}>Tvoj plán je pripravený</div>
        <GlassCard style={{ padding: '28px 20px' }}>
          <div style={s.summaryValue}>{cal}</div>
          <div style={s.summaryLabel}>kcal denne</div>
          <div style={s.macroRow}>
            <div>
              <div style={s.macroVal}>{macros.protein}g</div>
              <div style={s.macroLabel}>Bielkoviny</div>
            </div>
            <div>
              <div style={s.macroVal}>{macros.carbs}g</div>
              <div style={s.macroLabel}>Sacharidy</div>
            </div>
            <div>
              <div style={s.macroVal}>{macros.fat}g</div>
              <div style={s.macroLabel}>Tuky</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: MUTED, marginTop: 12 }}>
            {meals} jedál denne
          </div>
        </GlassCard>
      </>
    );
  };

  const renderStep7 = () => (
    <>
      <div style={s.title}>Kedy chceš začať?</div>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>
        Jedálniček vždy začína v pondelok
      </div>
      {mondays.map((m) => (
        <GlassCard
          key={m.toISOString()}
          onClick={() => setStartDate(m)}
          style={{
            ...s.optionCard,
            ...(startDate?.toISOString() === m.toISOString() ? selectedBorder : {}),
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>📅</span>
            <div>
              <div style={s.optionTitle}>{formatDate(m)}</div>
              <div style={s.optionDesc}>
                {m.getTime() - Date.now() < 7 * 86400000 ? 'Tento pondelok' : `O ${Math.ceil((m.getTime() - Date.now()) / 86400000)} dní`}
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </>
  );

  const steps = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6, renderStep7];

  return (
    <div style={s.wrap}>
      {/* progress bar */}
      <div style={s.progressBar}>
        <div style={{ ...s.progressFill, width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      {/* header with back */}
      <div style={s.header}>
        {step > 1 && (
          <button style={s.backBtn} onClick={() => setStep((p) => p - 1)} aria-label="Späť">
            ←
          </button>
        )}
      </div>

      {/* body — scrollable */}
      <div style={s.body}>
        {steps[step - 1]()}
      </div>

      {/* CTA — always visible at bottom */}
      <div style={s.footer}>
        {step < 7 ? (
          <button
            style={{ ...s.nextBtn, opacity: canNext() ? 1 : 0.4, width: '100%' }}
            disabled={!canNext()}
            onClick={() => setStep((p) => p + 1)}
          >
            Ďalej
          </button>
        ) : (
          <button style={{ ...s.nextBtn, width: '100%' }} onClick={handleComplete}>
            Vygenerovať jedálniček
          </button>
        )}
      </div>
    </div>
  );
}
