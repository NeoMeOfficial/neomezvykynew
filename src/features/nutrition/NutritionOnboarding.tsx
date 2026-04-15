import { useState, type CSSProperties } from 'react';
import GlassCard from '../../components/v2/GlassCard';
import type { NutritionProfile } from './types';

/* ─── colour tokens ─── */
const PRIMARY = '#6B4C3B';
const ACCENT = '#B8864A';
const MUTED = '#777';
const MUTED_LIGHT = '#999';
const GREEN = '#7A9E78';

/* ─── types ─── */
type Goal = 'lose' | 'maintain' | 'gain';
type RegularDay = 'sedentary_work' | 'on_feet' | 'with_kids';
type StepsRange = '<5000' | '5000-10000' | '>10000';
type DietType = 'standard' | 'semi-vegetarian' | 'vegetarian';
type FavMeal = 'ranajky' | 'obed' | 'vecera' | 'snack';
type Allergy = 'gluten' | 'dairy' | 'nuts' | 'eggs' | 'soy';

/* ─── step → section mapping ─── */
// 12 internal steps mapping to 7 user-visible sections
const TOTAL_STEPS = 12;
const STEP_META: { section: number; sectionLabel: string; partLabel?: string }[] = [
  { section: 1, sectionLabel: 'Cieľ' },
  { section: 2, sectionLabel: 'Fyzické parametre' },
  { section: 3, sectionLabel: 'Aktivita', partLabel: 'Časť 1 z 4 — Bežný deň' },
  { section: 3, sectionLabel: 'Aktivita', partLabel: 'Časť 2 z 4 — Kroky' },
  { section: 3, sectionLabel: 'Aktivita', partLabel: 'Časť 3 z 4 — Športová aktivita' },
  { section: 3, sectionLabel: 'Aktivita', partLabel: 'Časť 4 z 4 — Frekvencia' },
  { section: 4, sectionLabel: 'Stravovacie preferencie', partLabel: 'Časť 1 z 3 — Výber jedál' },
  { section: 4, sectionLabel: 'Stravovacie preferencie', partLabel: 'Časť 2 z 3 — Preferencie' },
  { section: 4, sectionLabel: 'Stravovacie preferencie', partLabel: 'Časť 3 z 3 — Typ jedálnička' },
  { section: 5, sectionLabel: 'Doplnkové údaje' },
  { section: 6, sectionLabel: 'Zhrnutie' },
  { section: 7, sectionLabel: 'Štart' },
];

/* ─── constants ─── */
const SPORTS_OPTIONS = [
  'Pilates', 'Beh', 'Tanec', 'Posilňovňa / HIIT', 'Joga',
  'Bicykel', 'Plávanie', 'Turistika', 'Aerobik', 'Crossfit',
];

const MEAL_OPTIONS: { key: string; label: string; emoji: string; pct: number }[] = [
  { key: 'ranajky', label: 'Raňajky', emoji: '☀️', pct: 30 },
  { key: 'desiata', label: 'Desiata', emoji: '🍎', pct: 10 },
  { key: 'obed', label: 'Obed', emoji: '🍽️', pct: 30 },
  { key: 'olovrant', label: 'Olovrant', emoji: '🫐', pct: 10 },
  { key: 'vecera', label: 'Večera', emoji: '🌙', pct: 20 },
];

const ALLERGY_LABELS: { key: Allergy; label: string }[] = [
  { key: 'gluten', label: 'Lepok' },
  { key: 'dairy', label: 'Mliečne' },
  { key: 'nuts', label: 'Orechy' },
  { key: 'eggs', label: 'Vajcia' },
  { key: 'soy', label: 'Sója' },
];

const INGREDIENT_SUGGESTIONS = [
  'Kura', 'Hovädzie', 'Losos', 'Tuniak', 'Krevety', 'Vajcia', 'Tofu',
  'Ryža', 'Quinoa', 'Ovsené vločky', 'Batáty', 'Zemiaky', 'Celozrnná pasta',
  'Avokádo', 'Brokolica', 'Špenát', 'Mrkva', 'Paradajky', 'Uhorka', 'Paprika',
  'Cícer', 'Šošovica', 'Čierne fazule', 'Banán', 'Jablko', 'Jahody', 'Mango',
  'Olivový olej', 'Mandle', 'Vlašské orechy', 'Kešu', 'Arašidové maslo',
  'Grécky jogurt', 'Tvaroh', 'Feta', 'Hummus',
];

/* ─── helpers ─── */
function calcAge(birthDate: string): number {
  if (!birthDate) return 25;
  const today = new Date();
  const b = new Date(birthDate);
  let age = today.getFullYear() - b.getFullYear();
  const m = today.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--;
  return Math.max(10, Math.min(99, age));
}

function deriveActivityLevel(
  regularDay: RegularDay | null,
  stepsRange: StepsRange | null,
  sportsCount: number,
  frequency: number,
): 'sedentary' | 'light' | 'moderate' | 'active' {
  let score = 0;
  if (regularDay === 'on_feet') score += 2;
  else if (regularDay === 'with_kids') score += 1;
  if (stepsRange === '5000-10000') score += 1;
  else if (stepsRange === '>10000') score += 2;
  if (sportsCount > 0) {
    if (frequency >= 5) score += 3;
    else if (frequency >= 3) score += 2;
    else if (frequency >= 1) score += 1;
  }
  if (score <= 1) return 'sedentary';
  if (score <= 3) return 'light';
  if (score <= 5) return 'moderate';
  return 'active';
}

const ACTIVITY_MULTIPLIER = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
const GOAL_OFFSET: Record<Goal, number> = { lose: -300, maintain: 0, gain: 250 };

function calcNutrition(w: number, h: number, age: number, activity: string, goal: Goal, isBreastfeeding: boolean) {
  const bmr = 10 * w + 6.25 * h - 5 * age - 161;
  const tdee = bmr * (ACTIVITY_MULTIPLIER[activity as keyof typeof ACTIVITY_MULTIPLIER] ?? 1.2);
  const bfBonus = isBreastfeeding ? 330 : 0;
  const targetCal = Math.round(tdee + GOAL_OFFSET[goal] + bfBonus);
  const proteinPerKg = age >= 38 ? 2.2 : 1.8;
  const proteinG = Math.round(w * proteinPerKg);
  const fatCal = Math.round(targetCal * 0.27);
  const fatG = Math.round(fatCal / 9);
  const carbCal = Math.max(0, targetCal - proteinG * 4 - fatCal);
  const carbG = Math.round(carbCal / 4);
  const fiberG = age >= 38 ? 30 : 25;
  const proteinPct = Math.round((proteinG * 4 / targetCal) * 100);
  const carbPct = Math.round((carbCal / targetCal) * 100);
  return { targetCal, proteinG, carbG, fatG, fiberG, proteinPerKg, proteinPct, carbPct };
}

function getWaistRisk(cm: number): { label: string; color: string; desc: string } {
  if (cm < 80) return { label: 'Nízke riziko', color: GREEN, desc: 'Obvod pása je v zdravom rozmedzí.' };
  if (cm <= 88) return { label: 'Zvýšené riziko', color: ACCENT, desc: 'Zvýšené riziko kardiovaskulárnych ochorení. Viscerálny tuk môže ovplyvňovať hormóny a metabolizmus.' };
  return { label: 'Vysoké riziko', color: '#C27A6E', desc: 'Vysoká hladina viscerálneho tuku zvyšuje riziko cukrovky 2. typu a hormonálnej nerovnováhy. Správna výživa môže výrazne pomôcť.' };
}

function getNextMondays(count: number): Date[] {
  const mondays: Date[] = [];
  const d = new Date();
  const daysUntilMonday = d.getDay() === 0 ? 1 : d.getDay() === 1 ? 7 : 8 - d.getDay();
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
    position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
    background: 'linear-gradient(to bottom, #FAF7F2, #F5F1E8)',
    fontFamily: 'DM Sans, sans-serif', color: PRIMARY, overflow: 'hidden', zIndex: 60,
  },
  progressBar: { height: 3, background: 'rgba(0,0,0,0.06)', width: '100%' },
  progressFill: { height: '100%', background: ACCENT, transition: 'width 0.4s ease' },
  header: { display: 'flex', alignItems: 'center', padding: '12px 16px 0', minHeight: 44, gap: 12 },
  backBtn: { background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: PRIMARY, padding: 0, lineHeight: 1, flexShrink: 0 },
  body: { flex: 1, padding: '8px 16px 0', display: 'flex', flexDirection: 'column', overflowY: 'auto', WebkitOverflowScrolling: 'touch' },
  footer: { padding: '12px 16px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))', flexShrink: 0 },
  title: { fontSize: 15, fontWeight: 600, marginBottom: 18, color: PRIMARY },
  optionCard: { padding: '14px 16px', marginBottom: 10, cursor: 'pointer', transition: 'border 0.2s ease' },
  optionTitle: { fontSize: 13, fontWeight: 600, color: PRIMARY },
  optionDesc: { fontSize: 12, color: MUTED_LIGHT, marginTop: 2 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, color: MUTED, marginBottom: 5, display: 'block', fontWeight: 500 },
  labelOpt: { fontSize: 12, color: MUTED_LIGHT, marginBottom: 5, display: 'block' },
  input: {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: '1.5px solid rgba(0,0,0,0.12)', padding: '7px 0',
    fontSize: 15, fontWeight: 600, color: PRIMARY, outline: 'none', fontFamily: 'DM Sans, sans-serif',
  },
  pill: {
    padding: '10px 18px', borderRadius: 50, border: '1.5px solid rgba(0,0,0,0.08)',
    background: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s', color: PRIMARY,
  },
  pillSel: { background: ACCENT, color: '#fff', borderColor: ACCENT },
  chip: {
    padding: '8px 14px', borderRadius: 50, border: '1.5px solid rgba(0,0,0,0.08)',
    background: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s', color: PRIMARY,
  },
  chipSel: { background: `${ACCENT}22`, borderColor: ACCENT, color: PRIMARY },
  nextBtn: {
    padding: '15px', borderRadius: 16, border: 'none', background: PRIMARY,
    color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif', transition: 'opacity 0.2s', width: '100%',
  },
};

const selBorder = { border: `1.5px solid ${ACCENT}` };

/* ─── component ─── */
export default function NutritionOnboarding({
  onComplete,
  onCancel,
}: {
  onComplete: (profile: NutritionProfile, startDate: Date) => void;
  onCancel?: () => void;
}) {
  const [step, setStep] = useState(1); // 1-based, max TOTAL_STEPS

  // S1 — Goal
  const [goal, setGoal] = useState<Goal | null>(null);

  // S2 — Physical params
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [breast, setBreast] = useState('');
  const [hip, setHip] = useState('');

  // S3 — Activity (4 parts)
  const [regularDay, setRegularDay] = useState<RegularDay | null>(null);
  const [stepsRange, setStepsRange] = useState<StepsRange | null>(null);
  const [sports, setSports] = useState<string[]>([]);
  const [sportsOther, setSportsOther] = useState('');
  const [sportsFrequency, setSportsFrequency] = useState<number | null>(null);

  // S4 — Meal prefs (3 parts)
  const [selectedMeals, setSelectedMeals] = useState<string[]>(['ranajky', 'obed', 'vecera']);
  const [likedIngredients, setLikedIngredients] = useState<string[]>([]);
  const [dislikedIngredients, setDislikedIngredients] = useState<string[]>([]);
  const [likedInput, setLikedInput] = useState('');
  const [dislikedInput, setDislikedInput] = useState('');
  const [dietType, setDietType] = useState<DietType>('standard');
  const [allergies, setAllergies] = useState<Set<Allergy>>(new Set());

  // S5 — Extra info
  const [isBreastfeeding, setIsBreastfeeding] = useState<boolean | null>(null);
  const [bfFrequency, setBfFrequency] = useState('');
  const [isPregnant, setIsPregnant] = useState<boolean | null>(null);

  // S7 — Start date
  const [startDate, setStartDate] = useState<Date | null>(null);
  const mondays = getNextMondays(4);

  /* ─── helpers ─── */
  const toggleSport = (s: string) => setSports(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleMeal = (key: string) => setSelectedMeals(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);
  const toggleAllergy = (a: Allergy) => setAllergies(prev => { const n = new Set(prev); n.has(a) ? n.delete(a) : n.add(a); return n; });
  const addIngredient = (list: string[], setList: (v: string[]) => void, val: string, setInput: (v: string) => void) => {
    const v = val.trim().replace(/,+$/, '');
    if (v && !list.includes(v)) setList([...list, v]);
    setInput('');
  };

  const getNutrition = () => {
    const w = parseFloat(weight) || 60;
    const h = parseFloat(height) || 165;
    const age = birthDate ? calcAge(birthDate) : 25;
    const allSports = sportsOther.trim() ? [...sports, sportsOther.trim()] : sports;
    const activity = deriveActivityLevel(regularDay, stepsRange, allSports.length, sportsFrequency ?? 0);
    return calcNutrition(w, h, age, activity, goal ?? 'maintain', isBreastfeeding === true);
  };

  const canNext = (): boolean => {
    switch (step) {
      case 1: return goal !== null;
      case 2: return birthDate !== '' && weight !== '' && height !== '';
      case 3: return regularDay !== null;
      case 4: return stepsRange !== null;
      case 5: return true; // sports optional
      case 6: return sports.length === 0 || sportsFrequency !== null;
      case 7: return selectedMeals.length >= 1;
      case 8: return true;
      case 9: return true;
      case 10: return isBreastfeeding !== null && isPregnant !== null;
      case 11: return true;
      case 12: return startDate !== null;
      default: return false;
    }
  };

  const handleComplete = () => {
    const n = getNutrition();
    const age = birthDate ? calcAge(birthDate) : 25;
    const allSports = sportsOther.trim() ? [...sports, sportsOther.trim()] : sports;
    const activity = deriveActivityLevel(regularDay, stepsRange, allSports.length, sportsFrequency ?? 0);
    const mealsPerDay = Math.min(5, Math.max(3, selectedMeals.length)) as 3 | 4 | 5;
    const favMeal: FavMeal = selectedMeals.includes('obed') ? 'obed' : selectedMeals[0] as FavMeal || 'obed';
    onComplete({
      goal: goal!,
      birthDate,
      weight: parseFloat(weight),
      height: parseFloat(height),
      age,
      waistCm: waist ? parseFloat(waist) : undefined,
      breastCm: breast ? parseFloat(breast) : undefined,
      hipCm: hip ? parseFloat(hip) : undefined,
      regularDay: regularDay ?? undefined,
      dailyStepsRange: stepsRange ?? undefined,
      sports: allSports,
      sportsFrequency: sportsFrequency ?? undefined,
      activityLevel: activity,
      mealsPerDay,
      selectedMeals,
      dietType: dietType === 'standard' ? 'standard' : dietType,
      allergies: Array.from(allergies),
      likedIngredients,
      dislikedIngredients,
      favouriteMealOfDay: favMeal,
      isBreastfeeding: isBreastfeeding ?? false,
      breastfeedingFrequency: bfFrequency ? parseInt(bfFrequency) : undefined,
      isPregnant: isPregnant ?? false,
      dailyCalories: n.targetCal,
      dailyProtein: n.proteinG,
      dailyCarbs: n.carbG,
      dailyFat: n.fatG,
      dailyFiber: n.fiberG,
      proteinPerKg: n.proteinPerKg,
    }, startDate!);
  };

  /* ─── section header ─── */
  const meta = STEP_META[step - 1];
  const sectionDots = Array.from({ length: 7 }, (_, i) => i + 1);

  /* ─── step renderers ─── */

  // S1 — Goal
  const renderStep1 = () => (
    <>
      <div style={s.title}>Aký je tvoj cieľ?</div>
      {([
        { key: 'lose' as const, emoji: '🔥', title: 'Chudnutie', desc: 'Zdravé zníženie hmotnosti a telesného tuku' },
        { key: 'maintain' as const, emoji: '⚖️', title: 'Udržanie váhy', desc: 'Udržať aktuálnu hmotnosť a zlepšiť skladbu tela' },
        { key: 'gain' as const, emoji: '💪', title: 'Naberanie svalov', desc: 'Budovanie svalovej hmoty a sily' },
      ]).map(o => (
        <GlassCard key={o.key} onClick={() => setGoal(o.key)} style={{ ...s.optionCard, ...(goal === o.key ? selBorder : {}) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>{o.emoji}</span>
            <div><div style={s.optionTitle}>{o.title}</div><div style={s.optionDesc}>{o.desc}</div></div>
          </div>
        </GlassCard>
      ))}
    </>
  );

  // S2 — Physical params
  const renderStep2 = () => {
    const waistNum = parseFloat(waist);
    const waistRisk = waist && waistNum > 0 ? getWaistRisk(waistNum) : null;
    const agePreview = birthDate ? calcAge(birthDate) : null;
    return (
      <>
        <div style={s.title}>Fyzické parametre</div>
        <GlassCard style={{ padding: '18px 16px', marginBottom: 12 }}>
          <div style={s.inputGroup}>
            <label style={s.label}>Dátum narodenia *</label>
            <input style={s.input} type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} max={new Date().toISOString().split('T')[0]} />
            {agePreview !== null && <div style={{ fontSize: 11, color: ACCENT, marginTop: 4 }}>{agePreview} rokov</div>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={s.inputGroup}>
              <label style={s.label}>Váha (kg) *</label>
              <input style={s.input} type="number" inputMode="decimal" value={weight} onChange={e => setWeight(e.target.value)} placeholder="65" />
            </div>
            <div style={s.inputGroup}>
              <label style={s.label}>Výška (cm) *</label>
              <input style={s.input} type="number" inputMode="decimal" value={height} onChange={e => setHeight(e.target.value)} placeholder="168" />
            </div>
          </div>
        </GlassCard>

        <GlassCard style={{ padding: '18px 16px', marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: PRIMARY, marginBottom: 2 }}>Telesné obvody</div>
          <div style={{ fontSize: 11, color: MUTED_LIGHT, marginBottom: 14, lineHeight: 1.5 }}>
            Slúžia ako vstupný údaj. Po ukončení plánu ti pošleme porovnanie zmien.
          </div>
          <div style={s.inputGroup}>
            <label style={s.label}>Obvod pásu (cm) — odporúčame</label>
            <input style={s.input} type="number" inputMode="decimal" value={waist} onChange={e => setWaist(e.target.value)} placeholder="napr. 78" />
            {waistRisk && (
              <div style={{ marginTop: 8, padding: '9px 12px', borderRadius: 10, background: `${waistRisk.color}12`, border: `1px solid ${waistRisk.color}30` }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: waistRisk.color, marginBottom: 2 }}>
                  {waistRisk.color === GREEN ? '✓' : '⚠'} {waistRisk.label}
                </div>
                <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>{waistRisk.desc}</div>
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={s.inputGroup}>
              <label style={s.labelOpt}>Obvod prsníkov (cm)</label>
              <input style={s.input} type="number" inputMode="decimal" value={breast} onChange={e => setBreast(e.target.value)} placeholder="napr. 95" />
            </div>
            <div style={s.inputGroup}>
              <label style={s.labelOpt}>Obvod bokov (cm)</label>
              <input style={s.input} type="number" inputMode="decimal" value={hip} onChange={e => setHip(e.target.value)} placeholder="napr. 100" />
            </div>
          </div>
        </GlassCard>
      </>
    );
  };

  // S3/1 — Regular day
  const renderStep3 = () => (
    <>
      <div style={s.title}>Aký je tvoj bežný deň?</div>
      {([
        { key: 'sedentary_work' as const, emoji: '💻', title: 'Sedavá práca', desc: 'Väčšinu dňa sedím — kancelária, home office, auto.' },
        { key: 'on_feet' as const, emoji: '🚶‍♀️', title: 'Stále na nohách', desc: 'Práca v stoji, predajňa, zdravotníctvo, škola...' },
        { key: 'with_kids' as const, emoji: '👶', title: 'Okolo detí', desc: 'Materská / rodičovská, aktívny deň s deťmi.' },
      ]).map(o => (
        <GlassCard key={o.key} onClick={() => setRegularDay(o.key)} style={{ ...s.optionCard, ...(regularDay === o.key ? selBorder : {}) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>{o.emoji}</span>
            <div><div style={s.optionTitle}>{o.title}</div><div style={s.optionDesc}>{o.desc}</div></div>
          </div>
        </GlassCard>
      ))}
    </>
  );

  // S3/2 — Steps
  const renderStep4 = () => (
    <>
      <div style={s.title}>Koľko krokov denne prejdeš?</div>
      <div style={{ fontSize: 12, color: MUTED_LIGHT, marginBottom: 14 }}>Ak nevieš presne, odhadni priemer.</div>
      {([
        { key: '<5000' as const, emoji: '🪑', label: 'Menej ako 5 000 krokov' },
        { key: '5000-10000' as const, emoji: '🚶‍♀️', label: '5 000 – 10 000 krokov' },
        { key: '>10000' as const, emoji: '🏃‍♀️', label: 'Viac ako 10 000 krokov' },
      ]).map(o => (
        <GlassCard key={o.key} onClick={() => setStepsRange(o.key)} style={{ ...s.optionCard, ...(stepsRange === o.key ? selBorder : {}) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>{o.emoji}</span>
            <div style={s.optionTitle}>{o.label}</div>
          </div>
        </GlassCard>
      ))}
    </>
  );

  // S3/3 — Sport
  const renderStep5 = () => (
    <>
      <div style={s.title}>Akej športovej aktivite sa venuješ?</div>
      <div style={{ fontSize: 12, color: MUTED_LIGHT, marginBottom: 14 }}>Môžeš vybrať viac možností. Ak necvičíš, prejdi ďalej.</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {SPORTS_OPTIONS.map(sp => (
          <button key={sp} onClick={() => toggleSport(sp)}
            style={{ ...s.chip, ...(sports.includes(sp) ? s.chipSel : {}) }}>
            {sp}
          </button>
        ))}
      </div>
      <div>
        <label style={s.labelOpt}>Iné (vlastný text)</label>
        <input
          style={s.input}
          value={sportsOther}
          onChange={e => setSportsOther(e.target.value)}
          placeholder="napr. Korčuľovanie, Lukostrelba..."
        />
      </div>
    </>
  );

  // S3/4 — Frequency
  const renderStep6 = () => {
    if (sports.length === 0 && !sportsOther.trim()) {
      return (
        <>
          <div style={s.title}>Frekvencia cvičenia</div>
          <GlassCard style={{ padding: '20px 16px' }}>
            <div style={{ fontSize: 13, color: MUTED, textAlign: 'center' }}>
              Nevybrala si žiadnu aktivitu — žiadny problém! Jedálniček prispôsobíme tvojmu tempu.
            </div>
          </GlassCard>
        </>
      );
    }
    return (
      <>
        <div style={s.title}>Koľkokrát týždenne cvičíš?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[1, 2, 3, 4, 5, 6, 7].map(n => (
            <button key={n} onClick={() => setSportsFrequency(n)}
              style={{ ...s.pill, ...(sportsFrequency === n ? s.pillSel : {}), minWidth: 56, textAlign: 'center' }}>
              {n}×
            </button>
          ))}
        </div>
        {sportsFrequency !== null && (
          <div style={{ marginTop: 12, fontSize: 12, color: MUTED_LIGHT }}>
            {sportsFrequency <= 2 ? 'Skvelý základ — konzistencia je základ.' : sportsFrequency <= 4 ? 'Výborné — pravidelné cvičenie.' : 'Veľmi aktívna — plán bude tomu zodpovedať.'}
          </div>
        )}
      </>
    );
  };

  // S4/1 — Meal selection
  const renderStep7 = () => {
    const totalPct = MEAL_OPTIONS.filter(m => selectedMeals.includes(m.key)).reduce((a, m) => a + m.pct, 0);
    return (
      <>
        <div style={s.title}>Aké jedlá chceš mať v pláne?</div>
        <div style={{ fontSize: 12, color: MUTED_LIGHT, marginBottom: 14 }}>
          Kalórie sa rozložia podľa výberu. Vyber aspoň 1 jedlo.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MEAL_OPTIONS.map(m => {
            const selected = selectedMeals.includes(m.key);
            return (
              <button key={m.key} onClick={() => toggleMeal(m.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px', borderRadius: 14,
                  background: selected ? `${ACCENT}18` : 'rgba(255,255,255,0.45)',
                  border: selected ? `1.5px solid ${ACCENT}` : '1.5px solid rgba(0,0,0,0.06)',
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                }}>
                <span style={{ fontSize: 22 }}>{m.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: PRIMARY }}>{m.label}</div>
                  <div style={{ fontSize: 11, color: MUTED_LIGHT }}>~{m.pct}% denných kalórií</div>
                </div>
                {selected && <span style={{ fontSize: 16, color: ACCENT }}>✓</span>}
              </button>
            );
          })}
        </div>
        {selectedMeals.length > 0 && (
          <div style={{ marginTop: 12, fontSize: 11, color: MUTED_LIGHT }}>
            Celkové % = {totalPct}% {totalPct !== 100 && <span style={{ color: ACCENT }}>(bude normalizovaných na 100%)</span>}
          </div>
        )}
      </>
    );
  };

  // S4/2 — Preferences
  const renderStep8 = () => {
    const likedMatches = likedInput.trim().length >= 1
      ? INGREDIENT_SUGGESTIONS.filter(s => s.toLowerCase().startsWith(likedInput.toLowerCase()) && !likedIngredients.includes(s)).slice(0, 5)
      : [];
    const dislikedMatches = dislikedInput.trim().length >= 1
      ? INGREDIENT_SUGGESTIONS.filter(s => s.toLowerCase().startsWith(dislikedInput.toLowerCase()) && !dislikedIngredients.includes(s)).slice(0, 5)
      : [];
    return (
      <>
        <div style={s.title}>Tvoje preferencie</div>

        <div style={{ fontSize: 12, color: MUTED, marginBottom: 8, fontWeight: 500 }}>Čo ti chutí? (voliteľné)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
          {likedIngredients.map(item => (
            <button key={item} onClick={() => setLikedIngredients(l => l.filter(x => x !== item))}
              style={{ ...s.chip, ...s.chipSel, fontSize: 11 }}>{item} ×</button>
          ))}
        </div>
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <input style={s.input} value={likedInput} onChange={e => setLikedInput(e.target.value)}
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

        <div style={{ fontSize: 12, color: MUTED, marginBottom: 8, fontWeight: 500 }}>Čo ti nechutí / čo vynechať? (voliteľné)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
          {dislikedIngredients.map(item => (
            <button key={item} onClick={() => setDislikedIngredients(l => l.filter(x => x !== item))}
              style={{ ...s.chip, background: 'rgba(184,134,74,0.08)', borderColor: ACCENT, fontSize: 11 }}>{item} ×</button>
          ))}
        </div>
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <input style={s.input} value={dislikedInput} onChange={e => setDislikedInput(e.target.value)}
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

        <div style={{ fontSize: 12, color: MUTED, marginBottom: 8, fontWeight: 500 }}>Alergie a intolerancie</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {ALLERGY_LABELS.map(a => (
            <button key={a.key} onClick={() => toggleAllergy(a.key)}
              style={{ ...s.chip, ...(allergies.has(a.key) ? s.chipSel : {}) }}>{a.label}</button>
          ))}
        </div>
      </>
    );
  };

  // S4/3 — Diet type
  const renderStep9 = () => (
    <>
      <div style={s.title}>Typ jedálnička</div>
      {([
        { key: 'standard' as const, emoji: '🍗', title: 'Univerzálny', desc: 'Všetky potraviny vrátane mäsa a rýb.' },
        { key: 'semi-vegetarian' as const, emoji: '🐟', title: 'Semi-vegetariánsky', desc: 'Prevažne rastlinná strava, príležitostne ryby a vajcia.' },
        { key: 'vegetarian' as const, emoji: '🥚', title: 'Vegetariánsky', desc: 'Bez mäsa a rýb, vajcia a mliečne produkty sú OK.' },
      ]).map(o => (
        <GlassCard key={o.key} onClick={() => setDietType(o.key)} style={{ ...s.optionCard, ...(dietType === o.key ? selBorder : {}) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>{o.emoji}</span>
            <div><div style={s.optionTitle}>{o.title}</div><div style={s.optionDesc}>{o.desc}</div></div>
          </div>
        </GlassCard>
      ))}
    </>
  );

  // S5 — Extra info
  const renderStep10 = () => (
    <>
      <div style={s.title}>Doplnkové údaje</div>

      {/* Breastfeeding */}
      <GlassCard style={{ padding: '16px', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: PRIMARY, marginBottom: 12 }}>Kojiš?</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[{ v: true, label: 'Áno' }, { v: false, label: 'Nie' }].map(o => (
            <button key={String(o.v)} onClick={() => setIsBreastfeeding(o.v)}
              style={{ ...s.pill, ...(isBreastfeeding === o.v ? s.pillSel : {}), flex: 1, textAlign: 'center' }}>
              {o.label}
            </button>
          ))}
        </div>
        {isBreastfeeding === true && (
          <div style={{ marginTop: 14 }}>
            <label style={s.label}>Koľkokrát za 24 hodín?</label>
            <input style={s.input} type="number" inputMode="numeric" value={bfFrequency}
              onChange={e => setBfFrequency(e.target.value)} placeholder="napr. 6" />
            <div style={{ fontSize: 11, color: ACCENT, marginTop: 6 }}>+330 kcal bude pridaných k dennému príjmu.</div>
          </div>
        )}
      </GlassCard>

      {/* Pregnancy */}
      <GlassCard style={{ padding: '16px', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: PRIMARY, marginBottom: 12 }}>Si tehotná?</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[{ v: true, label: 'Áno' }, { v: false, label: 'Nie' }].map(o => (
            <button key={String(o.v)} onClick={() => setIsPregnant(o.v)}
              style={{ ...s.pill, ...(isPregnant === o.v ? s.pillSel : {}), flex: 1, textAlign: 'center' }}>
              {o.label}
            </button>
          ))}
        </div>
        {isPregnant === true && (
          <div style={{ marginTop: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(184,134,74,0.08)', border: '1px solid rgba(184,134,74,0.2)' }}>
            <div style={{ fontSize: 12, color: ACCENT, lineHeight: 1.5 }}>
              Počas tehotenstva odporúčame konzultovať výživový plán so svojím gynekológom alebo pôrodníkom.
            </div>
          </div>
        )}
      </GlassCard>

      {/* Health disclaimer */}
      <div style={{ fontSize: 11, color: MUTED_LIGHT, lineHeight: 1.6, padding: '0 2px' }}>
        Ak máš zdravotnú diagnózu (cukrovka, PCOS, hypotyreóza a pod.), odporúčame ti konzultáciu s dietológom.
      </div>
    </>
  );

  // S6 — Summary
  const renderStep11 = () => {
    const age = birthDate ? calcAge(birthDate) : 25;
    const n = getNutrition();
    const isPeri = age >= 38;
    return (
      <>
        <div style={s.title}>Tvoj výživový plán</div>

        {isPeri && (
          <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 12, background: 'rgba(184,134,74,0.10)', border: '1px solid rgba(184,134,74,0.25)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: ACCENT, marginBottom: 2 }}>🌿 Perimenopauza (38+)</div>
            <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>Plán upravený podľa Dr. Stacy Sims — vyšší proteín pre zachovanie svalov pri poklese estrogénu.</div>
          </div>
        )}
        {isBreastfeeding && (
          <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 12, background: `${GREEN}12`, border: `1px solid ${GREEN}30` }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: GREEN, marginBottom: 2 }}>🤱 Kojenie</div>
            <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.5 }}>+330 kcal pridaných k dennému príjmu pre laktáciu.</div>
          </div>
        )}

        <GlassCard style={{ padding: '24px 18px' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: PRIMARY, lineHeight: 1 }}>{n.targetCal}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>kcal denne</div>
          </div>

          {/* Protein */}
          <div style={{ marginBottom: 10, padding: '12px 14px', borderRadius: 12, background: 'rgba(107,76,59,0.07)', border: '1px solid rgba(107,76,59,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Proteín</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: PRIMARY }}>{n.proteinG}g</div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{n.proteinPerKg} g/kg · {n.proteinPct}% kalórií</div>
              </div>
              <div style={{ fontSize: 10, color: PRIMARY, background: 'rgba(107,76,59,0.10)', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>Stacy Sims</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            {[
              { label: 'Sacharidy', value: `${n.carbG}g`, sub: `${n.carbPct}%`, color: ACCENT },
              { label: 'Tuky', value: `${n.fatG}g`, sub: '27%', color: '#7A9E78' },
            ].map(m => (
              <div key={m.label} style={{ padding: '12px 14px', borderRadius: 12, background: `${m.color}10`, border: `1px solid ${m.color}25` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: PRIMARY }}>{m.value}</div>
                <div style={{ fontSize: 10, color: MUTED }}>{m.sub} kalórií</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px 14px', borderRadius: 12, background: `${GREEN}10`, border: `1px solid ${GREEN}25` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 1 }}>Vláknina</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: PRIMARY }}>{n.fiberG}g denne</div>
                <div style={{ fontSize: 10, color: MUTED }}>Črevný mikrobióm · stabilita glukózy</div>
              </div>
              <div style={{ fontSize: 10, color: GREEN, background: `${GREEN}15`, padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>4. makro</div>
            </div>
          </div>
        </GlassCard>

        <div style={{ fontSize: 11, color: MUTED_LIGHT, padding: '8px 2px 0', lineHeight: 1.6 }}>
          Výpočet: Mifflin-St Jeor (BMR) + protokol Dr. Stacy Sims (proteín).
        </div>
      </>
    );
  };

  // S7 — Start date
  const renderStep12 = () => (
    <>
      <div style={s.title}>Kedy chceš začať?</div>
      <div style={{ fontSize: 12, color: MUTED_LIGHT, marginBottom: 16 }}>Jedálniček vždy začína v pondelok.</div>
      {mondays.map(m => (
        <GlassCard key={m.toISOString()} onClick={() => setStartDate(m)}
          style={{ ...s.optionCard, ...(startDate?.toISOString() === m.toISOString() ? selBorder : {}) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>📅</span>
            <div>
              <div style={s.optionTitle}>{formatDate(m)}</div>
              <div style={s.optionDesc}>{m.getTime() - Date.now() < 7 * 86400000 ? 'Tento pondelok' : `O ${Math.ceil((m.getTime() - Date.now()) / 86400000)} dní`}</div>
            </div>
          </div>
        </GlassCard>
      ))}
    </>
  );

  const steps = [
    renderStep1, renderStep2, renderStep3, renderStep4, renderStep5, renderStep6,
    renderStep7, renderStep8, renderStep9, renderStep10, renderStep11, renderStep12,
  ];

  return (
    <div style={s.wrap}>
      {/* progress bar */}
      <div style={s.progressBar}>
        <div style={{ ...s.progressFill, width: `${(step / TOTAL_STEPS) * 100}%` }} />
      </div>

      {/* header */}
      <div style={s.header}>
        {(step > 1 || onCancel) && (
          <button style={s.backBtn}
            onClick={() => step > 1 ? setStep(p => p - 1) : onCancel?.()}
            aria-label="Späť">←</button>
        )}
        <div style={{ flex: 1 }}>
          {/* Section dots */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 4 }}>
            {sectionDots.map(n => (
              <div key={n} style={{
                width: n === meta.section ? 16 : 6,
                height: 6, borderRadius: 3,
                background: n <= meta.section ? ACCENT : 'rgba(0,0,0,0.10)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
          {/* Section label */}
          <div style={{ fontSize: 11, fontWeight: 600, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>
            {meta.sectionLabel}
          </div>
          {meta.partLabel && (
            <div style={{ fontSize: 11, color: MUTED_LIGHT, marginTop: 1 }}>{meta.partLabel}</div>
          )}
        </div>
      </div>

      {/* CTA — top */}
      <div style={{ ...s.footer, paddingBottom: 10, paddingTop: 8 }}>
        {step < TOTAL_STEPS ? (
          <button style={{ ...s.nextBtn, opacity: canNext() ? 1 : 0.4 }} disabled={!canNext()} onClick={() => setStep(p => p + 1)}>
            Ďalej
          </button>
        ) : (
          <button style={{ ...s.nextBtn, opacity: startDate ? 1 : 0.4 }} disabled={!startDate} onClick={handleComplete}>
            Vygenerovať jedálniček
          </button>
        )}
      </div>

      {/* body */}
      <div style={s.body}>
        {steps[step - 1]()}
      </div>
    </div>
  );
}
