import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useUserProgram } from '../../hooks/useUserProgram';
import { useMealPlan } from '../../features/nutrition/useMealPlan';
import { useSupabaseHabits } from '../../hooks/useSupabaseHabits';
import { useWorkoutHistory } from '../../hooks/useWorkoutHistory';
import { useCycleData } from '../../features/cycle/useCycleData';
import { recipes } from '../../data/recipes';
import { Page, Eye, Ser, NM, Card } from '../../components/v2/neome';

/**
 * Domov · R12 — wired
 *
 * Five daily-ritual cards in fixed order (Body · Nutrition · Mindset
 * · Habits · Reflections) plus a Cyklus card.
 *
 * Wired to live data:
 * - User name from useSupabaseAuth
 * - tier from useSubscription
 * - Active program from useUserProgram (currently always null per
 *   hook's TEMP — design's "no program" path is what shows)
 * - Today's meals from useMealPlan().todayPlan
 * - Habits with today's completion state from useSupabaseHabits
 * - Cycle day/phase from useCycleData
 * - Week-strip activity dots from useWorkoutHistory.workoutHistory
 *
 * Static (FEATURE-NEEDED to wire):
 * - "Dnešné zamyslenie" prompt — needs server-side prompt-of-day
 *   service or static curated list (currently editorial copy)
 * - "Meditácia dňa" — same: needs daily-meditation curation service
 * - Reflection history pills (Plus tier) — wired to access-code-
 *   based reflection system; the access-code tier is non-trivial
 *   to thread here, see FEATURE-NEEDED-DOMOV-REFLECTIONS
 */

const SECTIONS = {
  TELO: NM.TERRA,
  STRAVA: NM.SAGE,
  MYSEL: NM.MAUVE,
  CYKLUS: NM.MAUVE,
};

const SK_DAYS = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];
const SK_MONTHS = ['január', 'február', 'marec', 'apríl', 'máj', 'jún', 'júl', 'august', 'september', 'október', 'november', 'december'];

const PHASE_COLOR: Record<string, string> = {
  menstrual: '#D69A9A',
  follicular: '#A8C4A0',
  ovulation: '#C8A8D4',
  luteal: '#D4B48C',
};

const PHASE_LABEL: Record<string, string> = {
  menstrual: 'Menštruačná',
  follicular: 'Folikulárna',
  ovulation: 'Ovulácia',
  luteal: 'Luteálna',
};

const PHASE_BLURB: Record<string, string> = {
  menstrual: 'Telo sa resetuje — doprajte si pokoj a teplo.',
  follicular: 'Energia sa vracia — dobré okno na pohyb.',
  ovulation: 'Vrchol energie a sebavedomia — sociálny čas.',
  luteal: 'Spomaľ a uzemni sa — telo sa pripravuje.',
};

const MEAL_LABELS: Record<string, string> = {
  ranajky: 'Raňajky',
  desiata: 'Desiata',
  obed: 'Obed',
  olovrant: 'Olovrant',
  vecera: 'Večera',
};

const MEAL_TIMES: Record<string, string> = {
  ranajky: '7:30',
  desiata: '10:30',
  obed: '13:00',
  olovrant: '16:00',
  vecera: '19:00',
};

function formatToday(d = new Date()): string {
  return `${SK_DAYS[d.getDay()]} · ${d.getDate()}. ${SK_MONTHS[d.getMonth()]}`;
}

function getGreetingPrefix(d = new Date()): string {
  const h = d.getHours();
  if (h < 11) return 'Krásne ráno';
  if (h < 17) return 'Krásny deň';
  return 'Krásny večer';
}

function deriveName(user: { email?: string | null; user_metadata?: { full_name?: string; name?: string } } | null): string {
  if (!user) return 'Eva';
  const meta = user.user_metadata;
  if (meta?.full_name) return meta.full_name.split(' ')[0];
  if (meta?.name) return meta.name.split(' ')[0];
  if (user.email) return user.email.split('@')[0].split('.')[0].replace(/^[a-z]/, (c) => c.toUpperCase());
  return 'Eva';
}

function recipeById(id: string) {
  return recipes.find((r) => r.id === id);
}

function SectionHeader({ children, right }: { children: string; right?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 22px', margin: '26px 0 12px' }}>
      <div style={{ fontSize: 10, letterSpacing: '0.2em', fontWeight: 500, color: NM.DEEP, textTransform: 'uppercase' }}>{children}</div>
      {right && <div style={{ fontSize: 10, letterSpacing: '0.2em', fontWeight: 400, color: 'rgba(61,41,33,0.35)', textTransform: 'uppercase' }}>{right}</div>}
    </div>
  );
}

function Greeting({ name, isPremium }: { name: string; isPremium: boolean }) {
  return (
    <div style={{ padding: '62px 22px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: NM.TERTIARY, fontWeight: 500 }}>
          {formatToday()}
          {isPremium && <span> · <span style={{ color: NM.GOLD }}>Plus</span></span>}
        </div>
        <button
          aria-label="Notifikácie"
          style={{
            all: 'unset',
            cursor: 'pointer',
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: `1px solid ${NM.HAIR_2}`,
            background: '#fff',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.6" strokeLinecap="round">
            <path d="M6 8h12M6 12h12M6 16h8" />
          </svg>
        </button>
      </div>
      <Ser size={32} style={{ marginTop: 16 }}>
        {getGreetingPrefix()},<br />
        <em style={{ fontStyle: 'italic', color: SECTIONS.TELO, fontWeight: 500 }}>{name}</em>
      </Ser>
      <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.5, color: '#6B5650', maxWidth: 280, fontWeight: 400 }}>
        Silné telo vzniká z malých každodenných rozhodnutí
      </div>
    </div>
  );
}

function WeekStrip() {
  const { workoutHistory } = useWorkoutHistory();
  const days = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];
  const today = new Date();
  const dow = (today.getDay() + 6) % 7; // Mon=0
  const start = new Date(today);
  start.setDate(today.getDate() - dow);

  const dates: number[] = [];
  const marked: boolean[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d.getDate());
    const dStr = d.toISOString().split('T')[0];
    marked.push(workoutHistory.some((w) => w.completedAt.split('T')[0] === dStr));
  }

  return (
    <div style={{ padding: '20px 18px 0' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          padding: '10px 8px',
          border: `1px solid ${NM.HAIR}`,
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
        }}
      >
        {days.map((d, i) => {
          const isToday = i === dow;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '10px 0 8px',
                borderRadius: 12,
                background: isToday ? NM.DEEP : 'transparent',
                color: isToday ? '#fff' : NM.DEEP,
              }}
            >
              <div style={{ fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: isToday ? 0.7 : 0.45, fontWeight: 500 }}>{d}</div>
              <div style={{ fontSize: 16, fontWeight: 500, fontFamily: NM.SERIF }}>{dates[i]}</div>
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  background: marked[i] ? (isToday ? '#fff' : SECTIONS.TELO) : 'transparent',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PillarDot({ color }: { color: string }) {
  return <div style={{ width: 6, height: 6, borderRadius: 3, background: color }} />;
}

function CTAArrow({ color, label, onClick }: { color: string; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        marginTop: 14,
        background: 'transparent',
        border: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 500,
        color,
        fontFamily: NM.SANS,
      }}
    >
      {label}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}

// ─── 1 · Body card ─────────────────────────────────────────────
function BodyCard({ isPremium }: { isPremium: boolean }) {
  const navigate = useNavigate();
  const { userProgram } = useUserProgram();

  if (userProgram) {
    return (
      <div style={{ padding: '0 18px', marginBottom: 12 }}>
        <Card padding={18}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <PillarDot color={SECTIONS.TELO} />
            <Eye size={10}>Telo · pokračuj</Eye>
          </div>
          <div
            style={{
              position: 'relative',
              borderRadius: 14,
              overflow: 'hidden',
              aspectRatio: '16/10',
              background: `url(${userProgram.todaysExercise?.thumbnail ?? '/images/r9/lifestyle-core-workout.jpg'}) center/cover`,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)' }} />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 54,
                height: 54,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.95)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={NM.DEEP}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            {userProgram.todaysExercise?.duration && (
              <div style={{ position: 'absolute', bottom: 10, right: 10, padding: '4px 10px', borderRadius: 999, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 10.5, fontWeight: 500, letterSpacing: '0.04em' }}>
                {userProgram.todaysExercise.duration}
              </div>
            )}
          </div>
          <div style={{ marginTop: 14 }}>
            <Ser size={20}>
              {userProgram.name} · Týž. {userProgram.week}, Deň {userProgram.day}
            </Ser>
            {userProgram.todaysExercise && (
              <div style={{ fontSize: 12.5, color: NM.MUTED, marginTop: 4, lineHeight: 1.45, fontWeight: 300 }}>{userProgram.todaysExercise.title}</div>
            )}
            <CTAArrow color={SECTIONS.TELO} label="Spustiť tréning" onClick={() => navigate('/kniznica/telo/programy')} />
          </div>
        </Card>
      </div>
    );
  }

  // No active program → suggested exercise (curated, not from a hook)
  // FEATURE-NEEDED: "exercise of the day" curation service (currently static)
  return (
    <div style={{ padding: '0 18px', marginBottom: 12 }}>
      <Card padding={18}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <PillarDot color={SECTIONS.TELO} />
          <Eye size={10}>{isPremium ? 'Telo · navrhujeme' : 'Telo · cvik dňa'}</Eye>
        </div>
        <Ser size={20}>Uvoľni driek · 8 min</Ser>
        <div style={{ fontSize: 12.5, color: NM.MUTED, marginTop: 4, lineHeight: 1.45, fontWeight: 300 }}>
          Krátka sekvencia proti bolesti chrbta — z knižnice
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: NM.TERTIARY, fontWeight: 500, marginTop: 12 }}>
          <span>8 min</span>
          <span>·</span>
          <span>Začiatočník</span>
        </div>
        <CTAArrow color={SECTIONS.TELO} label="Začať cvičiť" onClick={() => navigate('/kniznica/telo')} />
      </Card>
    </div>
  );
}

// ─── 2 · Nutrition card ────────────────────────────────────────
function NutritionCard({ isPremium }: { isPremium: boolean }) {
  const navigate = useNavigate();
  const { todayPlan } = useMealPlan();

  // Resolve recipe IDs to titles (selected option of each meal)
  const meals = todayPlan?.meals
    .map((slot) => {
      const recipeId = slot.options[slot.selected];
      const recipe = recipeById(recipeId);
      if (!recipe) return null;
      return {
        eye: `${MEAL_LABELS[slot.type] ?? slot.type} · ${MEAL_TIMES[slot.type] ?? ''}`.trim().replace(/·\s*$/, ''),
        title: recipe.title,
        sub: `${Math.round(recipe.calories * slot.portionMultiplier)} kcal · ${recipe.prepTime} min`,
        recipeId: recipe.id,
        // Use cycle/category-based image stand-in (real recipe.imageUrl depends on
        // recipes data; we keep section thumbnails consistent with the design)
        img: recipe.category === 'ranajky' || recipe.category === 'snack' || recipe.category === 'smoothie' ? 'testimonial-recipe.jpg' : 'section-nutrition.jpg',
      };
    })
    .filter(Boolean)
    .slice(0, 3) as { eye: string; title: string; sub: string; recipeId: string; img: string }[] | undefined;

  if (todayPlan && meals && meals.length > 0) {
    const dow = (new Date().getDay() + 6) % 7;
    const dayLabel = ['pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota', 'nedeľa'][dow];
    return (
      <div style={{ padding: '0 18px', marginBottom: 12 }}>
        <Card padding={18}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <PillarDot color={SECTIONS.STRAVA} />
            <Eye size={10}>
              Jedálniček · {dayLabel} · {todayPlan.totalCalories} kcal
            </Eye>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {meals.map((r, i) => (
              <button
                key={r.eye + r.title}
                onClick={() => navigate(`/recipe/${r.recipeId}`)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: i < meals.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 10, background: `url(/images/r9/${r.img}) center/cover`, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <Eye size={9.5}>{r.eye}</Eye>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: NM.DEEP, marginTop: 2, lineHeight: 1.2 }}>{r.title}</div>
                  <div style={{ fontSize: 11.5, color: NM.MUTED, marginTop: 1, fontWeight: 300 }}>{r.sub}</div>
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={NM.TERTIARY} strokeWidth="2" strokeLinecap="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
            <CTAArrow color={SECTIONS.STRAVA} label="Celý jedálniček" onClick={() => navigate('/kniznica/strava/jedalnicek')} />
          </div>
        </Card>
      </div>
    );
  }

  // No meal plan → recipe of the day + quiet upsell.
  // FEATURE-NEEDED: "recipe of the day" rotation service. Currently static curated.
  return (
    <div style={{ padding: '0 18px', marginBottom: 12 }}>
      <Card padding={18}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <PillarDot color={SECTIONS.STRAVA} />
          <Eye size={10}>Výživa · recept dňa</Eye>
        </div>
        <Ser size={20}>Zelený šalát s kozím syrom</Ser>
        <div style={{ fontSize: 12.5, color: NM.MUTED, marginTop: 4, lineHeight: 1.45, fontWeight: 300 }}>
          Ľahký obed · 420 kcal · 22 g bielkovín
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: NM.TERTIARY, fontWeight: 500, marginTop: 12 }}>
          <span>15 min</span>
          <span>·</span>
          <span>Z knižnice</span>
        </div>
        <CTAArrow color={SECTIONS.STRAVA} label="Otvoriť recept" onClick={() => navigate('/kniznica/strava')} />
        {!isPremium && (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${NM.HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: NM.TERTIARY, fontWeight: 300, lineHeight: 1.4 }}>
              Pridaj jedálniček — každodenné jedlá prispôsobené tebe.
            </div>
            <button
              onClick={() => navigate('/checkout?upsell=mealplan')}
              style={{
                background: 'transparent',
                border: 0,
                padding: 0,
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 500,
                color: SECTIONS.STRAVA,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                whiteSpace: 'nowrap',
                fontFamily: NM.SANS,
              }}
            >
              +57 €
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={SECTIONS.STRAVA} strokeWidth="2" strokeLinecap="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── 3 · Mindset card ──────────────────────────────────────────
// FEATURE-NEEDED-DOMOV-MEDITATION: meditation-of-the-day rotation service.
// Currently editorial curation: fixed "Ranný pokoj · 10 min · Gabi".
function MindsetCard() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '0 18px', marginBottom: 12 }}>
      <div
        style={{
          background: `linear-gradient(135deg, #5C4458 0%, ${SECTIONS.MYSEL} 100%)`,
          borderRadius: 20,
          padding: 18,
          position: 'relative',
          overflow: 'hidden',
          color: '#fff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <PillarDot color="rgba(255,255,255,0.5)" />
          <Eye size={10} color="rgba(255,255,255,0.7)">Myseľ · meditácia dňa</Eye>
        </div>
        <Ser size={22} color="#fff" style={{ lineHeight: 1.18, marginBottom: 4 }}>Ranný pokoj</Ser>
        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.72)', marginBottom: 14, fontWeight: 300, lineHeight: 1.45 }}>
          Krátka ranná meditácia na uzemnenie pred dňom.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 12, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
            <span>10 min</span>
            <span>·</span>
            <span>Gabi</span>
          </div>
          <button
            onClick={() => navigate('/kniznica/mysel')}
            aria-label="Prehrať meditáciu"
            style={{
              all: 'unset',
              cursor: 'pointer',
              width: 44,
              height: 44,
              borderRadius: 22,
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── 4 · Habits card ───────────────────────────────────────────
function HabitsCard({ isPremium }: { isPremium: boolean }) {
  const navigate = useNavigate();
  const { habits, loading } = useSupabaseHabits() as {
    habits: { id: string; name: string; targetPerDay: number; completions: Record<string, number> }[];
    loading: boolean;
  };
  const todayStr = new Date().toISOString().split('T')[0];
  const visible = (habits ?? []).slice(0, 3).map((h) => ({
    label: h.name,
    done: (h.completions?.[todayStr] ?? 0) >= h.targetPerDay,
  }));

  return (
    <div style={{ padding: '0 18px', marginBottom: 12 }}>
      <Card padding={18}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <PillarDot color={SECTIONS.TELO} />
          <Eye size={10}>Návyky · dnes</Eye>
        </div>
        <Ser size={20} style={{ marginBottom: 10 }}>Malé kroky, veľký rozdiel</Ser>
        <div>
          {loading || visible.length === 0 ? (
            <div style={{ padding: '14px 0', fontSize: 12.5, color: NM.MUTED, fontWeight: 300, lineHeight: 1.5 }}>
              {loading ? 'Načítavam návyky…' : 'Zatiaľ žiadne návyky. Pridaj si prvý.'}
            </div>
          ) : (
            visible.map((h, i) => (
              <div
                key={h.label + i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: i < visible.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    flexShrink: 0,
                    border: `1.5px solid ${h.done ? SECTIONS.TELO : NM.HAIR_2}`,
                    background: h.done ? SECTIONS.TELO : 'transparent',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {h.done && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5 9-11" />
                    </svg>
                  )}
                </div>
                <div style={{ fontSize: 13.5, color: h.done ? NM.TERTIARY : NM.DEEP, textDecoration: h.done ? 'line-through' : 'none' }}>
                  {h.label}
                </div>
              </div>
            ))
          )}
          <button
            onClick={() => navigate('/navyky')}
            style={{
              marginTop: 10,
              background: 'transparent',
              border: 0,
              padding: '8px 0',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 500,
              color: SECTIONS.TELO,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: NM.SANS,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={SECTIONS.TELO} strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Pridať návyk
          </button>
        </div>
        {!isPremium && (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${NM.HAIR}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: NM.TERTIARY, fontWeight: 300 }}>
              Ukladá sa len s <span style={{ color: NM.GOLD, fontWeight: 500 }}>Plus</span>
            </div>
            <button
              onClick={() => navigate('/paywall')}
              style={{
                background: 'transparent',
                border: 0,
                padding: 0,
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 500,
                color: NM.DEEP,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: NM.SANS,
              }}
            >
              Odomknúť
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="2" strokeLinecap="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── 5 · Reflections card ──────────────────────────────────────
// FEATURE-NEEDED-DOMOV-REFLECTIONS: prompt-of-the-day curation +
// account-scoped (vs access-code-scoped) reflection store. Currently
// the prompt is editorial, the textarea routes to /dennik for entry.
function ReflectionsCard({ isPremium }: { isPremium: boolean }) {
  const navigate = useNavigate();
  const history = [
    { d: 'Ned', excerpt: 'Prechádzka s Léou' },
    { d: 'Sob', excerpt: 'Dlhý spánok a káva' },
    { d: 'Pia', excerpt: 'Tichý večer' },
  ];
  return (
    <div style={{ padding: '0 18px', marginBottom: 12 }}>
      <div style={{ background: NM.DEEP, borderRadius: 20, padding: '18px 20px', color: '#fff', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <PillarDot color={SECTIONS.MYSEL} />
            <Eye size={10} color="rgba(255,255,255,0.6)">Dnešné zamyslenie</Eye>
          </div>
          <Eye size={10} color="rgba(255,255,255,0.42)">{SK_DAYS[new Date().getDay()]}</Eye>
        </div>
        <Ser size={20} color="#fff" weight={400} style={{ lineHeight: 1.3, marginBottom: 14 }}>
          Čo ti dnes dalo najviac energie?
        </Ser>
        <div
          onClick={() => navigate('/dennik')}
          style={{
            padding: '12px 14px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.06)',
            border: '1px dashed rgba(255,255,255,0.22)',
            fontFamily: NM.SERIF,
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.5,
            marginBottom: isPremium ? 16 : 0,
            cursor: 'pointer',
          }}
        >
          Napíš jednu vetu…
        </div>
        {isPremium ? (
          <div>
            <Eye size={9} color="rgba(255,255,255,0.42)" style={{ marginBottom: 10 }}>Predošlé dni</Eye>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
              {history.map((r) => (
                <div
                  key={r.d}
                  style={{
                    flexShrink: 0,
                    padding: '8px 12px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.78)',
                    fontWeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: 9, color: SECTIONS.MYSEL, fontWeight: 500 }}>{r.d}</span>
                  <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
                  <span>{r.excerpt}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
              Ukladá sa len s <span style={{ color: NM.GOLD, fontWeight: 500 }}>Plus</span>
            </div>
            <button
              onClick={() => navigate('/paywall')}
              style={{
                background: 'transparent',
                border: 0,
                padding: 0,
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 500,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: NM.SANS,
              }}
            >
              Odomknúť
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 6 · Cyklus card ───────────────────────────────────────────
function CyklusCard() {
  const navigate = useNavigate();
  const { cycleData, derivedState } = useCycleData();
  const hasCycleData = !!cycleData?.lastPeriodStart;

  if (!hasCycleData) {
    return (
      <div style={{ padding: '0 18px', marginBottom: 12 }}>
        <div
          style={{
            background: 'linear-gradient(180deg, #F1E6EA 0%, #fff 100%)',
            borderRadius: 20,
            padding: 20,
            border: `1px solid ${NM.HAIR}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <svg width="140" height="140" viewBox="0 0 140 140" style={{ position: 'absolute', top: -20, right: -30, opacity: 0.3 }}>
            <circle cx="70" cy="70" r="60" fill="none" stroke={SECTIONS.CYKLUS} strokeWidth="1" />
            <circle cx="70" cy="70" r="40" fill="none" stroke={SECTIONS.CYKLUS} strokeWidth="1" strokeDasharray="2 4" />
            <circle cx="70" cy="30" r="4" fill={SECTIONS.CYKLUS} />
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <PillarDot color={SECTIONS.CYKLUS} />
            <Eye size={10}>Cyklus</Eye>
          </div>
          <Ser size={22} style={{ lineHeight: 1.18, marginBottom: 8, maxWidth: 260 }}>
            Sleduj svoj cyklus, rozumej svojmu telu
          </Ser>
          <div style={{ fontSize: 12.5, color: NM.MUTED, marginBottom: 16, lineHeight: 1.5, fontWeight: 300, maxWidth: 280 }}>
            Predpovede, vzorce nálady a energie, tréningy a jedlá podľa fázy. Stačí pár detailov.
          </div>
          <button
            onClick={() => navigate('/kniznica/periodka')}
            style={{
              background: NM.DEEP,
              color: '#fff',
              border: 0,
              padding: '11px 18px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: NM.SANS,
            }}
          >
            Nastaviť cyklus
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  const day = derivedState?.currentDay ?? 1;
  const total = cycleData.cycleLength ?? 28;
  const phaseKey = derivedState?.currentPhase?.key ?? 'follicular';
  const phaseColor = PHASE_COLOR[phaseKey] ?? '#7A5A72';
  const phaseLabel = PHASE_LABEL[phaseKey] ?? 'Folikulárna';
  const phaseBlurb = PHASE_BLURB[phaseKey] ?? 'Energia sa vracia — dobré okno na pohyb.';
  const daysToNext = Math.max(0, total - day);
  const phases = (derivedState?.phaseRanges ?? [
    { key: 'menstrual', name: '', start: 1, end: 5 },
    { key: 'follicular', name: '', start: 6, end: 13 },
    { key: 'ovulation', name: '', start: 14, end: 16 },
    { key: 'luteal', name: '', start: 17, end: 28 },
  ]).map((p) => ({
    w: (p.end - p.start + 1) / total,
    c: PHASE_COLOR[p.key] ?? '#7A5A72',
  }));
  const todayPct = day / total;

  return (
    <div style={{ padding: '0 18px', marginBottom: 12 }}>
      <div
        style={{
          padding: '22px 22px 20px',
          borderRadius: 22,
          background: 'linear-gradient(180deg, #F1E6EA 0%, #FFF9F3 55%, #fff 100%)',
          border: `1px solid ${NM.HAIR}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: 'absolute', top: -40, right: -50, opacity: 0.35, pointerEvents: 'none' }}>
          <circle cx="90" cy="90" r="78" fill="none" stroke={SECTIONS.CYKLUS} strokeWidth="0.8" />
          <circle cx="90" cy="90" r="54" fill="none" stroke={SECTIONS.CYKLUS} strokeWidth="0.8" strokeDasharray="2 5" />
          <circle cx="90" cy="12" r="3" fill={SECTIONS.CYKLUS} />
        </svg>
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <PillarDot color={SECTIONS.CYKLUS} />
              <Eye size={10} color={NM.DEEP}>Cyklus</Eye>
            </div>
            <div style={{ fontSize: 10.5, color: NM.TERTIARY, fontWeight: 400, letterSpacing: '0.04em' }}>
              Deň {day} / {total}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 6 }}>
            <div style={{ fontFamily: NM.SERIF, fontSize: 76, lineHeight: 0.9, color: NM.DEEP, fontWeight: 500, letterSpacing: '-0.04em' }}>{day}</div>
            <div style={{ paddingBottom: 8 }}>
              <div style={{ fontFamily: NM.SERIF, fontSize: 20, fontStyle: 'italic', color: phaseColor, fontWeight: 500, lineHeight: 1.1 }}>{phaseLabel}</div>
              <div style={{ fontSize: 11, color: NM.TERTIARY, fontWeight: 400, marginTop: 2, letterSpacing: '0.02em' }}>fáza</div>
            </div>
          </div>
          <Ser size={18} style={{ lineHeight: 1.25, marginTop: 10, marginBottom: 14, maxWidth: 280 }}>
            {phaseBlurb}
          </Ser>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <div style={{ display: 'flex', height: 5, borderRadius: 3, overflow: 'hidden', background: NM.HAIR_2 }}>
              {phases.map((p, i) => (
                <div key={i} style={{ flex: p.w, background: p.c, opacity: 0.9 }} />
              ))}
            </div>
            <div
              style={{
                position: 'absolute',
                top: -4,
                left: `calc(${todayPct * 100}% - 7px)`,
                width: 13,
                height: 13,
                borderRadius: 999,
                background: '#fff',
                border: `2.5px solid ${NM.DEEP}`,
                boxShadow: '0 2px 6px rgba(61,41,33,0.18)',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${NM.HAIR}` }}>
            <div style={{ fontSize: 11.5, color: NM.MUTED, fontWeight: 300, lineHeight: 1.4 }}>
              Menštruácia o <span style={{ color: NM.DEEP, fontWeight: 500 }}>{daysToNext} dní</span>
            </div>
            <button
              onClick={() => navigate('/kniznica/periodka')}
              style={{
                background: NM.DEEP,
                color: '#fff',
                border: 0,
                padding: '9px 16px',
                borderRadius: 999,
                fontSize: 11.5,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                letterSpacing: '0.02em',
                fontFamily: NM.SANS,
              }}
            >
              Zaznač dnes
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Footer · Free upgrade nudge / Plus referral ───────────────
function FooterNudge({ isPremium }: { isPremium: boolean }) {
  const navigate = useNavigate();
  if (!isPremium) {
    return (
      <div style={{ padding: '12px 18px 24px' }}>
        <div
          style={{
            padding: '22px',
            borderRadius: 22,
            background: `linear-gradient(135deg, ${NM.DEEP} 0%, ${NM.DEEP_2} 100%)`,
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 120,
              height: 120,
              borderRadius: 999,
              background: `radial-gradient(circle, ${NM.GOLD}55, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>
            <Eye size={10} color={NM.GOLD} style={{ marginBottom: 12 }}>NeoMe Plus</Eye>
            <Ser size={22} color="#fff" style={{ lineHeight: 1.12, marginBottom: 10 }}>
              Nechaj svoj
              <br />
              <span style={{ color: NM.GOLD, fontStyle: 'italic', fontWeight: 500 }}>príbeh ukladať.</span>
            </Ser>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.55, marginBottom: 16, maxWidth: 300, fontWeight: 300 }}>
              S Plus získaš plný program pre svoje telo, cyklus a výživu. Tvoje návyky, reflexie a história ostanú uložené.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {['Osobný program cvičení a jedálnička', 'Sledovanie cyklu s predpoveďou', 'Neobmedzený prístup do knižnice'].map((b) => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l3 3 7-7" stroke={NM.GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>{b}</div>
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
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.02em',
                cursor: 'pointer',
                fontFamily: NM.SANS,
              }}
            >
              Vyskúšať NeoMe Plus
            </button>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              4,99 € / prvý mesiac · zrušenie kedykoľvek
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ padding: '14px 22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 11.5, color: NM.TERTIARY, fontWeight: 300 }}>Páči sa ti NeoMe?</div>
      <button
        onClick={() => navigate('/referral')}
        style={{
          background: 'transparent',
          border: 0,
          padding: 0,
          cursor: 'pointer',
          fontSize: 11.5,
          fontWeight: 500,
          color: NM.DEEP,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontFamily: NM.SANS,
        }}
      >
        Pozvi kamarátku
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="2" strokeLinecap="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}

export default function DomovNew() {
  const { user } = useSupabaseAuth();
  const { isPremium } = useSubscription();
  const name = deriveName(user as never);

  return (
    <Page>
      <Greeting name={name} isPremium={isPremium} />
      <WeekStrip />
      <SectionHeader>Dnes</SectionHeader>
      <BodyCard isPremium={isPremium} />
      <NutritionCard isPremium={isPremium} />
      <MindsetCard />
      <HabitsCard isPremium={isPremium} />
      <ReflectionsCard isPremium={isPremium} />
      <SectionHeader right={SK_MONTHS[new Date().getMonth()]}>Tento týždeň</SectionHeader>
      <CyklusCard />
      <FooterNudge isPremium={isPremium} />
    </Page>
  );
}
