import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUniversalFavorites } from '../../hooks/useUniversalFavorites';
import { useRecipe, SLOT_LABEL } from '@/hooks/useRecipes';
import { useMealPlan } from '../../features/nutrition/useMealPlan';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useEntitlement } from '../../hooks/useEntitlement';
import { BackHeader, Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Recipe detail — reads from Supabase via useRecipe(id).
 *
 * Primary CTA is "Pridať do obľúbených" (favourites toggle). Users who own
 * the meal-plan add-on (hasMealPlanner) additionally get a secondary
 * "Pridať do jedálnička" button that opens a sheet listing their meal-plan
 * days + slots; tapping a slot inserts the recipe via
 * useMealPlan.setRecipeForSlot and closes the sheet.
 */

function recipeHeroImg(slot: string): string {
  if (slot === 'hlavne') return 'section-nutrition.jpg';
  return 'testimonial-recipe.jpg';
}

function instructionSteps(text: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const SK_DAYS_SHORT = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'] as const;

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useUniversalFavorites();
  const { recipe, loading } = useRecipe(id);
  const { plan, setRecipeForSlot } = useMealPlan();
  const { hasMealPlanner } = useSubscription();
  const entitlement = useEntitlement('recipe', id);

  // Detail-page mount counts as a "view" of this recipe (per ADR-0001).
  // For free users at quota, redirect to paywall before rendering.
  useEffect(() => {
    if (entitlement.loading) return;
    if (!entitlement.allowed) {
      navigate('/paywall', { replace: true });
      return;
    }
    entitlement.logView();
  }, [entitlement.loading, entitlement.allowed]);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [showPicker, setShowPicker] = useState(false);
  const [picked, setPicked] = useState<{ dayIndex: number; slotIndex: number } | null>(null);

  const toggleIngredient = (i: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const onAddToPlan = () => {
    if (!plan) {
      navigate('/jedalnicek');
      return;
    }
    setShowPicker(true);
  };

  const onPickSlot = (dayIndex: number, slotIndex: number) => {
    if (!recipe) return;
    setRecipeForSlot(dayIndex, slotIndex, recipe.id);
    setPicked({ dayIndex, slotIndex });
    // Close after a short confirmation moment so user sees the tick.
    setTimeout(() => {
      setShowPicker(false);
      setPicked(null);
    }, 700);
  };

  if (loading || entitlement.loading) {
    return (
      <div style={{ background: NM.BG, minHeight: '100vh', fontFamily: NM.SANS }}>
        <BackHeader title="Recept" showSearch={false} />
        <div style={{ padding: '40px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[100, 60, 80, 40].map((w, i) => (
            <div key={i} style={{ height: 16, width: `${w}%`, borderRadius: 6, background: NM.HAIR }} />
          ))}
        </div>
      </div>
    );
  }

  // Quota exhausted — render nothing while the useEffect handles redirect.
  if (!entitlement.allowed) return null;

  if (!recipe) {
    return (
      <div style={{ background: NM.BG, minHeight: '100vh', fontFamily: NM.SANS, color: NM.DEEP }}>
        <BackHeader title="Recept" showSearch={false} />
        <div style={{ padding: 40, textAlign: 'center' }}>
          <Body>Recept sa nenašiel.</Body>
        </div>
      </div>
    );
  }

  const isFav = isFavorite(recipe.id, 'recipe');
  const steps = instructionSteps(recipe.instructions);

  return (
    <div style={{ background: NM.BG, minHeight: '100vh', position: 'relative', fontFamily: NM.SANS, color: NM.DEEP, paddingBottom: 'calc(env(safe-area-inset-bottom) + 100px)' }}>
      {/* Hero image */}
      <div
        style={{
          height: 340,
          position: 'relative',
          backgroundImage: `url(/images/r9/${recipeHeroImg(recipe.slot)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(248,245,240,1) 100%)' }} />
        <button
          onClick={() => navigate(-1)}
          aria-label="Späť"
          style={{
            all: 'unset', cursor: 'pointer', position: 'absolute',
            top: 'calc(env(safe-area-inset-top) + 8px)', left: 18,
            width: 38, height: 38, borderRadius: 999,
            background: 'rgba(255,255,255,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>

      <div style={{ marginTop: -30, position: 'relative' }}>
        {/* Title section */}
        <div style={{ padding: '0 18px 22px' }}>
          <Eye color={NM.GOLD} style={{ marginBottom: 12 }}>
            {SLOT_LABEL[recipe.slot]}{recipe.prep_minutes ? ` · ${recipe.prep_minutes} min` : ''}
          </Eye>
          <Ser size={32} style={{ lineHeight: 1.02, marginBottom: 14 }}>{recipe.name}</Ser>
        </div>

        {/* Macros strip */}
        {(recipe.kcal || recipe.protein || recipe.carbs || recipe.fat) && (
          <div style={{ padding: '18px 18px', display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${NM.HAIR}`, borderBottom: `1px solid ${NM.HAIR}` }}>
            {([
              ['Kcal', recipe.kcal],
              ['Proteín', recipe.protein != null ? `${recipe.protein} g` : '—'],
              ['Sach.', recipe.carbs != null ? `${recipe.carbs} g` : '—'],
              ['Tuky', recipe.fat != null ? `${recipe.fat} g` : '—'],
            ] as [string, string | number | null][]).map(([k, v]) => (
              <div key={k} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: NM.SANS, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: NM.TERTIARY, marginBottom: 6 }}>{k}</div>
                <div style={{ fontFamily: NM.SERIF, fontSize: 20, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>{v ?? '—'}</div>
              </div>
            ))}
          </div>
        )}

        {/* Ingredients */}
        {recipe.ingredients.length > 0 && (
          <div style={{ padding: '22px 18px 22px', borderBottom: `1px solid ${NM.HAIR}` }}>
            <Eye style={{ marginBottom: 16 }}>Suroviny · {recipe.ingredients.length}</Eye>
            <div>
              {recipe.ingredients.map((ing, i) => {
                const checked = checkedIngredients.has(i);
                const label = ing.raw || (ing.grams ? `${ing.grams}g ${ing.name}` : ing.name);
                return (
                  <button
                    key={i}
                    onClick={() => toggleIngredient(i)}
                    style={{
                      all: 'unset', cursor: 'pointer', display: 'flex', width: '100%',
                      alignItems: 'center', gap: 12, padding: '10px 0',
                      borderBottom: i < recipe.ingredients.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 18, height: 18, borderRadius: 5,
                        border: `1.5px solid ${checked ? NM.SAGE : NM.HAIR_2}`,
                        background: checked ? NM.SAGE : 'transparent',
                        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {checked && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    <div style={{
                      flex: 1, fontFamily: NM.SANS, fontSize: 14, color: checked ? NM.TERTIARY : NM.DEEP,
                      lineHeight: 1.4, textDecoration: checked ? 'line-through' : 'none', textAlign: 'left',
                    }}>
                      {label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Steps / instructions */}
        {steps.length > 0 && (
          <div style={{ padding: '22px 18px 22px' }}>
            <Eye style={{ marginBottom: 20 }}>
              Postup · {steps.length} {steps.length === 1 ? 'krok' : steps.length < 5 ? 'kroky' : 'krokov'}
            </Eye>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 14 }}>
                  <div style={{ fontFamily: NM.SERIF, fontSize: 28, fontWeight: 400, color: NM.TERRA, lineHeight: 1, letterSpacing: '-0.02em', width: 32, flexShrink: 0 }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{ flex: 1, fontFamily: NM.SANS, fontSize: 14.5, color: NM.DEEP, lineHeight: 1.55, letterSpacing: '-0.002em' }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No instructions fallback */}
        {steps.length === 0 && recipe.instructions === null && (
          <div style={{ padding: '22px 18px', color: NM.MUTED, fontSize: 13, fontFamily: NM.SANS }}>
            Postup prípravy nie je k dispozícii.
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 0,
          padding: `16px 18px calc(env(safe-area-inset-bottom) + 16px)`,
          background: 'rgba(248,245,240,0.95)', backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${NM.HAIR}`, display: 'flex', gap: 10, zIndex: 50,
        }}
      >
        {hasMealPlanner && (
          <button
            onClick={onAddToPlan}
            aria-label="Pridať do jedálnička"
            style={{
              all: 'unset', cursor: 'pointer',
              width: 52, height: 52, borderRadius: 999,
              background: 'transparent',
              border: `1px solid ${NM.HAIR_2}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" />
            </svg>
          </button>
        )}
        <button
          onClick={() => toggleFavorite({
            id: recipe.id,
            type: 'recipe',
            title: recipe.name,
            duration: `${recipe.prep_minutes ?? 0} min`,
            kcal: recipe.kcal ?? 0,
            category: recipe.slot,
          })}
          style={{
            flex: 1, padding: '16px 20px',
            background: isFav ? NM.TERRA : NM.DEEP, color: '#fff', border: 'none', borderRadius: 999,
            fontFamily: NM.SANS, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={isFav ? '#fff' : 'none'} stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          {isFav ? 'V obľúbených' : 'Pridať do obľúbených'}
        </button>
      </div>

      {/* Day + slot picker sheet */}
      {showPicker && plan && (
        <div
          onClick={() => setShowPicker(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            background: 'rgba(42,26,20,0.42)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 520, maxHeight: '85vh', overflow: 'auto',
              background: NM.BG, borderTopLeftRadius: 22, borderTopRightRadius: 22,
              padding: '20px 18px calc(env(safe-area-inset-bottom) + 20px)',
              boxShadow: '0 -8px 30px rgba(0,0,0,0.18)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <Eye>Pridať do jedálnička</Eye>
              <button
                onClick={() => setShowPicker(false)}
                aria-label="Zavrieť"
                style={{ all: 'unset', cursor: 'pointer', padding: 6, fontFamily: NM.SANS, fontSize: 13, color: NM.MUTED }}
              >
                Zrušiť
              </button>
            </div>
            <Ser size={20} style={{ marginBottom: 4 }}>
              Kde mám pridať <em style={{ color: NM.TERRA, fontStyle: 'italic', fontWeight: 500 }}>{recipe?.name}</em>?
            </Ser>
            <Body style={{ marginBottom: 16, color: NM.TERTIARY, fontSize: 12 }}>
              Vyber deň a jedlo — nahradí aktuálne vybranú možnosť pre daný slot.
            </Body>

            {plan.days.map((day, dayIdx) => {
              const date = new Date(day.date);
              const dayLabel = SK_DAYS_SHORT[(date.getDay() + 6) % 7];
              return (
                <div key={day.date} style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: NM.SANS, fontSize: 11, fontWeight: 500, color: NM.MUTED, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                    {dayLabel} · {date.getDate()}.
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {day.meals.map((meal, slotIdx) => {
                      const isPicked = picked?.dayIndex === dayIdx && picked?.slotIndex === slotIdx;
                      return (
                        <button
                          key={meal.type}
                          onClick={() => onPickSlot(dayIdx, slotIdx)}
                          disabled={picked !== null}
                          style={{
                            all: 'unset', cursor: picked === null ? 'pointer' : 'default',
                            padding: '8px 12px', borderRadius: 999,
                            background: isPicked ? NM.SAGE : '#fff',
                            color: isPicked ? '#fff' : NM.DEEP,
                            border: `1px solid ${isPicked ? NM.SAGE : NM.HAIR_2}`,
                            fontFamily: NM.SANS, fontSize: 12, fontWeight: 500,
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                          }}
                        >
                          {meal.label}
                          {isPicked && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
