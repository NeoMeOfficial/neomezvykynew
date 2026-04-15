import { useState, type CSSProperties } from 'react';
import GlassCard from '../../components/v2/GlassCard';
import type { NutritionProfile } from './types';

/* ─── constants ─── */
const PRIMARY = '#6B4C3B';
const ACCENT = '#B8864A';
const MUTED = '#777';
const MUTED_LIGHT = '#888';
const GREEN = '#7A9E78';
const TOTAL_STEPS = 7;

type Goal = 'lose' | 'maintain' | 'gain';
type Activity = 'sedentary' | 'light' | 'moderate' | 'active';
type Diet = 'normal' | 'vegetarian';
type Allergy = 'gluten' | 'dairy' | 'nuts' | 'eggs' | 'soy';
type FavMeal = 'ranajky' | 'obed' | 'vecera' | 'snack';

const INGREDIENT_SUGGESTIONS = [
  'Kura', 'Hovädzie', 'Losos', 'Tuniak', 'Krevety', 'Vajcia', 'Tofu', 'Tempeh',
  'Ryža', 'Quinoa', 'Ovsené vločky', 'Batáty', 'Zemiaky', 'Celozrnná pasta',
  'Avokádo', 'Brokolica', 'Špenát', 'Mrkva', 'Paradajky', 'Uhorka',
  'Paprika', 'Cibuľa', 'Cesnak', 'Cícer', 'Šošovica', 'Čierne fazule',
  'Banán', 'Jablko', 'Jahody', 'Borůvky', 'Pomaranč', 'Mango',
  'Olivový olej', 'Mandle', 'Vlašské orechy', 'Kešu', 'Arašidové maslo',
  'Grécky jogurt', 'Tvaroh', 'Feta', 'Mozzarella', 'Sójové mlieko', 'Ovos',
  'Hummus', 'Tahini', 'Pesto', 'Sriracha', 'Sójová omáčka',
];

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

/* ─── waist risk thresholds (WHO) ─── */
function getWaistRisk(waistCm: number): { level: 'ok' | 'elevated' | 'high'; label: string; color: string; desc: string } {
  if (waistCm < 80) return {
    level: 'ok',
    label: 'Nízke riziko',
    color: GREEN,
    desc: 'Obvod pása je v zdravom rozmedzí.',
  };
  if (waistCm <= 88) return {
    level: 'elevated',
    label: 'Zvýšené riziko',
    color: ACCENT,
    desc: 'Zvýšené riziko kardiovaskulárnych ochorení. Viscerálny (vnútrobrušný) tuk môže ovplyvňovať hormóny a metabolizmus.',
  };
  return {
    level: 'high',
    label: 'Vysoké riziko',
    color: '#C27A6E',
    desc: 'Vysoká hladina viscerálneho tuku zvyšuje riziko cukrovky 2. typu, srdcových ochorení a hormonálnej nerovnováhy. Výživa môže výrazne pomôcť.',
  };
}

/* ─── Stacy Sims–based macro calculation ─── */
function calcNutrition(w: number, h: number, a: number, activity: Activity, goal: Goal) {
  const bmr = 10 * w + 6.25 * h - 5 * a - 161;
  const tdee = bmr * ACTIVITY_MULTIPLIER[activity];
  const targetCal = Math.round(tdee + GOAL_OFFSET[goal]);

  // Protein — Stacy Sims protocol
  const proteinPerKg = a >= 38 ? 2.2 : 1.8;
  const proteinG = Math.round(w * proteinPerKg);
  const proteinCal = proteinG * 4;

  // Fat — 27% of total calories
  const fatCal = Math.round(targetCal * 0.27);
  const fatG = Math.round(fatCal / 9);

  // Carbs — remaining
  const carbCal = Math.max(0, targetCal - proteinCal - fatCal);
  const carbG = Math.round(carbCal / 4);

  // Fiber — 4th macronutrient
  const fiberG = a >= 38 ? 30 : 25;

  const proteinPct = Math.round((proteinCal / targetCal) * 100);
  const carbPct = Math.round((carbCal / targetCal) * 100);

  return { targetCal, proteinG, carbG, fatG, fiberG, proteinPerKg, proteinPct, carbPct };
}

/* ─── date helpers ─── */
function getNextMondays(count: number): Date[] {
  const mondays: Date[] = [];
  const d = new Date();
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

/* ─── styles ─── */
const s: Record<string, CSSProperties> = {
  wrap: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(to bottom, #FAF7F2, #F5F1E8)',
    fontFamily: 'DM Sans, sans-serif',
    color: PRIMARY,
    overflow: 'hidden',
    zIndex: 60,
  },
  progressBar: { height: 3, background: 'rgba(0,0,0,0.06)', width: '100%' },
  progressFill: { height: '100%', background: ACCENT, transition: 'width 0.4s ease' },
  header: { display: 'flex', alignItems: 'center', padding: '16px 16px 0', minHeight: 44 },
  backBtn: { background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: PRIMARY, padding: 0, lineHeight: 1 },
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
  title: { fontSize: 15, fontWeight: 600, marginBottom: 20, color: PRIMARY },
  optionCard: { padding: '16px 18px', marginBottom: 10, cursor: 'pointer', transition: 'border 0.2s ease' },
  emoji: { fontSize: 22, marginRight: 10 },
  optionTitle: { fontSize: 13, fontWeight: 600, color: PRIMARY },
  optionDesc: { fontSize: 12, color: MUTED_LIGHT, marginTop: 2 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 12, color: MUTED, marginBottom: 6, display: 'block' },
  labelOptional: { fontSize: 12, color: MUTED_LIGHT, marginBottom: 6, display: 'block' },
  input: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1.5px solid rgba(0,0,0,0.12)',
    padding: '8px 0',
    fontSize: 15,
    fontWeight: 600,
    color: PRIMARY,
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif',
  },
  pill: {
    padding: '10px 20px',
    borderRadius: 50,
    border: '1.5px solid rgba(0,0,0,0.08)',
    background: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: PRIMARY,
  },
  pillSelected: { background: ACCENT, color: '#fff', borderColor: ACCENT },
  chip: {
    padding: '8px 16px',
    borderRadius: 50,
    border: '1.5px solid rgba(0,0,0,0.08)',
    background: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: PRIMARY,
  },
  chipSelected: { background: `${ACCENT}22`, borderColor: ACCENT, color: PRIMARY },
  nextBtn: {
    padding: '16px',
    borderRadius: 16,
    border: 'none',
    background: PRIMARY,
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'opacity 0.2s',
  },
};

const selectedBorder = { border: `1.5px solid ${ACCENT}` };

/* ─── main component ─── */
export default function NutritionOnboarding({
  onComplete,
  onCancel,
}: {
  onComplete: (profile: NutritionProfile, startDate: Date) => void;
  onCancel?: () => void;
}) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [waist, setWaist] = useState('');
  const [breast, setBreast] = useState('');
  const [hip, setHip] = useState('');
  const [activity, setActivity] = useState<Activity | null>(null);
  const [meals, setMeals] = useState<3 | 4 | 5 | null>(null);
  const [diet, setDiet] = useState<Diet>('normal');
  const [allergies, setAllergies] = useState<Set<Allergy>>(new Set());
  const [favMeal, setFavMeal] = useState<FavMeal>('obed');
  const [likedIngredients, setLikedIngredients] = useState<string[]>([]);
  const [dislikedIngredients, setDislikedIngredients] = useState<string[]>([]);
  const [likedInput, setLikedInput] = useState('');
  const [dislikedInput, setDislikedInput] = useState('');
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

  const getNutrition = () => {
    const w = parseFloat(weight) || 60;
    const h = parseFloat(height) || 165;
    const a = parseFloat(age) || 25;
    return calcNutrition(w, h, a, activity || 'sedentary', goal || 'maintain');
  };

  const handleComplete = () => {
    const n = getNutrition();
    onComplete({
      goal: goal!,
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseInt(age),
      waistCm: waist ? parseFloat(waist) : undefined,
      breastCm: breast ? parseFloat(breast) : undefined,
      hipCm: hip ? parseFloat(hip) : undefined,
      activityLevel: activity!,
      mealsPerDay: meals!,
      dietType: diet === 'normal' ? 'standard' : diet,
      allergies: Array.from(allergies),
      likedIngredients,
      dislikedIngredients,
      favouriteMealOfDay: favMeal,
      dailyCalories: n.targetCal,
      dailyProtein: n.proteinG,
      dailyCarbs: n.carbG,
      dailyFat: n.fatG,
      dailyFiber: n.fiberG,
      proteinPerKg: n.proteinPerKg,
    }, startDate!);
  };

  const addIngredient = (list: string[], setList: (v: string[]) => void, input: string, setInput: (v: string) => void) => {
    const val = input.trim().replace(/,+$/, '');
    if (val && !list.includes(val)) setList([...list, val]);
    setInput('');
  };

  const removeIngredient = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.filter((i) => i !== item));
  };

  const toggleAllergy = (a: Allergy) => {
    setAllergies((prev) => {
      const next = new Set(prev);
      next.has(a) ? next.delete(a) : next.add(a);
      return next;
    });
  };

  /* ─── step renderers ─── */

  const renderStep1 = () => (
    <>
      <div style={s.title}>Aký je tvoj cieľ?</div>
      {([
        { key: 'lose' as const, emoji: '🔥', title: 'Chudnutie', desc: 'Zdravé zníženie hmotnosti a telesného tuku' },
        { key: 'maintain' as const, emoji: '⚖️', title: 'Udržanie váhy', desc: 'Udržať si aktuálnu hmotnosť a zlepšiť skladbu tela' },
        { key: 'gain' as const, emoji: '💪', title: 'Naberanie svalov', desc: 'Budovanie svalovej hmoty a sily' },
      ]).map((o) => (
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

  const renderStep2 = () => {
    const waistNum = parseFloat(waist);
    const waistRisk = waist && waistNum > 0 ? getWaistRisk(waistNum) : null;

    return (
      <>
        <div style={s.title}>Telesné parametre</div>
        <GlassCard style={{ padding: '20px 18px', marginBottom: 12 }}>
          <div style={s.inputGroup}>
            <label style={s.label}>Váha (kg) *</label>
            <input style={s.input} type="number" inputMode="decimal" value={weight}
              onChange={(e) => setWeight(e.target.value)} placeholder="65" />
          </div>
          <div style={s.inputGroup}>
            <label style={s.label}>Výška (cm) *</label>
            <input style={s.input} type="number" inputMode="decimal" value={height}
              onChange={(e) => setHeight(e.target.value)} placeholder="168" />
          </div>
          <div style={{ ...s.inputGroup, marginBottom: 0 }}>
            <label style={s.label}>Vek *</label>
            <input style={s.input} type="number" inputMode="numeric" value={age}
              onChange={(e) => setAge(e.target.value)} placeholder="28" />
          </div>
        </GlassCard>

        {/* Measurements */}
        <GlassCard style={{ padding: '20px 18px', marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: PRIMARY, marginBottom: 4 }}>Telesné obvody</div>
          <div style={{ fontSize: 11, color: MUTED_LIGHT, marginBottom: 16 }}>
            Obvod pása je kľúčový ukazovateľ zdravotného rizika — pomáha nám nastaviť správny plán.
          </div>
          <div style={s.inputGroup}>
            <label style={s.label}>Obvod pása (cm) — odporúčame</label>
            <input style={s.input} type="number" inputMode="decimal" value={waist}
              onChange={(e) => setWaist(e.target.value)} placeholder="napr. 78" />
            {/* Inline waist risk */}
            {waistRisk && (
              <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 10, background: `${waistRisk.color}12`, border: `1px solid ${waistRisk.color}30` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: waistRisk.color, marginBottom: 3 }}>
                  {waistRisk.level === 'ok' ? '✓' : '⚠'} {waistRisk.label}
                </div>
                <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>{waistRisk.desc}</div>
              </div>
            )}
          </div>
          <div style={s.inputGroup}>
            <label style={s.labelOptional}>Obvod prsníka (cm) — voliteľné</label>
            <input style={s.input} type="number" inputMode="decimal" value={breast}
              onChange={(e) => setBreast(e.target.value)} placeholder="napr. 95" />
          </div>
          <div style={{ ...s.inputGroup, marginBottom: 0 }}>
            <label style={s.labelOptional}>Obvod bokov (cm) — voliteľné</label>
            <input style={s.input} type="number" inputMode="decimal" value={hip}
              onChange={(e) => setHip(e.target.value)} placeholder="napr. 100" />
          </div>
        </GlassCard>

        {/* Health note */}
        <div style={{ fontSize: 11, color: MUTED_LIGHT, padding: '0 4px', lineHeight: 1.6 }}>
          Ak máš zdravotnú diagnózu alebo užívaš lieky ovplyvňujúce metabolizmus, poraď sa so svojím lekárom.
        </div>
      </>
    );
  };

  const renderStep3 = () => (
    <>
      <div style={s.title}>Ako aktívna si?</div>
      <div style={{ fontSize: 11, color: ACCENT, marginBottom: 14, padding: '8px 12px', background: 'rgba(184,134,74,0.08)', borderRadius: 10 }}>
        Buď k sebe úprimná — väčšina ľudí si aktivitu nadhodnocuje. Presný výber = presnejší plán.
      </div>
      {([
        { key: 'sedentary' as const, title: 'Sedavý životný štýl', desc: 'Väčšinou sedím — kancelária, auto, málo pohybu. Menej ako 5 000 krokov denne.' },
        { key: 'light' as const, title: 'Mierne aktívna', desc: 'Prechádzky, 1–2× týždenne ľahké cvičenie (joga, pilates).' },
        { key: 'moderate' as const, title: 'Stredne aktívna', desc: 'Pravidelné cvičenie 3–4× týždenne, aspoň 30 min. Aktívny každodenný život.' },
        { key: 'active' as const, title: 'Veľmi aktívna', desc: '5+ intenzívnych tréningov týždenne alebo fyzicky náročná práca každý deň.' },
      ]).map((o) => (
        <GlassCard
          key={o.key}
          onClick={() => setActivity(o.key)}
          style={{ ...s.optionCard, ...(activity === o.key ? selectedBorder : {}) }}
        >
          <div>
            <div style={s.optionTitle}>{o.title}</div>
            <div style={s.optionDesc}>{o.desc}</div>
          </div>
        </GlassCard>
      ))}
    </>
  );

  const renderStep4 = () => (
    <>
      <div style={s.title}>Jedlá a stravovanie</div>

      {/* Meals per day */}
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>Koľkokrát denne jesz?</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {([
          { n: 3 as const, emoji: '🍽️', desc: '3 hlavné jedlá' },
          { n: 4 as const, emoji: '🍽️🍎', desc: '3 jedlá + 1 desiata' },
          { n: 5 as const, emoji: '🍽️🍎🍎', desc: '3 jedlá + 2 desiatky' },
        ]).map((o) => (
          <button
            key={o.n}
            onClick={() => setMeals(o.n)}
            style={{
              ...s.pill,
              ...(meals === o.n ? s.pillSelected : {}),
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 16 }}>{o.n}×</span>
            <span style={{ fontSize: 12, opacity: 0.85 }}>{o.desc}</span>
          </button>
        ))}
      </div>

      {/* Diet type */}
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>Typ stravovanie</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {([
          { key: 'normal' as const, label: '🍗 Bežná' },
          { key: 'vegetarian' as const, label: '🥚 Vegetariánska' },
        ]).map((o) => (
          <button key={o.key} onClick={() => setDiet(o.key)}
            style={{ ...s.pill, ...(diet === o.key ? s.pillSelected : {}) }}>
            {o.label}
          </button>
        ))}
      </div>

      {/* Allergies */}
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>Alergie a intolerancie</div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {ALLERGY_LABELS.map((a) => (
          <button key={a.key} onClick={() => toggleAllergy(a.key)}
            style={{ ...s.chip, ...(allergies.has(a.key) ? s.chipSelected : {}) }}>
            {a.label}
          </button>
        ))}
      </div>
    </>
  );

  const renderStep5 = () => {
    const likedMatches = likedInput.trim().length >= 1
      ? INGREDIENT_SUGGESTIONS.filter(s =>
          s.toLowerCase().startsWith(likedInput.toLowerCase()) && !likedIngredients.includes(s)
        ).slice(0, 6)
      : [];
    const dislikedMatches = dislikedInput.trim().length >= 1
      ? INGREDIENT_SUGGESTIONS.filter(s =>
          s.toLowerCase().startsWith(dislikedInput.toLowerCase()) && !dislikedIngredients.includes(s)
        ).slice(0, 6)
      : [];

    return (
      <>
        <div style={s.title}>Tvoje preferencie</div>

        <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>Obľúbené jedlo dňa</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {([
            { key: 'ranajky' as const, label: 'Raňajky', emoji: '☕' },
            { key: 'obed' as const, label: 'Obed', emoji: '🍽️' },
            { key: 'vecera' as const, label: 'Večera', emoji: '🌙' },
            { key: 'snack' as const, label: 'Snack', emoji: '🍎' },
          ]).map((o) => (
            <button key={o.key} onClick={() => setFavMeal(o.key)}
              style={{ ...s.chip, ...(favMeal === o.key ? s.chipSelected : {}) }}>
              {o.emoji} {o.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>Čo ti chutí? (voliteľné)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {likedIngredients.map((item) => (
            <button key={item} onClick={() => removeIngredient(likedIngredients, setLikedIngredients, item)}
              style={{ ...s.chip, ...s.chipSelected, fontSize: 11 }}>{item} ×</button>
          ))}
        </div>
        <div style={{ position: 'relative', marginBottom: 24 }}>
          <input style={s.input} value={likedInput}
            onChange={(e) => setLikedInput(e.target.value)}
            placeholder="Začni písať... napr. Kura" />
          {likedMatches.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', zIndex: 10, overflow: 'hidden', marginTop: 4 }}>
              {likedMatches.map(match => (
                <button key={match} onClick={() => addIngredient(likedIngredients, setLikedIngredients, match, setLikedInput)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', fontSize: 13, color: PRIMARY, background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  {match}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ fontSize: 12, color: MUTED, marginBottom: 6 }}>Čo vynechať? (voliteľné)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {dislikedIngredients.map((item) => (
            <button key={item} onClick={() => removeIngredient(dislikedIngredients, setDislikedIngredients, item)}
              style={{ ...s.chip, background: 'rgba(184,134,74,0.08)', borderColor: ACCENT, color: PRIMARY, fontSize: 11 }}>{item} ×</button>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <input style={s.input} value={dislikedInput}
            onChange={(e) => setDislikedInput(e.target.value)}
            placeholder="Začni písať... napr. Cibuľa" />
          {dislikedMatches.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', zIndex: 10, overflow: 'hidden', marginTop: 4 }}>
              {dislikedMatches.map(match => (
                <button key={match} onClick={() => addIngredient(dislikedIngredients, setDislikedIngredients, match, setDislikedInput)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', fontSize: 13, color: PRIMARY, background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  {match}
                </button>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  const renderStep6 = () => {
    const ageNum = parseInt(age) || 25;
    const n = getNutrition();
    const isPerimenopause = ageNum >= 38;

    return (
      <>
        <div style={s.title}>Tvoj výživový plán</div>

        {/* Perimenopause badge */}
        {isPerimenopause && (
          <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 12, background: 'rgba(184,134,74,0.10)', border: '1px solid rgba(184,134,74,0.25)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, marginBottom: 2 }}>🌿 Perimenopauza (38+)</div>
            <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>
              Plán je upravený podľa odporúčaní Dr. Stacy Sims — vyšší proteín pre zachovanie svalovej hmoty pri poklese estrogénu.
            </div>
          </div>
        )}

        {/* Calorie hero */}
        <GlassCard style={{ padding: '24px 20px', marginBottom: 12 }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: PRIMARY, lineHeight: 1 }}>{n.targetCal}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>kcal denne</div>
          </div>

          {/* Protein — primary, Stacy Sims */}
          <div style={{ marginBottom: 12, padding: '12px 14px', borderRadius: 12, background: 'rgba(107,76,59,0.07)', border: '1px solid rgba(107,76,59,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Proteín</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: PRIMARY }}>{n.proteinG}g</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{n.proteinPerKg} g/kg · {n.proteinPct}% kalórií</div>
              </div>
              <div style={{ fontSize: 10, color: PRIMARY, background: 'rgba(107,76,59,0.10)', padding: '3px 8px', borderRadius: 20, fontWeight: 600, marginTop: 2 }}>
                Stacy Sims
              </div>
            </div>
          </div>

          {/* Carbs + Fat */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            {[
              { label: 'Sacharidy', value: `${n.carbG}g`, sub: `${n.carbPct}% kalórií`, color: ACCENT },
              { label: 'Tuky', value: `${n.fatG}g`, sub: '27% kalórií', color: GREEN },
            ].map((m) => (
              <div key={m.label} style={{ padding: '12px 14px', borderRadius: 12, background: `${m.color}10`, border: `1px solid ${m.color}25` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: PRIMARY }}>{m.value}</div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 1 }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Fiber — 4th macronutrient */}
          <div style={{ padding: '10px 14px', borderRadius: 12, background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 1 }}>Vláknina</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: PRIMARY }}>{n.fiberG}g denne</div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 1 }}>Podporuje črevný mikrobióm a stabilitu glukózy</div>
              </div>
              <div style={{ fontSize: 10, color: GREEN, background: `${GREEN}15`, padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>
                4. makro
              </div>
            </div>
          </div>
        </GlassCard>

        <div style={{ fontSize: 11, color: MUTED_LIGHT, padding: '0 4px', lineHeight: 1.6, marginBottom: 8 }}>
          Hodnoty sú vypočítané podľa vzorca Mifflin-St Jeor pre ženy a protokolu Dr. Stacy Sims pre proteín.
        </div>
      </>
    );
  };

  const renderStep7 = () => (
    <>
      <div style={s.title}>Kedy chceš začať?</div>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 16 }}>Jedálniček vždy začína v pondelok.</div>
      {mondays.map((m) => (
        <GlassCard
          key={m.toISOString()}
          onClick={() => setStartDate(m)}
          style={{ ...s.optionCard, ...(startDate?.toISOString() === m.toISOString() ? selectedBorder : {}) }}
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

      {/* header */}
      <div style={s.header}>
        {step > 1 ? (
          <button style={s.backBtn} onClick={() => setStep((p) => p - 1)} aria-label="Späť">←</button>
        ) : onCancel ? (
          <button style={s.backBtn} onClick={onCancel} aria-label="Zatvoriť">←</button>
        ) : null}
      </div>

      {/* CTA — top */}
      <div style={{ ...s.footer, paddingBottom: 12, paddingTop: 8 }}>
        {step < TOTAL_STEPS ? (
          <button
            style={{ ...s.nextBtn, opacity: canNext() ? 1 : 0.4, width: '100%' }}
            disabled={!canNext()}
            onClick={() => setStep((p) => p + 1)}
          >
            Ďalej
          </button>
        ) : (
          <button
            style={{ ...s.nextBtn, width: '100%', opacity: startDate ? 1 : 0.4 }}
            disabled={!startDate}
            onClick={handleComplete}
          >
            Vygenerovať jedálniček
          </button>
        )}
      </div>

      {/* body — scrollable */}
      <div style={s.body}>
        {steps[step - 1]()}
      </div>
    </div>
  );
}
