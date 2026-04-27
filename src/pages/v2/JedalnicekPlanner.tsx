import { useNavigate } from 'react-router-dom';
import { useMealPlan } from '../../features/nutrition/useMealPlan';
import { recipes } from '../../data/recipes';
import { Page, BackHeader, Eye, Ser, NM } from '../../components/v2/neome';
import type { DayPlan, MealSlot } from '../../features/nutrition/types';

/**
 * Jedálniček (Meal plan) — R3 weekly planner
 *
 * 7-day strip + active-day timeline of meals with thumbnails + total
 * kcal + Nákupný zoznam shortcut.
 *
 * Wired:
 * - useMealPlan → plan, activeDay (index 0-6), setActiveDay
 * - Recipes resolved from src/data/recipes by slot.options[selected]
 *
 * FEATURE-NEEDED-MEALPLAN-MULTI-WEEK: planner currently only renders
 * the active week. Design has multi-week support; feature requires
 * weekly rotation logic in mealPlanGenerator.
 * FEATURE-NEEDED-SHOPPING-LIST: Nákupný zoznam screen + ingredient
 * aggregation across the week's selected meals.
 *
 * Old version: JedalnicekPlanner.old.tsx.
 */

const SK_DAYS_SHORT = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'] as const;
const SK_DAYS_FULL = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'] as const;

const SLOT_LABEL: Record<MealSlot['type'], string> = {
  ranajky: 'Raňajky',
  desiata: 'Desiata',
  obed: 'Obed',
  olovrant: 'Olovrant',
  vecera: 'Večera',
};

const SLOT_TIME: Record<MealSlot['type'], string> = {
  ranajky: '07:30',
  desiata: '10:30',
  obed: '13:00',
  olovrant: '16:00',
  vecera: '19:00',
};

function recipeImg(recipeId: string): string {
  const r = recipes.find((x) => x.id === recipeId);
  if (!r) return 'testimonial-recipe.jpg';
  if (r.category === 'obed') return 'section-nutrition.jpg';
  if (r.category === 'vecera') return 'program-body-forming.jpg';
  return 'testimonial-recipe.jpg';
}

export default function JedalnicekPlanner() {
  const navigate = useNavigate();
  const { plan, activeDay, setActiveDay } = useMealPlan();

  const today = new Date();
  const dow = (today.getDay() + 6) % 7; // Mon=0
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dow);

  const days = SK_DAYS_SHORT.map((d, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return { d, n: date.getDate(), idx: i };
  });
  const activeIdx = activeDay % 7;

  const dayPlan: DayPlan | null = plan?.days[activeDay] ?? null;
  const meals = dayPlan?.meals ?? [];
  const total = dayPlan?.totalCalories ?? 0;

  return (
    <Page>
      <BackHeader title="Jedálniček" showSearch={false} />

      <div style={{ padding: '6px 18px 22px' }}>
        <Eye style={{ marginBottom: 10 }}>
          Týždeň · {weekStart.getDate()}. – {days[6].n}. {['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'][weekStart.getMonth()]}
        </Eye>
        <Ser size={30} style={{ lineHeight: 1.04, marginBottom: 14 }}>
          Tvoj plán
          <br />
          na tento týždeň.
        </Ser>
      </div>

      <div style={{ padding: '0 14px 6px', display: 'flex', gap: 6 }}>
        {days.map((day) => {
          const active = day.idx === activeIdx;
          return (
            <button
              key={day.idx}
              onClick={() => setActiveDay(day.idx)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                flex: 1,
                padding: '12px 4px',
                background: active ? NM.DEEP : 'transparent',
                color: active ? '#fff' : NM.DEEP,
                borderRadius: 14,
                textAlign: 'center',
                border: active ? 'none' : `1px solid ${NM.HAIR}`,
              }}
            >
              <div style={{ fontFamily: NM.SANS, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: active ? 'rgba(255,255,255,0.7)' : NM.TERTIARY, marginBottom: 4 }}>
                {day.d}
              </div>
              <div style={{ fontFamily: NM.SERIF, fontSize: 17, fontWeight: 500, letterSpacing: '-0.005em' }}>{day.n}</div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: '22px 18px 14px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Eye>
          {SK_DAYS_FULL[activeIdx]} · {meals.length} {meals.length === 1 ? 'jedlo' : meals.length < 5 ? 'jedlá' : 'jedál'}
        </Eye>
        {total > 0 && (
          <div style={{ fontFamily: NM.SERIF, fontSize: 16, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>{total} kcal</div>
        )}
      </div>

      {meals.length === 0 ? (
        <div style={{ margin: '0 18px', padding: '40px 24px', textAlign: 'center', background: '#fff', borderRadius: 18, border: `1px solid ${NM.HAIR}` }}>
          <Ser size={18} style={{ marginBottom: 6 }}>Plán nie je vygenerovaný</Ser>
          <div style={{ fontFamily: NM.SANS, fontSize: 12, color: NM.MUTED, lineHeight: 1.5, marginBottom: 16 }}>
            Vygeneruj si týždenný plán z aktuálnych preferencií.
          </div>
          <button
            onClick={() => navigate('/onboarding')}
            style={{
              background: NM.DEEP,
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 999,
              fontFamily: NM.SANS,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Nastaviť výživu
          </button>
        </div>
      ) : (
        <div style={{ padding: '0 18px 20px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 46, top: 12, bottom: 20, width: 1, background: NM.HAIR_2 }} />
          {meals.map((m, i) => {
            const recipeId = m.options[m.selected];
            const r = recipes.find((x) => x.id === recipeId);
            const kcal = r ? Math.round(r.calories * m.portionMultiplier) : 0;
            return (
              <div key={`${m.type}-${i}`} style={{ display: 'flex', gap: 14, paddingBottom: 18, position: 'relative' }}>
                <div
                  style={{
                    width: 48,
                    flexShrink: 0,
                    paddingTop: 2,
                    fontFamily: NM.SANS,
                    fontSize: 11,
                    color: NM.TERTIARY,
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {SLOT_TIME[m.type]}
                </div>
                <div style={{ width: 10, height: 10, borderRadius: 999, background: NM.BG, border: `2px solid ${NM.TERRA}`, flexShrink: 0, marginTop: 6, zIndex: 1 }} />
                <button
                  onClick={() => r && navigate(`/recipe/${r.id}`)}
                  style={{ all: 'unset', cursor: 'pointer', flex: 1, display: 'flex', gap: 12, alignItems: 'center', textAlign: 'left' }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 12,
                      backgroundImage: `url(/images/r9/${recipeImg(recipeId)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Eye size={9} style={{ marginBottom: 4 }}>{SLOT_LABEL[m.type]}</Eye>
                    <div style={{ fontFamily: NM.SERIF, fontSize: 14, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em', lineHeight: 1.3, marginBottom: 4 }}>
                      {r?.title ?? 'Recept'}
                    </div>
                    <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED }}>{kcal} kcal</div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ padding: '4px 18px 20px' }}>
        <button
          onClick={() => navigate('/kniznica/strava/jedalnicek/shopping')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            gap: 14,
            padding: '16px 18px',
            background: '#fff',
            border: `1px solid ${NM.HAIR_2}`,
            borderRadius: 16,
            boxSizing: 'border-box',
          }}
        >
          <div style={{ width: 40, height: 40, borderRadius: 12, background: NM.CREAM_3 ?? '#EAE3D6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 4h2l1.5 8h8L16 6H5.5" stroke={NM.DEEP} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="7" cy="15" r="1" fill={NM.DEEP} />
              <circle cx="13" cy="15" r="1" fill={NM.DEEP} />
            </svg>
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontFamily: NM.SERIF, fontSize: 15, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em', marginBottom: 2 }}>Nákupný zoznam</div>
            <div style={{ fontFamily: NM.SANS, fontSize: 11, color: NM.MUTED }}>{plan?.days.length ?? 0} dní · všetko pre tento týždeň</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke={NM.TERTIARY} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </Page>
  );
}
