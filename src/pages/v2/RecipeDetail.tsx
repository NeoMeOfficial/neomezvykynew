import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFavorites } from '../../hooks/useFavorites';
import { recipes, type Recipe } from '../../data/recipes';
import { BackHeader, Eye, Ser, Body, NM } from '../../components/v2/neome';

/**
 * Recipe detail — R3
 *
 * Hero photo + serif title + macros strip + ingredients checklist +
 * numbered steps + sticky CTA "Pridať do jedálnička".
 *
 * Wired:
 * - Recipe loaded from src/data/recipes by :id
 * - useFavorites for the bookmark toggle
 *
 * FEATURE-NEEDED-RECIPE-ADD-TO-PLAN: actually add recipe to active
 * meal plan via useMealPlan.swapMeal — currently the button just
 * navigates back. Needs a "which day/slot?" sheet.
 *
 * Old version: RecipeDetail.old.tsx.
 */

const CAT_LABEL: Record<Recipe['category'], string> = {
  ranajky: 'Raňajky',
  obed: 'Obed',
  vecera: 'Večera',
  snack: 'Snack',
  smoothie: 'Smoothie',
};

function recipeHeroImg(r: Recipe | undefined): string {
  if (!r) return 'testimonial-recipe.jpg';
  if (r.category === 'obed') return 'section-nutrition.jpg';
  if (r.category === 'vecera') return 'program-body-forming.jpg';
  return 'testimonial-recipe.jpg';
}

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const recipe = recipes.find((r) => r.id === id);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

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

  const recipeIdNum = recipe.id.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0);
  const isFav = isFavorite(Math.abs(recipeIdNum));

  const toggleIngredient = (i: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div style={{ background: NM.BG, minHeight: '100vh', position: 'relative', fontFamily: NM.SANS, color: NM.DEEP, paddingBottom: 'calc(env(safe-area-inset-bottom) + 100px)' }}>
      <div
        style={{
          height: 340,
          position: 'relative',
          backgroundImage: `url(/images/r9/${recipeHeroImg(recipe)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 70%, rgba(248,245,240,1) 100%)' }} />
        <button
          onClick={() => navigate(-1)}
          aria-label="Späť"
          style={{
            all: 'unset',
            cursor: 'pointer',
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top) + 8px)',
            left: 18,
            width: 38,
            height: 38,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={NM.DEEP} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>

      <div style={{ marginTop: -30, position: 'relative' }}>
        <div style={{ padding: '0 18px 22px' }}>
          <Eye color={NM.GOLD} style={{ marginBottom: 12 }}>
            {CAT_LABEL[recipe.category]} · {recipe.prepTime} min · {recipe.servings} {recipe.servings === 1 ? 'porcia' : 'porcie'}
          </Eye>
          <Ser size={32} style={{ lineHeight: 1.02, marginBottom: 14 }}>{recipe.title}</Ser>
          <Body size={14} style={{ maxWidth: 320 }}>{recipe.description}</Body>
        </div>

        <div style={{ padding: '18px 18px', display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${NM.HAIR}`, borderBottom: `1px solid ${NM.HAIR}` }}>
          {[
            ['Kcal', recipe.calories],
            ['Proteín', `${recipe.protein} g`],
            ['Sach.', `${recipe.carbs} g`],
            ['Tuky', `${recipe.fat} g`],
          ].map(([k, v]) => (
            <div key={k as string} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: NM.SANS, fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: NM.TERTIARY, marginBottom: 6 }}>{k}</div>
              <div style={{ fontFamily: NM.SERIF, fontSize: 20, fontWeight: 500, color: NM.DEEP, letterSpacing: '-0.005em' }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '22px 18px 22px', borderBottom: `1px solid ${NM.HAIR}` }}>
          <Eye style={{ marginBottom: 16 }}>Suroviny · {recipe.ingredients.length}</Eye>
          <div>
            {recipe.ingredients.map((ing, i) => {
              const checked = checkedIngredients.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleIngredient(i)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 0',
                    borderBottom: i < recipe.ingredients.length - 1 ? `1px solid ${NM.HAIR}` : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      border: `1.5px solid ${checked ? NM.SAGE : NM.HAIR_2}`,
                      background: checked ? NM.SAGE : 'transparent',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {checked && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1, fontFamily: NM.SANS, fontSize: 14, color: checked ? NM.TERTIARY : NM.DEEP, lineHeight: 1.4, textDecoration: checked ? 'line-through' : 'none', textAlign: 'left' }}>
                    {ing.amount} {ing.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '22px 18px 22px' }}>
          <Eye style={{ marginBottom: 20 }}>Postup · {recipe.steps.length} {recipe.steps.length === 1 ? 'krok' : recipe.steps.length < 5 ? 'kroky' : 'krokov'}</Eye>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {recipe.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14 }}>
                <div style={{ fontFamily: NM.SERIF, fontSize: 28, fontWeight: 400, color: NM.TERRA, lineHeight: 1, letterSpacing: '-0.02em', width: 32, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ flex: 1, fontFamily: NM.SANS, fontSize: 14.5, color: NM.DEEP, lineHeight: 1.55, letterSpacing: '-0.002em' }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          padding: `16px 18px calc(env(safe-area-inset-bottom) + 16px)`,
          background: 'rgba(248,245,240,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${NM.HAIR}`,
          display: 'flex',
          gap: 10,
          zIndex: 50,
        }}
      >
        <button
          onClick={() => toggleFavorite(Math.abs(recipeIdNum), recipe.title, recipe.category)}
          aria-label="Uložiť"
          style={{
            all: 'unset',
            cursor: 'pointer',
            width: 52,
            height: 52,
            borderRadius: 999,
            background: isFav ? `${NM.TERRA}18` : 'transparent',
            border: `1px solid ${NM.HAIR_2}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? NM.TERRA : 'none'} stroke={isFav ? NM.TERRA : NM.DEEP} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>
        <button
          onClick={() => navigate('/kniznica/strava/jedalnicek')}
          style={{
            flex: 1,
            padding: '16px 20px',
            background: NM.DEEP,
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: NM.SANS,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.02em',
            cursor: 'pointer',
          }}
        >
          Pridať do jedálnička
        </button>
      </div>
    </div>
  );
}
